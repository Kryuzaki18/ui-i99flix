import { useQuery } from '@tanstack/react-query';
import { tmdbKeys } from '../queryKeys';
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
  type PageParams,
  type SearchParams,
  type DiscoverMovieParams,
  type DiscoverTvParams,
} from './tmdbApi';

const LIST_STALE_TIME   = 5  * 60 * 1000;
const DETAIL_STALE_TIME = 10 * 60 * 1000;

export function useTmdbMoviesPopularQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.popular(params),
    queryFn:  () => fetchTmdbMoviesPopular(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesTopRatedQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.topRated(params),
    queryFn:  () => fetchTmdbMoviesTopRated(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesNowPlayingQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.nowPlaying(params),
    queryFn:  () => fetchTmdbMoviesNowPlaying(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesUpcomingQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.upcoming(params),
    queryFn:  () => fetchTmdbMoviesUpcoming(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesTrendingQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.trending(params),
    queryFn:  () => fetchTmdbMoviesTrending(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesDiscoverQuery(params: DiscoverMovieParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.discover(params),
    queryFn:  () => fetchTmdbMoviesDiscover(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMoviesSearchQuery(params: SearchParams) {
  const enabled = params.query.trim().length > 0;
  return useQuery({
    queryKey: tmdbKeys.movies.search(params),
    queryFn:  () => fetchTmdbMoviesSearch(params),
    enabled,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMovieDetailQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.movies.detail(id ?? 0),
    queryFn:  () => fetchTmdbMovieDetail(id!),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbMovieVideosQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.movies.videos(id ?? 0),
    queryFn:  () => fetchTmdbMovieVideos(id!),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbMovieCreditsQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.movies.credits(id ?? 0),
    queryFn:  () => fetchTmdbMovieCredits(id!),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbMovieSimilarQuery(id: number | null, params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.similar(id ?? 0, params),
    queryFn:  () => fetchTmdbMovieSimilar(id!, params),
    enabled:  id !== null && id > 0,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbMovieRecommendationsQuery(id: number | null, params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.movies.recommendations(id ?? 0, params),
    queryFn:  () => fetchTmdbMovieRecommendations(id!, params),
    enabled:  id !== null && id > 0,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvPopularQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.popular(params),
    queryFn:  () => fetchTmdbTvPopular(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvTopRatedQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.topRated(params),
    queryFn:  () => fetchTmdbTvTopRated(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvOnTheAirQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.onTheAir(params),
    queryFn:  () => fetchTmdbTvOnTheAir(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvAiringTodayQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.airingToday(params),
    queryFn:  () => fetchTmdbTvAiringToday(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvTrendingQuery(params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.trending(params),
    queryFn:  () => fetchTmdbTvTrending(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvDiscoverQuery(params: DiscoverTvParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.discover(params),
    queryFn:  () => fetchTmdbTvDiscover(params),
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvSearchQuery(params: SearchParams) {
  const enabled = params.query.trim().length > 0;
  return useQuery({
    queryKey: tmdbKeys.tv.search(params),
    queryFn:  () => fetchTmdbTvSearch(params),
    enabled,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvDetailQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.tv.detail(id ?? 0),
    queryFn:  () => fetchTmdbTvDetail(id!),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbTvVideosQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.tv.videos(id ?? 0),
    queryFn:  () => fetchTmdbTvVideos(id!),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbTvCreditsQuery(id: number | null) {
  return useQuery({
    queryKey: tmdbKeys.tv.credits(id ?? 0),
    queryFn:  () => fetchTmdbTvCredits(id!),
    enabled:  id !== null && id > 0,
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useTmdbTvSimilarQuery(id: number | null, params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.similar(id ?? 0, params),
    queryFn:  () => fetchTmdbTvSimilar(id!, params),
    enabled:  id !== null && id > 0,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbTvRecommendationsQuery(id: number | null, params: PageParams = {}) {
  return useQuery({
    queryKey: tmdbKeys.tv.recommendations(id ?? 0, params),
    queryFn:  () => fetchTmdbTvRecommendations(id!, params),
    enabled:  id !== null && id > 0,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useTmdbSearchMultiQuery(params: SearchParams) {
  const enabled = params.query.trim().length > 0;
  return useQuery({
    queryKey: tmdbKeys.searchMulti(params),
    queryFn:  () => fetchTmdbSearchMulti(params),
    enabled,
    staleTime: LIST_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}
