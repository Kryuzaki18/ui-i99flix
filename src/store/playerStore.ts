import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Movie } from '../models/movie';

interface PlayerState {
  playingMovie: Movie | null;
  detailMovie:  Movie | null;

  playMovie:   (movie: Movie) => void;
  closePlayer: () => void;
  openDetail:  (movie: Movie) => void;
  closeDetail: () => void;
  playFromDetail: (movie: Movie) => void;
}

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set) => ({
      playingMovie: null,
      detailMovie:  null,

      playMovie:   (movie) => set({ playingMovie: movie }, false, 'player/play'),
      closePlayer: ()      => set({ playingMovie: null  }, false, 'player/close'),
      openDetail:  (movie) => set({ detailMovie: movie  }, false, 'player/openDetail'),
      closeDetail: ()      => set({ detailMovie: null   }, false, 'player/closeDetail'),

      playFromDetail: (movie) =>
        set({ detailMovie: null, playingMovie: movie }, false, 'player/playFromDetail'),
    }),
    { name: 'PlayerStore' }
  )
);
