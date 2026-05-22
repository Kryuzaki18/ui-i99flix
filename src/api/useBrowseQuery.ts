import { useQuery } from '@tanstack/react-query';
import { tmdbKeys } from './queryKeys';
import {
  fetchTmdbMoviesDiscover,
  fetchTmdbMoviesSearch,
  fetchTmdbTvDiscover,
  fetchTmdbTvSearch,
} from './tmdbApi';
import { tmdbMovieListItemToMovie, tmdbTvListItemToMovie } from '../utils/tmdbAdapter';
import { useBrowseStore } from '../store/browseStore';
import { useDebounce } from '../hooks/useDebounce';
import { YEAR_RANGES } from '../constants/yearRanges';
import { useTmdbGenresMovieQuery, useTmdbGenresTvQuery } from './useTmdbQuery';
import type { Movie } from '../models/movie';

export interface BrowseResult {
  movies: Movie[];
  total: number;
  page: number;
  totalPages: number;
}

const STALE_TIME = 5 * 60 * 1000;

export function useBrowseQuery() {
  const { mediaType, selectedGenre, selectedYear, searchQuery, page } = useBrowseStore();

  const { data: movieGenresData } = useTmdbGenresMovieQuery();
  const { data: tvGenresData } = useTmdbGenresTvQuery();

  const movieGenres = movieGenresData?.genres ?? [];
  const tvGenres = tvGenresData?.genres ?? [];

  const genreMap = new Map([...movieGenres, ...tvGenres].map((g) => [g.id, g.name]));

  const debouncedSearch = useDebounce(searchQuery, 400);
  const isSearching = debouncedSearch.trim().length > 0;
  const isMovie = mediaType === 'movie';

  const activeGenres = isMovie ? movieGenres : tvGenres;
  const foundGenre = activeGenres.find((g) => g.name === selectedGenre);
  const genreId = selectedGenre !== 'all' && foundGenre ? foundGenre.id : undefined;

  const yearRange = YEAR_RANGES.find((r) => r.value === selectedYear);
  const dateGte = yearRange && yearRange.value !== 'all' ? `${yearRange.min}-01-01` : undefined;
  const dateLte = yearRange && yearRange.value !== 'all' ? `${yearRange.max}-12-31` : undefined;

  const searchResult = useQuery<BrowseResult>({
    queryKey: isMovie
      ? tmdbKeys.movies.search({ query: debouncedSearch, page })
      : tmdbKeys.tv.search({ query: debouncedSearch, page }),
    queryFn: async ({ signal }) => {
      const res = await (isMovie
        ? fetchTmdbMoviesSearch({ query: debouncedSearch, page }, { signal })
        : fetchTmdbTvSearch({ query: debouncedSearch, page }, { signal }));
      const movies = isMovie
        ? res.results.map((m) => tmdbMovieListItemToMovie(m, genreMap))
        : res.results.map((m) => tmdbTvListItemToMovie(m, genreMap));
      return {
        movies,
        total: res.total_results,
        page: res.page,
        totalPages: res.total_pages,
      };
    },
    enabled: isSearching,
    staleTime: STALE_TIME,
    placeholderData: (prev) => prev,
  });

  const movieDiscoverParams = {
    page,
    with_genres: genreId ? String(genreId) : undefined,
    'primary_release_date.gte': dateGte,
    'primary_release_date.lte': dateLte,
    sort_by: 'popularity.desc',
  };

  const tvDiscoverParams = {
    page,
    with_genres: genreId ? String(genreId) : undefined,
    'first_air_date.gte': dateGte,
    'first_air_date.lte': dateLte,
    sort_by: 'popularity.desc',
  };

  const discoverResult = useQuery<BrowseResult>({
    queryKey: isMovie
      ? tmdbKeys.movies.discover(movieDiscoverParams)
      : tmdbKeys.tv.discover(tvDiscoverParams),
    queryFn: async ({ signal }) => {
      const res = await (isMovie
        ? fetchTmdbMoviesDiscover(movieDiscoverParams, { signal })
        : fetchTmdbTvDiscover(tvDiscoverParams, { signal }));
      const movies = isMovie
        ? res.results.map((m) => tmdbMovieListItemToMovie(m, genreMap))
        : res.results.map((m) => tmdbTvListItemToMovie(m, genreMap));
      return {
        movies,
        total: res.total_results,
        page: res.page,
        totalPages: res.total_pages,
      };
    },
    enabled: !isSearching,
    staleTime: STALE_TIME,
    placeholderData: (prev) => prev,
  });

  return isSearching ? searchResult : discoverResult;
}
