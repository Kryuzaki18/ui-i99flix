/**
 * TMDB API layer — proxied through the i99flix backend.
 *
 * All requests go to our own Fastify API (/api/v1/tmdb/*) which holds the
 * TMDB key server-side. The TMDB key is never exposed to the browser.
 *
 * ── Security ──────────────────────────────────────────────────────────────────
 * • No TMDB token in the client — all calls are proxied via our backend.
 * • credentials: 'include' is handled by internalApiClient (session cookie).
 * • All IDs are validated as positive integers before use in URL paths.
 * • Query params are built via URLSearchParams in internalApiClient.
 * • AbortSignal is threaded through every call for React Query cancellation.
 */

import { apiGet } from '../services/internalApiClient';
import type {
  TmdbPaginatedResponse,
  TmdbMovieListItem,
  TmdbMovieDetail,
  TmdbVideosResponse,
  TmdbCreditsResponse,
  TmdbGenre,
} from '../models/tmdb';

// ── TV-specific types (not in the existing model file) ────────────────────────

export interface TmdbTvListItem {
  id:                number;
  name:              string;
  original_name:     string;
  overview:          string;
  first_air_date:    string;
  poster_path:       string | null;
  backdrop_path:     string | null;
  genre_ids:         number[];
  vote_average:      number;
  vote_count:        number;
  popularity:        number;
  original_language: string;
}

export interface TmdbTvDetail extends Omit<TmdbTvListItem, 'genre_ids'> {
  genres:           TmdbGenre[];
  episode_run_time: number[];
  number_of_seasons:  number;
  number_of_episodes: number;
  status:           string;
  tagline:          string;
  homepage:         string;
  in_production:    boolean;
}

export interface TmdbMultiResult {
  id:           number;
  media_type:   'movie' | 'tv' | 'person';
  title?:       string;   // movies
  name?:        string;   // tv / person
  overview?:    string;
  poster_path:  string | null;
  backdrop_path: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?:   number[];
}

// ── Shared params ─────────────────────────────────────────────────────────────

export interface PageParams {
  page?:     number;
  language?: string;
}

export interface SearchParams extends PageParams {
  query: string;
}

export interface DiscoverMovieParams extends PageParams {
  sort_by?:                    string;
  with_genres?:                string;
  primary_release_year?:       number;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  'vote_average.gte'?:         number;
  'vote_average.lte'?:         number;
  include_adult?:              boolean;
  with_original_language?:     string;
}

export interface DiscoverTvParams extends PageParams {
  sort_by?:               string;
  with_genres?:           string;
  'first_air_date.gte'?:  string;
  'first_air_date.lte'?:  string;
  'vote_average.gte'?:    number;
  'vote_average.lte'?:    number;
  with_original_language?: string;
}

// ── Input validation ──────────────────────────────────────────────────────────

function validateId(id: unknown, label = 'id'): number {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Invalid ${label}: must be a positive integer`);
  }
  return n;
}

function sanitiseQuery(query: unknown): string {
  if (typeof query !== 'string') throw new Error('Search query must be a string');
  const trimmed = query.trim().slice(0, 200);
  if (!trimmed) throw new Error('Search query must not be empty');
  return trimmed;
}

function buildPageParams(params: PageParams): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (params.page     !== undefined) out['page']     = params.page;
  if (params.language !== undefined) out['language'] = params.language;
  return out;
}

// ════════════════════════════════════════════════════════════════════════════
// MOVIES
// ════════════════════════════════════════════════════════════════════════════

export async function fetchTmdbMoviesPopular(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet('/tmdb/movies/popular', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesTopRated(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet('/tmdb/movies/top-rated', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesNowPlaying(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet('/tmdb/movies/now-playing', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesUpcoming(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet('/tmdb/movies/upcoming', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesTrending(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet('/tmdb/movies/trending', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesDiscover(
  params: DiscoverMovieParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const p: Record<string, string | number | boolean> = { ...buildPageParams(params) };
  if (params.sort_by)                        p['sort_by']                        = params.sort_by;
  if (params.with_genres)                    p['with_genres']                    = params.with_genres;
  if (params.primary_release_year)           p['primary_release_year']           = params.primary_release_year;
  if (params['primary_release_date.gte'])    p['primary_release_date.gte']       = params['primary_release_date.gte'];
  if (params['primary_release_date.lte'])    p['primary_release_date.lte']       = params['primary_release_date.lte'];
  if (params['vote_average.gte'] !== undefined) p['vote_average.gte']            = params['vote_average.gte']!;
  if (params['vote_average.lte'] !== undefined) p['vote_average.lte']            = params['vote_average.lte']!;
  if (params.include_adult       !== undefined) p['include_adult']               = params.include_adult;
  if (params.with_original_language)         p['with_original_language']         = params.with_original_language;
  return apiGet('/tmdb/movies/discover', { params: p, signal: options?.signal });
}

export async function fetchTmdbMoviesSearch(
  params: SearchParams,
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const query = sanitiseQuery(params.query);
  return apiGet('/tmdb/movies/search', {
    params: { query, ...buildPageParams(params) },
    signal: options?.signal,
  });
}

export async function fetchTmdbMovieDetail(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbMovieDetail> {
  const safeId = validateId(id, 'movieId');
  return apiGet(`/tmdb/movies/${safeId}`, { signal: options?.signal });
}

export async function fetchTmdbMovieVideos(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbVideosResponse> {
  const safeId = validateId(id, 'movieId');
  return apiGet(`/tmdb/movies/${safeId}/videos`, { signal: options?.signal });
}

export async function fetchTmdbMovieCredits(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbCreditsResponse> {
  const safeId = validateId(id, 'movieId');
  return apiGet(`/tmdb/movies/${safeId}/credits`, { signal: options?.signal });
}

export async function fetchTmdbMovieSimilar(
  id: number,
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const safeId = validateId(id, 'movieId');
  return apiGet(`/tmdb/movies/${safeId}/similar`, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMovieRecommendations(
  id: number,
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const safeId = validateId(id, 'movieId');
  return apiGet(`/tmdb/movies/${safeId}/recommendations`, { params: buildPageParams(params), signal: options?.signal });
}

// ════════════════════════════════════════════════════════════════════════════
// TV SERIES
// ════════════════════════════════════════════════════════════════════════════

export async function fetchTmdbTvPopular(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet('/tmdb/tv/popular', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvTopRated(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet('/tmdb/tv/top-rated', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvOnTheAir(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet('/tmdb/tv/on-the-air', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvAiringToday(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet('/tmdb/tv/airing-today', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvTrending(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet('/tmdb/tv/trending', { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvDiscover(
  params: DiscoverTvParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  const p: Record<string, string | number | boolean> = { ...buildPageParams(params) };
  if (params.sort_by)                       p['sort_by']                       = params.sort_by;
  if (params.with_genres)                   p['with_genres']                   = params.with_genres;
  if (params['first_air_date.gte'])         p['first_air_date.gte']            = params['first_air_date.gte'];
  if (params['first_air_date.lte'])         p['first_air_date.lte']            = params['first_air_date.lte'];
  if (params['vote_average.gte'] !== undefined) p['vote_average.gte']          = params['vote_average.gte']!;
  if (params['vote_average.lte'] !== undefined) p['vote_average.lte']          = params['vote_average.lte']!;
  if (params.with_original_language)        p['with_original_language']        = params.with_original_language;
  return apiGet('/tmdb/tv/discover', { params: p, signal: options?.signal });
}

export async function fetchTmdbTvSearch(
  params: SearchParams,
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  const query = sanitiseQuery(params.query);
  return apiGet('/tmdb/tv/search', {
    params: { query, ...buildPageParams(params) },
    signal: options?.signal,
  });
}

export async function fetchTmdbTvDetail(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbTvDetail> {
  const safeId = validateId(id, 'tvId');
  return apiGet(`/tmdb/tv/${safeId}`, { signal: options?.signal });
}

export async function fetchTmdbTvVideos(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbVideosResponse> {
  const safeId = validateId(id, 'tvId');
  return apiGet(`/tmdb/tv/${safeId}/videos`, { signal: options?.signal });
}

export async function fetchTmdbTvCredits(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbCreditsResponse> {
  const safeId = validateId(id, 'tvId');
  return apiGet(`/tmdb/tv/${safeId}/credits`, { signal: options?.signal });
}

export async function fetchTmdbTvSimilar(
  id: number,
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  const safeId = validateId(id, 'tvId');
  return apiGet(`/tmdb/tv/${safeId}/similar`, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvRecommendations(
  id: number,
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  const safeId = validateId(id, 'tvId');
  return apiGet(`/tmdb/tv/${safeId}/recommendations`, { params: buildPageParams(params), signal: options?.signal });
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED
// ════════════════════════════════════════════════════════════════════════════

export async function fetchTmdbSearchMulti(
  params: SearchParams,
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMultiResult>> {
  const query = sanitiseQuery(params.query);
  return apiGet('/tmdb/search', {
    params: { query, ...buildPageParams(params) },
    signal: options?.signal,
  });
}

export async function fetchTmdbGenresMovie(
  options?: { signal?: AbortSignal },
): Promise<{ genres: TmdbGenre[] }> {
  return apiGet('/tmdb/genres/movie', { signal: options?.signal });
}

export async function fetchTmdbGenresTv(
  options?: { signal?: AbortSignal },
): Promise<{ genres: TmdbGenre[] }> {
  return apiGet('/tmdb/genres/tv', { signal: options?.signal });
}
