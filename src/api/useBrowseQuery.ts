/**
 * React Query hook for the Browse page.
 *
 * Uses TMDB discover (filters) or search (free-text) via the backend proxy.
 * Pagination is server-side — TMDB returns 20 results per page.
 *
 * Search is debounced by 400 ms to avoid firing on every keystroke.
 * Genre/year filter changes apply immediately and reset to page 1.
 */

import { useQuery } from '@tanstack/react-query';
import { tmdbKeys } from './queryKeys';
import {
  fetchTmdbMoviesDiscover,
  fetchTmdbMoviesSearch,
  fetchTmdbGenresMovie,
} from './tmdbApi';
import { tmdbMovieListItemToMovie, buildGenreMap } from '../utils/tmdbAdapter';
import { useBrowseStore } from '../store/browseStore';
import { useDebounce } from '../hooks/useDebounce';
import { YEAR_RANGES } from '../constants/yearRanges';
import type { Movie } from '../models/movie';

// TMDB genre name → TMDB genre ID map (static — matches TMDB's official list)
const TMDB_GENRE_IDS: Record<string, number> = {
  Action:    28,
  Drama:     18,
  Comedy:    35,
  Thriller:  53,
  'Sci-Fi':  878,
  Horror:    27,
  Romance:   10749,
  Animation: 16,
};

async function getGenreMap(): Promise<Map<number, string>> {
  try {
    const res = await fetchTmdbGenresMovie();
    return buildGenreMap(res.genres);
  } catch {
    return new Map();
  }
}

export interface BrowseResult {
  movies:      Movie[];
  total:       number;
  page:        number;
  totalPages:  number;
}

export function useBrowseQuery() {
  const { selectedGenre, selectedYear, searchQuery, page } = useBrowseStore();

  // Debounce free-text search only
  const debouncedSearch = useDebounce(searchQuery, 400);

  const isSearching = debouncedSearch.trim().length > 0;

  // Build year range filter params for discover
  const yearRange = YEAR_RANGES.find((r) => r.value === selectedYear);
  const genreId   = selectedGenre !== 'all' ? TMDB_GENRE_IDS[selectedGenre] : undefined;

  // ── Search mode ───────────────────────────────────────────────────────────
  const searchResult = useQuery<BrowseResult>({
    queryKey: tmdbKeys.movies.search({ query: debouncedSearch, page }),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesSearch({ query: debouncedSearch, page }, { signal }),
        getGenreMap(),
      ]);
      return {
        movies:     res.results.map((m) => tmdbMovieListItemToMovie(m, genreMap)),
        total:      res.total_results,
        page:       res.page,
        totalPages: res.total_pages,
      };
    },
    enabled:  isSearching,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  // ── Discover mode (genre + year filters) ──────────────────────────────────
  const discoverParams = {
    page,
    with_genres:                 genreId ? String(genreId) : undefined,
    'primary_release_date.gte':  yearRange && yearRange.value !== 'all'
                                   ? `${yearRange.min}-01-01`
                                   : undefined,
    'primary_release_date.lte':  yearRange && yearRange.value !== 'all'
                                   ? `${yearRange.max}-12-31`
                                   : undefined,
    sort_by: 'popularity.desc',
  };

  const discoverResult = useQuery<BrowseResult>({
    queryKey: tmdbKeys.movies.discover(discoverParams),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesDiscover(discoverParams, { signal }),
        getGenreMap(),
      ]);
      return {
        movies:     res.results.map((m) => tmdbMovieListItemToMovie(m, genreMap)),
        total:      res.total_results,
        page:       res.page,
        totalPages: res.total_pages,
      };
    },
    enabled:  !isSearching,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  return isSearching ? searchResult : discoverResult;
}
