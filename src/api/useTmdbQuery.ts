/**
 * React Query hooks for TMDB data — proxied through the i99flix backend.
 *
 * All hooks follow the same patterns as useInternalMoviesQuery.ts:
 * - staleTime: 5 min for list/search data, 10 min for detail/static data
 * - placeholderData keeps previous data visible during refetch
 * - AbortSignal is threaded through for cancellation on unmount
 * - Hooks are disabled when required params are missing
 *
 * ── Usage ──────────────────────────────────────────────────────────────────
 * import { useTmdbMoviesPopularQuery, useTmdbSearchMultiQuery } from '../api/useTmdbQuery';
 */

import { useQuery } from '@tanstack/react-query';
import { tmdbKeys } from './queryKeys';
import {
  fetchTmdbMoviesPopular,
  fetchTmdbMoviesTopRated,
  fetchTmdbMoviesNowPlaying,
  fetchTmdbMoviesUpcoming,
  fetchTmdbMoviesTrending,
  fetchTmdbMoviesDiscover,
  fetchTmdbMoviesSearch,
  fetchTmdbMovieDetail,
  fetchTmdbMovieVideos,
  fetchTmdbMovieCredits,
  fetchTmdbMovieSimilar,
  fetchTmdbMovieRecommendations,
  fetchTmdbTvPopular,
  fetchTmdbTvTopRated,
  fetchTmdbTvOnTheAir,
  fetchTmdbTvAiringToday,
  fetchTmdbTvTrending,
  fetchTmdbTvDiscover,
  fetchTmdbTvSearch,
  fetchTmdbTvDetail,
  fetchTmdbTvVideos,
  fetchTmdbTvCredits,
  fetchTmdbTvSimilar,
  fetchTmdbTvRecommendations,
  fetchTmdbSearchMulti,
  fetchTmdbGenresMovie,
  fetchTmdbGenresTv,
  type PageParams,
  type SearchParams,
  type DiscoverMovieParams,
  type DiscoverTvParams,
} from './tmdbApi';

// Stale times
const LIST_STALE_TIME   = 5  * 60 * 1000; // 5 min — list data changes occasionally
const DETAIL_STALE_TIME = 10 * 60 * 1000; // 10 min — detail data is more stable
const GENRE_STALE_TIME  = 60 * 60 * 1000; // 1 hr  — genres rarely change

// ════════════════════════════════════════════════════════════════════════════
// MOVIES
// ════════════════════════════════════════════════════════════════════════════

export function useTmdbMoviesPopularQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.popular(params),
    queryFn:  ({ signal }) => fetchTmdbMoviesPopular(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesTopRatedQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.topRated(params),
    queryFn:  ({ signal }) => fetchTmdbMoviesTopRated(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesNowPlayingQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.nowPlaying(params),
    queryFn:  ({ signal }) => fetchTmdbMoviesNowPlaying(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesUpcomingQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.upcoming(params),
    queryFn:  ({ signal }) => fetchTmdbMoviesUpcoming(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesTrendingQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.trending(params),
    queryFn:  ({ signal }) => fetchTmdbMoviesTrending(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesDiscoverQuery(params: DiscoverMovieParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.discover(params),
    queryFn:  ({ signal }) => fetchTmdbMoviesDiscover(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

/** Disabled when query is empty */
export function useTmdbMoviesSearchQuery(params: SearchParams) {
  const enabled = params.query.trim().length > 0;
  return useQuery({
    queryKey: tmdbKeys.movies.search(params),
    queryFn:  ({ signal }) => fetchTmdbMoviesSearch(params, { signal }),
    enabled,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

/** Disabled when id is null/0 */
export function useTmdbMovieDetailQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.movies.detail(id ?? 0),
    queryFn:  ({ signal }) => fetchTmdbMovieDetail(id!, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbMovieVideosQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.movies.videos(id ?? 0),
    queryFn:  ({ signal }) => fetchTmdbMovieVideos(id!, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbMovieCreditsQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.movies.credits(id ?? 0),
    queryFn:  ({ signal }) => fetchTmdbMovieCredits(id!, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbMovieSimilarQuery(id: number | null, params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.similar(id ?? 0, params),
    queryFn:  ({ signal }) => fetchTmdbMovieSimilar(id!, params, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMovieRecommendationsQuery(id: number | null, params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.recommendations(id ?? 0, params),
    queryFn:  ({ signal }) => fetchTmdbMovieRecommendations(id!, params, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// TV SERIES
// ════════════════════════════════════════════════════════════════════════════

export function useTmdbTvPopularQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.popular(params),
    queryFn:  ({ signal }) => fetchTmdbTvPopular(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvTopRatedQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.topRated(params),
    queryFn:  ({ signal }) => fetchTmdbTvTopRated(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvOnTheAirQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.onTheAir(params),
    queryFn:  ({ signal }) => fetchTmdbTvOnTheAir(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvAiringTodayQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.airingToday(params),
    queryFn:  ({ signal }) => fetchTmdbTvAiringToday(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvTrendingQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.trending(params),
    queryFn:  ({ signal }) => fetchTmdbTvTrending(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvDiscoverQuery(params: DiscoverTvParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.discover(params),
    queryFn:  ({ signal }) => fetchTmdbTvDiscover(params, { signal }),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

/** Disabled when query is empty */
export function useTmdbTvSearchQuery(params: SearchParams) {
  const enabled = params.query.trim().length > 0;
  return useQuery({
    queryKey: tmdbKeys.tv.search(params),
    queryFn:  ({ signal }) => fetchTmdbTvSearch(params, { signal }),
    enabled,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

/** Disabled when id is null/0 */
export function useTmdbTvDetailQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.tv.detail(id ?? 0),
    queryFn:  ({ signal }) => fetchTmdbTvDetail(id!, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbTvVideosQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.tv.videos(id ?? 0),
    queryFn:  ({ signal }) => fetchTmdbTvVideos(id!, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbTvCreditsQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.tv.credits(id ?? 0),
    queryFn:  ({ signal }) => fetchTmdbTvCredits(id!, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbTvSimilarQuery(id: number | null, params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.similar(id ?? 0, params),
    queryFn:  ({ signal }) => fetchTmdbTvSimilar(id!, params, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvRecommendationsQuery(id: number | null, params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.recommendations(id ?? 0, params),
    queryFn:  ({ signal }) => fetchTmdbTvRecommendations(id!, params, { signal }),
    enabled:  id !== null && id > 0,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED
// ════════════════════════════════════════════════════════════════════════════

/** Multi-search across movies, TV, and people. Disabled when query is empty. */
export function useTmdbSearchMultiQuery(params: SearchParams) {
  const enabled = params.query.trim().length > 0;
  return useQuery({
    queryKey: tmdbKeys.searchMulti(params),
    queryFn:  ({ signal }) => fetchTmdbSearchMulti(params, { signal }),
    enabled,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

/** Movie genre list — cached for 1 hour */
export function useTmdbGenresMovieQuery() {
  return useQuery({
    queryKey: tmdbKeys.genresMovie(),
    queryFn:  ({ signal }) => fetchTmdbGenresMovie({ signal }),
    staleTime: GENRE_STALE_TIME,
  });
}

/** TV genre list — cached for 1 hour */
export function useTmdbGenresTvQuery() {
  return useQuery({
    queryKey: tmdbKeys.genresTv(),
    queryFn:  ({ signal }) => fetchTmdbGenresTv({ signal }),
    staleTime: GENRE_STALE_TIME,
  });
}
