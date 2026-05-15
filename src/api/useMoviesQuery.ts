/**
 * React Query hooks for Home page movie sections.
 *
 * Data now comes from the TMDB proxy on the i99flix backend.
 * Each hook maps the TMDB response to the app's Movie model via tmdbAdapter
 * so no TMDB-specific types leak into pages or components.
 *
 * Stale times are set to 5 min — real API data can change.
 */

import { useQuery } from '@tanstack/react-query';
import { tmdbKeys } from './queryKeys';
import {
  fetchTmdbMoviesTrending,
  fetchTmdbMoviesPopular,
  fetchTmdbMoviesNowPlaying,
  fetchTmdbMoviesTopRated,
  fetchTmdbMovieDetail,
} from './tmdbApi';
import {
  tmdbMovieListItemToMovie,
  tmdbMovieDetailToMovie,
} from '../utils/tmdbAdapter';
import { getGenreMap } from '../utils/genreMap';
import type { Movie } from '../models/movie';

const STALE_TIME = 5 * 60 * 1000; // 5 min

// ── Featured — popular movies (used for hero banner) ─────────────────────────
export function useFeaturedMoviesQuery() {
  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.popular({}),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesPopular({ page: 1 }, { signal }),
        getGenreMap(),
      ]);
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

// ── Trending ──────────────────────────────────────────────────────────────────

export function useTrendingMoviesQuery() {
  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.trending({}),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesTrending({ page: 1 }, { signal }),
        getGenreMap(),
      ]);
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

// ── New Releases — now playing ────────────────────────────────────────────────
export function useNewReleasesQuery() {
  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.nowPlaying({}),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesNowPlaying({ page: 1 }, { signal }),
        getGenreMap(),
      ]);
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

// ── Top Rated ─────────────────────────────────────────────────────────────────
export function useTopRatedMoviesQuery() {
  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.topRated({}),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesTopRated({ page: 1 }, { signal }),
        getGenreMap(),
      ]);
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

// ── Single movie detail — used by the /player/:id page ───────────────────────
export function useMovieDetailQuery(id: number | null) {
  return useQuery<Movie>({
    queryKey: tmdbKeys.movies.detail(id ?? 0),
    queryFn:  async ({ signal }) => {
      const detail = await fetchTmdbMovieDetail(id!, { signal });
      return tmdbMovieDetailToMovie(detail);
    },
    enabled:   id !== null && id > 0,
    staleTime: 10 * 60 * 1000, // 10 min — detail data is stable
  });
}
