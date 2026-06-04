import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/watchlistService';
import { watchlistKeys } from './queryKeys';
import { useAuthStore } from '../store/authStore';
import messageService from '../services/messageService';
import type { Movie } from '../models/movieModel';

export function useWatchlistQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey:  watchlistKeys.list(),
    queryFn:   () => getWatchlist(),
    enabled:   !!isAuthenticated,
    staleTime: 5 * 60 * 1000,
    select:    (data) => data.watchlist,
  });
}

export function useAddToWatchlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movie: Movie) => addToWatchlist(movie),
    onSuccess: (data, movie) => {
      queryClient.setQueryData(watchlistKeys.list(), data);
      messageService.success(`"${movie.title}" added to your watchlist`);
    },
    onError: () => {
      messageService.error('Failed to add to watchlist. Please try again.');
    },
  });
}

export function useRemoveFromWatchlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string | number) => removeFromWatchlist(movieId),
    onSuccess: (data) => {
      queryClient.setQueryData(watchlistKeys.list(), data);
      messageService.success('Removed from your watchlist');
    },
    onError: () => {
      messageService.error('Failed to remove from watchlist. Please try again.');
    },
  });
}
