/**
 * Internal Movie API — CRUD operations against the i99flix backend.
 *
 * These functions call our own Fastify API (api-movie), not TMDB.
 * The shape returned by the API matches the app's Movie model closely,
 * with `_id` (MongoDB ObjectId string) instead of numeric `id`.
 */

import { apiGet, apiPost, apiPut, apiDelete } from '../services/internalApiClient';
import type { Movie } from '../models/movie';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape returned by the API (MongoDB uses _id) */
export interface ApiMovie {
  _id:         string;
  title:       string;
  description: string;
  genre:       string[];
  rating:      number;
  year:        number;
  duration:    string;
  thumbnail:   string;
  backdrop:    string;
  featured:    boolean;
  trending:    boolean;
  newRelease:  boolean;
  createdAt:   string;
  updatedAt:   string;
}

export interface PaginatedMovies {
  data:       ApiMovie[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface MovieFiltersApi {
  page?:       number;
  limit?:      number;
  genre?:      string;
  year?:       number;
  search?:     string;
  featured?:   boolean;
  trending?:   boolean;
  newRelease?: boolean;
  sortBy?:     string;
  order?:      'asc' | 'desc';
}

export type MoviePayload = Omit<ApiMovie, '_id' | 'createdAt' | 'updatedAt'>;

// ── Adapter ───────────────────────────────────────────────────────────────────

/** Map an ApiMovie (MongoDB shape) to the app's Movie model */
export function apiMovieToMovie(m: ApiMovie): Movie {
  return {
    id:          m._id,   // kept as string — Movie.id is now number | string
    title:       m.title,
    description: m.description,
    genre:       m.genre,
    rating:      m.rating,
    year:        m.year,
    duration:    m.duration,
    thumbnail:   m.thumbnail,
    backdrop:    m.backdrop,
    featured:    m.featured,
    trending:    m.trending,
    newRelease:  m.newRelease,
  };
}

// ── CRUD functions ────────────────────────────────────────────────────────────

/** GET /api/v1/movies — list with filters + pagination */
export async function fetchApiMovies(
  filters: MovieFiltersApi = {},
  options?: { signal?: AbortSignal },
): Promise<PaginatedMovies> {
  const params: Record<string, string | number | boolean | undefined> = {};

  if (filters.page       !== undefined) params['page']       = filters.page;
  if (filters.limit      !== undefined) params['limit']      = filters.limit;
  if (filters.genre      && filters.genre !== 'all') params['genre'] = filters.genre;
  if (filters.year       !== undefined) params['year']       = filters.year;
  if (filters.search     && filters.search.trim()) params['search'] = filters.search.trim();
  if (filters.featured   !== undefined) params['featured']   = filters.featured;
  if (filters.trending   !== undefined) params['trending']   = filters.trending;
  if (filters.newRelease !== undefined) params['newRelease'] = filters.newRelease;
  if (filters.sortBy)    params['sortBy'] = filters.sortBy;
  if (filters.order)     params['order']  = filters.order;

  return apiGet<PaginatedMovies>('/movies', { params, signal: options?.signal });
}

/** GET /api/v1/movies/:id — single movie */
export async function fetchApiMovieById(
  id: string,
  options?: { signal?: AbortSignal },
): Promise<ApiMovie> {
  if (!id?.trim()) throw new Error('Movie id is required');
  return apiGet<ApiMovie>(`/movies/${encodeURIComponent(id)}`, { signal: options?.signal });
}

/** POST /api/v1/movies — create (auth required) */
export async function createApiMovie(
  payload: MoviePayload,
  options?: { signal?: AbortSignal },
): Promise<ApiMovie> {
  return apiPost<ApiMovie>('/movies', payload, { signal: options?.signal });
}

/** PUT /api/v1/movies/:id — update (auth required) */
export async function updateApiMovie(
  id:      string,
  payload: MoviePayload,
  options?: { signal?: AbortSignal },
): Promise<ApiMovie> {
  if (!id?.trim()) throw new Error('Movie id is required');
  return apiPut<ApiMovie>(`/movies/${encodeURIComponent(id)}`, payload, { signal: options?.signal });
}

/** DELETE /api/v1/movies/:id — delete (auth required) */
export async function deleteApiMovie(
  id: string,
  options?: { signal?: AbortSignal },
): Promise<{ message: string }> {
  if (!id?.trim()) throw new Error('Movie id is required');
  return apiDelete<{ message: string }>(`/movies/${encodeURIComponent(id)}`, { signal: options?.signal });
}
