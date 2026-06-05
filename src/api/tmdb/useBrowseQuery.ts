import { useQuery } from '@tanstack/react-query';
import { tmdbKeys } from '../queryKeys';
import {
  fetchTmdbMoviesDiscover,
  fetchTmdbMoviesSearch,
  fetchTmdbTvDiscover,
  fetchTmdbTvSearch,
} from './tmdbApi';
import { tmdbMovieListItemToMovie, tmdbTvListItemToMovie } from '../../utils/tmdbAdapter';
import { useBrowseStore, selectActiveFilters } from '../../store/browseStore';
import { useTmdbStore } from '../../store/tmdbStore';
import { useDebounce } from '../../hooks/useDebounce';
import { useCombinedGenreMap } from '../../hooks/useGenreMap';
import { YEAR_RANGES } from '../../constants/yearRanges';
import type { Movie } from '../../models/movieModel';

export interface BrowseResult {
  movies:     Movie[];
  total:      number;
  page:       number;
  totalPages: number;
}

const STALE_TIME   = 5 * 60 * 1000;
const TMDB_MAX_PAGE = 500;

export function useBrowseQuery() {
  const mediaType = useBrowseStore((s) => s.mediaType);
  const { selectedGenre, selectedYear, searchQuery, page } = useBrowseStore(selectActiveFilters);

  const movieGenres = useTmdbStore((s) => s.movieGenres);
  const tvGenres    = useTmdbStore((s) => s.tvGenres);
  const genreMap    = useCombinedGenreMap();

  const debouncedSearch = useDebounce(searchQuery, 400);
  const isSearching     = debouncedSearch.trim().length > 0;
  const isMovie         = mediaType === 'movie';

  const safePage = Math.max(1, Math.min(page, TMDB_MAX_PAGE));

  const activeGenres = isMovie ? movieGenres : tvGenres;
  const foundGenre   = activeGenres.find((g) => g.name === selectedGenre);
  const genreId      = selectedGenre !== 'all' && foundGenre ? foundGenre.id : undefined;

  const today = new Date().toISOString().slice(0, 10);

  const yearRange  = YEAR_RANGES.find((r) => r.value === selectedYear);
  const dateGte    = yearRange && yearRange.value !== 'all' ? `${yearRange.min}-01-01` : undefined;
  const rawDateLte = yearRange && yearRange.value !== 'all' ? `${yearRange.max}-12-31` : undefined;
  const dateLte    = rawDateLte && rawDateLte < today ? rawDateLte : today;

  const searchResult = useQuery<BrowseResult>({
    queryKey: isMovie
      ? tmdbKeys.movies.search({ query: debouncedSearch, page: safePage })
      : tmdbKeys.tv.search({ query: debouncedSearch, page: safePage }),
    queryFn: async () => {
      if (isMovie) {
        const res = await fetchTmdbMoviesSearch({ query: debouncedSearch, page: safePage });
        const filtered = res.results.filter((m) => m.release_date && m.release_date <= today);
        return {
          movies:     filtered.map((m) => tmdbMovieListItemToMovie(m, genreMap)),
          total:      res.total_results,
          page:       res.page,
          totalPages: Math.min(res.total_pages, TMDB_MAX_PAGE),
        };
      } else {
        const res = await fetchTmdbTvSearch({ query: debouncedSearch, page: safePage });
        const filtered = res.results.filter((m) => m.first_air_date && m.first_air_date <= today);
        return {
          movies:     filtered.map((m) => tmdbTvListItemToMovie(m, genreMap)),
          total:      res.total_results,
          page:       res.page,
          totalPages: Math.min(res.total_pages, TMDB_MAX_PAGE),
        };
      }
    },
    enabled:         isSearching,
    staleTime:       STALE_TIME,
    placeholderData: (prev) => prev,
  });

  const movieDiscoverParams = {
    page:                        safePage,
    with_genres:                 genreId ? String(genreId) : undefined,
    'primary_release_date.gte':  dateGte,
    'primary_release_date.lte':  dateLte,
    sort_by:                     'popularity.desc',
  };

  const tvDiscoverParams = {
    page:                  safePage,
    with_genres:           genreId ? String(genreId) : undefined,
    'first_air_date.gte':  dateGte,
    'first_air_date.lte':  dateLte,
    sort_by:               'popularity.desc',
  };

  const discoverResult = useQuery<BrowseResult>({
    queryKey: isMovie
      ? tmdbKeys.movies.discover(movieDiscoverParams)
      : tmdbKeys.tv.discover(tvDiscoverParams),
    queryFn: async () => {
      if (isMovie) {
        const res = await fetchTmdbMoviesDiscover(movieDiscoverParams);
        return {
          movies:     res.results.map((m) => tmdbMovieListItemToMovie(m, genreMap)),
          total:      res.total_results,
          page:       res.page,
          totalPages: Math.min(res.total_pages, TMDB_MAX_PAGE),
        };
      } else {
        const res = await fetchTmdbTvDiscover(tvDiscoverParams);
        return {
          movies:     res.results.map((m) => tmdbTvListItemToMovie(m, genreMap)),
          total:      res.total_results,
          page:       res.page,
          totalPages: Math.min(res.total_pages, TMDB_MAX_PAGE),
        };
      }
    },
    enabled:         !isSearching,
    staleTime:       STALE_TIME,
    placeholderData: (prev) => prev,
  });

  return isSearching ? searchResult : discoverResult;
}
