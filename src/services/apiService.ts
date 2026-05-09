/**
 * TMDB API Service — CRUD operations for movies/videos
 *
 * Implements the full set of read and write operations available from the
 * TMDB v3 API: https://developer.themoviedb.org/reference/getting-started
 *
 * ── CRUD mapping ──────────────────────────────────────────────────────────────
 *
 *  CREATE  addRating()        POST /movie/{id}/rating
 *          addToWatchlist()   POST /account/{id}/watchlist
 *          addToFavourites()  POST /account/{id}/favorite
 *
 *  READ    getMovie()         GET  /movie/{id}
 *          getMovieVideos()   GET  /movie/{id}/videos
 *          getMovieCredits()  GET  /movie/{id}/credits
 *          getMovieImages()   GET  /movie/{id}/images
 *          getSimilar()       GET  /movie/{id}/similar
 *          getRecommendations() GET /movie/{id}/recommendations
 *          searchMovies()     GET  /search/movie
 *          discoverMovies()   GET  /discover/movie
 *          getTrending()      GET  /trending/movie/{window}
 *          getPopular()       GET  /movie/popular
 *          getTopRated()      GET  /movie/top_rated
 *          getNowPlaying()    GET  /movie/now_playing
 *          getUpcoming()      GET  /movie/upcoming
 *          getGenres()        GET  /genre/movie/list
 *          getAccountStates() GET  /movie/{id}/account_states
 *          getWatchlist()     GET  /account/{id}/watchlist/movies
 *          getFavourites()    GET  /account/{id}/favorite/movies
 *
 *  UPDATE  addRating()        POST /movie/{id}/rating  (same endpoint, idempotent)
 *
 *  DELETE  deleteRating()     DELETE /movie/{id}/rating
 *          removeFromWatchlist()  POST /account/{id}/watchlist  (flag: false)
 *          removeFromFavourites() POST /account/{id}/favorite   (flag: false)
 *
 * ── Authentication ────────────────────────────────────────────────────────────
 * Read operations use the Bearer token only (VITE_TMDB_READ_TOKEN).
 * Write operations additionally require a session_id obtained via the TMDB
 * user authentication flow. Pass it as the `sessionId` parameter.
 *
 * ── Security ──────────────────────────────────────────────────────────────────
 * • All numeric IDs are validated as positive integers before use in URLs.
 * • All string inputs are sanitised (trimmed, length-capped, encoded).
 * • No user-supplied values are interpolated directly into URL strings.
 * • AbortSignal is threaded through every call for React Query cancellation.
 */

import {
  tmdbGet,
  tmdbPost,
  tmdbDelete,
  tmdbImageUrl,
  POSTER_SIZES,
  BACKDROP_SIZES,
  TmdbError,
} from './tmdbClient';

import type {
  TmdbMovieDetail,
  TmdbMovieListItem,
  TmdbVideosResponse,
  TmdbCreditsResponse,
  TmdbPaginatedResponse,
  TmdbAccountStates,
  TmdbStatusResponse,
  TmdbDiscoverParams,
  TmdbSortBy,
  TmdbGenre,
} from '../models/tmdb';

// Re-export error types so consumers don't need to import from tmdbClient
export { TmdbError, TmdbNotFoundError, TmdbRateLimitError, TmdbAuthError, TmdbConfigError } from './tmdbClient';
export { tmdbImageUrl, POSTER_SIZES, BACKDROP_SIZES } from './tmdbClient';

// ── Input validation helpers ──────────────────────────────────────────────────

/** Validate a TMDB movie/account ID — must be a positive integer */
function validateId(id: unknown, label = 'id'): number {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) {
    throw new TmdbError(`Invalid ${label}: must be a positive integer`);
  }
  return n;
}

/** Sanitise a free-text search query */
function sanitiseQuery(query: unknown): string {
  if (typeof query !== 'string') throw new TmdbError('Search query must be a string');
  const trimmed = query.trim().slice(0, 200);
  if (!trimmed) throw new TmdbError('Search query must not be empty');
  return trimmed;
}

/** Validate a page number */
function validatePage(page: unknown): number {
  const n = Number(page ?? 1);
  if (!Number.isInteger(n) || n < 1 || n > 500) {
    throw new TmdbError('Page must be an integer between 1 and 500');
  }
  return n;
}

/** Validate a rating value (0.5–10.0 in 0.5 steps per TMDB spec) */
function validateRating(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0.5 || n > 10 || (n * 2) % 1 !== 0) {
    throw new TmdbError('Rating must be between 0.5 and 10.0 in 0.5 increments');
  }
  return n;
}

/** Validate time window for trending endpoint */
function validateTimeWindow(window: unknown): 'day' | 'week' {
  if (window === 'day' || window === 'week') return window;
  throw new TmdbError("Time window must be 'day' or 'week'");
}

// ── READ operations ───────────────────────────────────────────────────────────

/**
 * GET /movie/{movie_id}
 * Full movie details including genres, runtime, production companies, etc.
 */
export async function getMovie(
  movieId: number,
  options?: { signal?: AbortSignal; appendToResponse?: string[] }
): Promise<TmdbMovieDetail> {
  const id = validateId(movieId, 'movieId');
  const params: Record<string, string> = {};

  if (options?.appendToResponse?.length) {
    // Whitelist allowed append_to_response values to prevent injection
    const allowed = new Set(['videos', 'credits', 'images', 'similar', 'recommendations', 'account_states']);
    const safe = options.appendToResponse
      .filter((v) => allowed.has(v))
      .join(',');
    if (safe) params['append_to_response'] = safe;
  }

  return tmdbGet<TmdbMovieDetail>(`/movie/${id}`, {
    params,
    signal: options?.signal,
  });
}

/**
 * GET /movie/{movie_id}/videos
 * Trailers, teasers, clips, featurettes for a movie.
 */
export async function getMovieVideos(
  movieId: number,
  options?: { signal?: AbortSignal }
): Promise<TmdbVideosResponse> {
  const id = validateId(movieId, 'movieId');
  return tmdbGet<TmdbVideosResponse>(`/movie/${id}/videos`, {
    signal: options?.signal,
  });
}

/**
 * GET /movie/{movie_id}/credits
 * Cast and crew for a movie.
 */
export async function getMovieCredits(
  movieId: number,
  options?: { signal?: AbortSignal }
): Promise<TmdbCreditsResponse> {
  const id = validateId(movieId, 'movieId');
  return tmdbGet<TmdbCreditsResponse>(`/movie/${id}/credits`, {
    signal: options?.signal,
  });
}

/**
 * GET /movie/{movie_id}/images
 * Posters and backdrops for a movie.
 */
export async function getMovieImages(
  movieId: number,
  options?: { signal?: AbortSignal }
): Promise<{ id: number; backdrops: Array<{ file_path: string; width: number; height: number }>; posters: Array<{ file_path: string; width: number; height: number }> }> {
  const id = validateId(movieId, 'movieId');
  return tmdbGet(`/movie/${id}/images`, {
    signal: options?.signal,
    // Don't filter by language for images — returns more results
    params: { include_image_language: 'en,null' },
  });
}

/**
 * GET /movie/{movie_id}/similar
 * Movies similar to the given movie.
 */
export async function getSimilarMovies(
  movieId: number,
  page = 1,
  options?: { signal?: AbortSignal }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const id = validateId(movieId, 'movieId');
  const p  = validatePage(page);
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>(`/movie/${id}/similar`, {
    params: { page: p },
    signal: options?.signal,
  });
}

/**
 * GET /movie/{movie_id}/recommendations
 * Personalised recommendations based on a movie.
 */
export async function getMovieRecommendations(
  movieId: number,
  page = 1,
  options?: { signal?: AbortSignal }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const id = validateId(movieId, 'movieId');
  const p  = validatePage(page);
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>(`/movie/${id}/recommendations`, {
    params: { page: p },
    signal: options?.signal,
  });
}

/**
 * GET /search/movie
 * Search for movies by title (original, translated, or alternative).
 */
export async function searchMovies(
  query: string,
  options?: {
    page?:                 number;
    includeAdult?:         boolean;
    primaryReleaseYear?:   number;
    signal?:               AbortSignal;
  }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const safeQuery = sanitiseQuery(query);
  const page      = validatePage(options?.page ?? 1);

  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>('/search/movie', {
    params: {
      query:                safeQuery,
      page,
      include_adult:        options?.includeAdult ?? false,
      primary_release_year: options?.primaryReleaseYear,
    },
    signal: options?.signal,
  });
}

/**
 * GET /discover/movie
 * Find movies using filters (genre, year, rating, sort, etc.)
 * Supports all 30+ TMDB discover parameters.
 */
export async function discoverMovies(
  params: TmdbDiscoverParams = {},
  options?: { signal?: AbortSignal }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const page = validatePage(params.page ?? 1);

  // Build a clean params object — only include defined values
  const queryParams: Record<string, string | number | boolean> = {
    page,
    include_adult: params.include_adult ?? false,
    include_video: params.include_video ?? false,
  };

  if (params.sort_by)                        queryParams['sort_by']                        = params.sort_by;
  if (params.with_genres)                    queryParams['with_genres']                    = params.with_genres;
  if (params.primary_release_year)           queryParams['primary_release_year']           = params.primary_release_year;
  if (params['primary_release_date.gte'])    queryParams['primary_release_date.gte']       = params['primary_release_date.gte'];
  if (params['primary_release_date.lte'])    queryParams['primary_release_date.lte']       = params['primary_release_date.lte'];
  if (params['vote_average.gte'] !== undefined) queryParams['vote_average.gte']            = params['vote_average.gte']!;
  if (params['vote_average.lte'] !== undefined) queryParams['vote_average.lte']            = params['vote_average.lte']!;
  if (params.language)                       queryParams['language']                       = params.language;
  if (params.with_original_language)         queryParams['with_original_language']         = params.with_original_language;

  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>('/discover/movie', {
    params: queryParams,
    signal: options?.signal,
  });
}

/**
 * GET /trending/movie/{time_window}
 * Trending movies for the day or week.
 */
export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'week',
  page = 1,
  options?: { signal?: AbortSignal }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const window = validateTimeWindow(timeWindow);
  const p      = validatePage(page);
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>(`/trending/movie/${window}`, {
    params: { page: p },
    signal: options?.signal,
  });
}

/**
 * GET /movie/popular
 * Currently popular movies.
 */
export async function getPopularMovies(
  page = 1,
  options?: { signal?: AbortSignal }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>('/movie/popular', {
    params: { page: validatePage(page) },
    signal: options?.signal,
  });
}

/**
 * GET /movie/top_rated
 * Top-rated movies on TMDB.
 */
export async function getTopRatedMovies(
  page = 1,
  options?: { signal?: AbortSignal }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>('/movie/top_rated', {
    params: { page: validatePage(page) },
    signal: options?.signal,
  });
}

/**
 * GET /movie/now_playing
 * Movies currently in theatres.
 */
export async function getNowPlayingMovies(
  page = 1,
  options?: { signal?: AbortSignal }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>('/movie/now_playing', {
    params: { page: validatePage(page) },
    signal: options?.signal,
  });
}

/**
 * GET /movie/upcoming
 * Movies releasing soon.
 */
export async function getUpcomingMovies(
  page = 1,
  options?: { signal?: AbortSignal }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>('/movie/upcoming', {
    params: { page: validatePage(page) },
    signal: options?.signal,
  });
}

/**
 * GET /genre/movie/list
 * Official TMDB genre list with IDs.
 */
export async function getMovieGenres(
  options?: { signal?: AbortSignal }
): Promise<{ genres: TmdbGenre[] }> {
  return tmdbGet<{ genres: TmdbGenre[] }>('/genre/movie/list', {
    signal: options?.signal,
  });
}

/**
 * GET /movie/{movie_id}/account_states
 * Whether the authenticated user has rated, watchlisted, or favourited a movie.
 * Requires a valid session_id.
 */
export async function getMovieAccountStates(
  movieId: number,
  sessionId: string,
  options?: { signal?: AbortSignal }
): Promise<TmdbAccountStates> {
  const id = validateId(movieId, 'movieId');
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required for account states');
  return tmdbGet<TmdbAccountStates>(`/movie/${id}/account_states`, {
    sessionId,
    signal: options?.signal,
  });
}

/**
 * GET /account/{account_id}/watchlist/movies
 * Movies on the authenticated user's watchlist.
 * Requires a valid session_id.
 */
export async function getWatchlistMovies(
  accountId: number,
  sessionId: string,
  options?: {
    page?:    number;
    sortBy?:  'created_at.asc' | 'created_at.desc';
    signal?:  AbortSignal;
  }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const id = validateId(accountId, 'accountId');
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required for watchlist');
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>(
    `/account/${id}/watchlist/movies`,
    {
      sessionId,
      params: {
        page:    validatePage(options?.page ?? 1),
        sort_by: options?.sortBy ?? 'created_at.desc',
      },
      signal: options?.signal,
    }
  );
}

/**
 * GET /account/{account_id}/favorite/movies
 * Movies the authenticated user has marked as favourite.
 * Requires a valid session_id.
 */
export async function getFavouriteMovies(
  accountId: number,
  sessionId: string,
  options?: {
    page?:   number;
    sortBy?: 'created_at.asc' | 'created_at.desc';
    signal?: AbortSignal;
  }
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const id = validateId(accountId, 'accountId');
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required for favourites');
  return tmdbGet<TmdbPaginatedResponse<TmdbMovieListItem>>(
    `/account/${id}/favorite/movies`,
    {
      sessionId,
      params: {
        page:    validatePage(options?.page ?? 1),
        sort_by: options?.sortBy ?? 'created_at.desc',
      },
      signal: options?.signal,
    }
  );
}

// ── CREATE / UPDATE operations ────────────────────────────────────────────────

/**
 * POST /movie/{movie_id}/rating
 * Add or update a rating for a movie (0.5–10.0 in 0.5 steps).
 * Requires a valid session_id.
 *
 * This is both CREATE and UPDATE — TMDB uses the same endpoint for both.
 */
export async function addRating(
  movieId: number,
  rating: number,
  sessionId: string,
  options?: { signal?: AbortSignal }
): Promise<TmdbStatusResponse> {
  const id    = validateId(movieId, 'movieId');
  const value = validateRating(rating);
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required to rate a movie');

  return tmdbPost<TmdbStatusResponse>(
    `/movie/${id}/rating`,
    { value },
    { sessionId, signal: options?.signal }
  );
}

/**
 * POST /account/{account_id}/watchlist
 * Add a movie to the authenticated user's watchlist.
 * Requires a valid session_id.
 */
export async function addToWatchlist(
  accountId: number,
  movieId: number,
  sessionId: string,
  options?: { signal?: AbortSignal }
): Promise<TmdbStatusResponse> {
  const accId   = validateId(accountId, 'accountId');
  const mediaId = validateId(movieId, 'movieId');
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required to modify watchlist');

  return tmdbPost<TmdbStatusResponse>(
    `/account/${accId}/watchlist`,
    { media_type: 'movie', media_id: mediaId, watchlist: true },
    { sessionId, signal: options?.signal }
  );
}

/**
 * POST /account/{account_id}/favorite
 * Add a movie to the authenticated user's favourites.
 * Requires a valid session_id.
 */
export async function addToFavourites(
  accountId: number,
  movieId: number,
  sessionId: string,
  options?: { signal?: AbortSignal }
): Promise<TmdbStatusResponse> {
  const accId   = validateId(accountId, 'accountId');
  const mediaId = validateId(movieId, 'movieId');
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required to modify favourites');

  return tmdbPost<TmdbStatusResponse>(
    `/account/${accId}/favorite`,
    { media_type: 'movie', media_id: mediaId, favorite: true },
    { sessionId, signal: options?.signal }
  );
}

// ── DELETE operations ─────────────────────────────────────────────────────────

/**
 * DELETE /movie/{movie_id}/rating
 * Remove the authenticated user's rating for a movie.
 * Requires a valid session_id.
 */
export async function deleteRating(
  movieId: number,
  sessionId: string,
  options?: { signal?: AbortSignal }
): Promise<TmdbStatusResponse> {
  const id = validateId(movieId, 'movieId');
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required to delete a rating');

  return tmdbDelete<TmdbStatusResponse>(
    `/movie/${id}/rating`,
    undefined,
    { sessionId, signal: options?.signal }
  );
}

/**
 * POST /account/{account_id}/watchlist  (watchlist: false)
 * Remove a movie from the authenticated user's watchlist.
 * TMDB uses the same POST endpoint with watchlist: false to remove.
 */
export async function removeFromWatchlist(
  accountId: number,
  movieId: number,
  sessionId: string,
  options?: { signal?: AbortSignal }
): Promise<TmdbStatusResponse> {
  const accId   = validateId(accountId, 'accountId');
  const mediaId = validateId(movieId, 'movieId');
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required to modify watchlist');

  return tmdbPost<TmdbStatusResponse>(
    `/account/${accId}/watchlist`,
    { media_type: 'movie', media_id: mediaId, watchlist: false },
    { sessionId, signal: options?.signal }
  );
}

/**
 * POST /account/{account_id}/favorite  (favorite: false)
 * Remove a movie from the authenticated user's favourites.
 */
export async function removeFromFavourites(
  accountId: number,
  movieId: number,
  sessionId: string,
  options?: { signal?: AbortSignal }
): Promise<TmdbStatusResponse> {
  const accId   = validateId(accountId, 'accountId');
  const mediaId = validateId(movieId, 'movieId');
  if (!sessionId?.trim()) throw new TmdbError('sessionId is required to modify favourites');

  return tmdbPost<TmdbStatusResponse>(
    `/account/${accId}/favorite`,
    { media_type: 'movie', media_id: mediaId, favorite: false },
    { sessionId, signal: options?.signal }
  );
}

// ── Utility: map TMDB response → app Movie model ──────────────────────────────

/**
 * Convert a TMDB movie detail response to the app's internal Movie model.
 * This is the adapter layer — keeps TMDB shapes out of the rest of the app.
 */
export function tmdbMovieToAppMovie(tmdb: TmdbMovieDetail) {
  const releaseYear = tmdb.release_date
    ? new Date(tmdb.release_date).getFullYear()
    : 0;

  const durationStr = tmdb.runtime
    ? `${Math.floor(tmdb.runtime / 60)}h ${tmdb.runtime % 60}m`
    : 'N/A';

  return {
    id:          tmdb.id,
    title:       tmdb.title,
    description: tmdb.overview,
    genre:       tmdb.genres.map((g) => g.name),
    rating:      Math.round(tmdb.vote_average * 10) / 10,
    year:        releaseYear,
    duration:    durationStr,
    thumbnail:   tmdbImageUrl(tmdb.poster_path,   POSTER_SIZES.medium),
    backdrop:    tmdbImageUrl(tmdb.backdrop_path, BACKDROP_SIZES.large),
  };
}

/**
 * Convert a TMDB list item (from search/discover/trending) to the app model.
 * Genre names are not available in list items — pass a genre map if needed.
 */
export function tmdbListItemToAppMovie(
  tmdb: TmdbMovieListItem,
  genreMap: Map<number, string> = new Map()
) {
  const releaseYear = tmdb.release_date
    ? new Date(tmdb.release_date).getFullYear()
    : 0;

  return {
    id:          tmdb.id,
    title:       tmdb.title,
    description: tmdb.overview,
    genre:       tmdb.genre_ids.map((id) => genreMap.get(id) ?? String(id)),
    rating:      Math.round(tmdb.vote_average * 10) / 10,
    year:        releaseYear,
    duration:    'N/A',   // not available in list items — fetch detail for runtime
    thumbnail:   tmdbImageUrl(tmdb.poster_path,   POSTER_SIZES.medium),
    backdrop:    tmdbImageUrl(tmdb.backdrop_path, BACKDROP_SIZES.large),
  };
}

// ── Convenience: sort options for UI dropdowns ────────────────────────────────

export const TMDB_SORT_OPTIONS: Array<{ label: string; value: TmdbSortBy }> = [
  { label: 'Popularity (High → Low)',  value: 'popularity.desc'         },
  { label: 'Popularity (Low → High)',  value: 'popularity.asc'          },
  { label: 'Rating (High → Low)',      value: 'vote_average.desc'       },
  { label: 'Rating (Low → High)',      value: 'vote_average.asc'        },
  { label: 'Release Date (Newest)',    value: 'primary_release_date.desc' },
  { label: 'Release Date (Oldest)',    value: 'primary_release_date.asc'  },
  { label: 'Revenue (High → Low)',     value: 'revenue.desc'            },
];
