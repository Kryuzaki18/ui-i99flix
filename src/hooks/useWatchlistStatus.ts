import type { Movie } from '../models/movieModel';
import {
  useWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from '../api/watchlist/useWatchlistQuery';

interface WatchlistStatus {
  inWatchlist: boolean;
  isPending:   boolean;
  toggle:      (e?: React.MouseEvent) => void;
}

export default function useWatchlistStatus(movie: Movie | null): WatchlistStatus {
  const { data: watchlistItems = [] } = useWatchlistQuery();
  const addMutation    = useAddToWatchlistMutation();
  const removeMutation = useRemoveFromWatchlistMutation();

  const movieId     = movie ? String(movie.id) : "";
  const inWatchlist = movie ? watchlistItems.some((w) => w.movieId === movieId) : false;
  const isPending   = addMutation.isPending || removeMutation.isPending;

  const toggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!movie) return;
    if (inWatchlist) removeMutation.mutate(movieId);
    else             addMutation.mutate(movie);
  };

  return { inWatchlist, isPending, toggle };
}
