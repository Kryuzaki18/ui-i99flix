/**
 * useBrowseQuery — generic browse hook for both Movies and TV Series.
 *
 * Reads mediaType from browseStore and delegates to the correct TMDB
 * endpoint (movies or tv). All filter/pagination logic is shared.
 *
 * Search is debounced 400ms. Discover mode uses genre + year filters.
 */

import { useQuery } from '@tanstack/react-query';
import { tmdbKeys } from './queryKeys';
import {
  fetchTmdbMoviesDiscover,
  fetchTmdbMoviesSearch,
  fetchTmdbTvDiscover,
  fetchTmdbTvSearch,
} from './tmdbApi';
import { tmdbMovieListItemToMovie, tmdbTvListItemToMovie } from '../utils/tmdbAdapter';
import { getGenreMap } from '../utils/genreMap';
import { useBrowseStore } from '../store/browseStore';
import { useDebounce } from '../hooks/useDebounce';
import { YEAR_RANGES } from '../constants/yearRanges';
import { MOVIE_GENRE_IDS, TV_GENRE_IDS } from '../constants/genres';
import type { Movie } from '../models/movie';

export interface BrowseResult {
  movies:     Movie[];
  total:      number;
  page:       number;
  totalPages: number;
}

const STALE_TIME = 5 * 60 * 1000;

export function useBrowseQuery() {
  const { mediaType, selectedGenre, selectedYear, searchQuery, page } = useBrowseStore();

  const debouncedSearch = useDebounce(searchQuery, 400);
  const isSearching     = debouncedSearch.trim().length > 0;
  const isMovie         = mediaType === 'movie';

  // Genre ID lookup — use the correct map per media type
  const genreIdMap = isMovie ? MOVIE_GENRE_IDS : TV_GENRE_IDS;
  const genreId    = selectedGenre !== 'all' ? genreIdMap[selectedGenre] : undefined;

  // Year range — movies use primary_release_date, TV uses first_air_date
  const yearRange  = YEAR_RANGES.find((r) => r.value === selectedYear);
  const dateGte    = yearRange && yearRange.value !== 'all' ? `${yearRange.min}-01-01` : undefined;
  const dateLte    = yearRange && yearRange.value !== 'all' ? `${yearRange.max}-12-31` : undefined;

  // ── Search ────────────────────────────────────────────────────────────────
  const searchResult = useQuery<BrowseResult>({
    queryKey: isMovie
      ? tmdbKeys.movies.search({ query: debouncedSearch, page })
      : tmdbKeys.tv.search({ query: debouncedSearch, page }),
    queryFn: async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        isMovie
          ? fetchTmdbMoviesSearch({ query: debouncedSearch, page }, { signal })
          : fetchTmdbTvSearch({ query: debouncedSearch, page }, { signal }),
        getGenreMap(),
      ]);
      const movies = isMovie
        ? (res as Awaited<ReturnType<typeof fetchTmdbMoviesSearch>>).results
            .map((m) => tmdbMovieListItemToMovie(m, genreMap))
        : (res as Awaited<ReturnType<typeof fetchTmdbTvSearch>>).results
            .map((m) => tmdbTvListItemToMovie(m, genreMap));
      return {
        movies,
        total:      res.total_results,
        page:       res.page,
        totalPages: res.total_pages,
      };
    },
    enabled:         isSearching,
    staleTime:       STALE_TIME,
    placeholderData: (prev) => prev,
  });

  // ── Discover ──────────────────────────────────────────────────────────────
  const movieDiscoverParams = {
    page,
    with_genres:                genreId ? String(genreId) : undefined,
    'primary_release_date.gte': dateGte,
    'primary_release_date.lte': dateLte,
    sort_by: 'popularity.desc',
  };

  const tvDiscoverParams = {
    page,
    with_genres:          genreId ? String(genreId) : undefined,
    'first_air_date.gte': dateGte,
    'first_air_date.lte': dateLte,
    sort_by: 'popularity.desc',
  };

  const discoverResult = useQuery<BrowseResult>({
    queryKey: isMovie
      ? tmdbKeys.movies.discover(movieDiscoverParams)
      : tmdbKeys.tv.discover(tvDiscoverParams),
    queryFn: async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        isMovie
          ? fetchTmdbMoviesDiscover(movieDiscoverParams, { signal })
          : fetchTmdbTvDiscover(tvDiscoverParams, { signal }),
        getGenreMap(),
      ]);
      const movies = isMovie
        ? (res as Awaited<ReturnType<typeof fetchTmdbMoviesDiscover>>).results
            .map((m) => tmdbMovieListItemToMovie(m, genreMap))
        : (res as Awaited<ReturnType<typeof fetchTmdbTvDiscover>>).results
            .map((m) => tmdbTvListItemToMovie(m, genreMap));
      return {
        movies,
        total:      res.total_results,
        page:       res.page,
        totalPages: res.total_pages,
      };
    },
    enabled:         !isSearching,
    staleTime:       STALE_TIME,
    placeholderData: (prev) => prev,
  });

  return isSearching ? searchResult : discoverResult;
}
