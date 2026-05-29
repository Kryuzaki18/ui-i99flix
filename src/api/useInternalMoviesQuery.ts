import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchApiMovies,
  fetchApiMovieById,
  createApiMovie,
  updateApiMovie,
  deleteApiMovie,
  type MovieFiltersApi,
  type MoviePayload,
} from '../services/movieService';

export const internalMovieKeys = {
  all:     ['internal-movies'] as const,
  lists:   () => [...internalMovieKeys.all, 'list'] as const,
  list:    (filters: MovieFiltersApi) => [...internalMovieKeys.lists(), filters] as const,
  details: () => [...internalMovieKeys.all, 'detail'] as const,
  detail:  (id: string) => [...internalMovieKeys.details(), id] as const,
};

export function useApiMoviesQuery(filters: MovieFiltersApi = {}) {
  return useQuery({
    queryKey: internalMovieKeys.list(filters),
    queryFn:  () => fetchApiMovies(filters),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useApiMovieQuery(id: string | null) {
  return useQuery({
    queryKey: internalMovieKeys.detail(id ?? ''),
    queryFn:  () => fetchApiMovieById(id!),
    enabled:  !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MoviePayload) => createApiMovie(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: internalMovieKeys.lists() });
    },
  });
}

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

export function useDeleteMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApiMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: internalMovieKeys.lists() });
    },
  });
}
