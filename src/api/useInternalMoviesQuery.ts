/**
 * React Query hooks for the internal 99Flix movie API.
 *
 * These hooks call our own Fastify backend (api-movie), not TMDB.
 * They follow the same patterns as useMoviesQuery.ts for consistency.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchApiMovies,
  fetchApiMovieById,
  createApiMovie,
  updateApiMovie,
  deleteApiMovie,
  type MovieFiltersApi,
  type MoviePayload,
} from './internalMovieApi';

// ── Query key factory ─────────────────────────────────────────────────────────

export const internalMovieKeys = {
  all:     ['internal-movies'] as const,
  lists:   () => [...internalMovieKeys.all, 'list'] as const,
  list:    (filters: MovieFiltersApi) => [...internalMovieKeys.lists(), filters] as const,
  details: () => [...internalMovieKeys.all, 'detail'] as const,
  detail:  (id: string) => [...internalMovieKeys.details(), id] as const,
};

// ── Read hooks ────────────────────────────────────────────────────────────────

/** Paginated movie list with optional filters */
export function useApiMoviesQuery(filters: MovieFiltersApi = {}) {
  return useQuery({
    queryKey: internalMovieKeys.list(filters),
    queryFn:  ({ signal }) => fetchApiMovies(filters, { signal }),
    staleTime: 60 * 1000, // 1 min — real API data can change
    placeholderData: (prev) => prev,
  });
}

/** Single movie by MongoDB _id */
export function useApiMovieQuery(id: string | null) {
  return useQuery({
    queryKey: internalMovieKeys.detail(id ?? ''),
    queryFn:  ({ signal }) => fetchApiMovieById(id!, { signal }),
    enabled:  !!id,
    staleTime: 60 * 1000,
  });
}

// ── Mutation hooks ────────────────────────────────────────────────────────────

/** Create a new movie */
export function useCreateMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MoviePayload) => createApiMovie(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: internalMovieKeys.lists() });
    },
  });
}

/** Update an existing movie */
export function useUpdateMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MoviePayload }) =>
      updateApiMovie(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: internalMovieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: internalMovieKeys.detail(id) });
    },
  });
}

/** Delete a movie */
export function useDeleteMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApiMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: internalMovieKeys.lists() });
    },
  });
}
