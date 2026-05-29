import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TmdbGenre } from '../models/tmdbModel';

interface TmdbStoreState {
  movieGenres: TmdbGenre[];
  tvGenres:    TmdbGenre[];

  setMovieGenres: (genres: TmdbGenre[]) => void;
  setTvGenres:    (genres: TmdbGenre[]) => void;
}

export const useTmdbStore = create<TmdbStoreState>()(
  devtools((set) => ({
    movieGenres: [],
    tvGenres:    [],

    setMovieGenres: (genres) => set({ movieGenres: genres }, false, 'tmdb/setMovieGenres'),
    setTvGenres:    (genres) => set({ tvGenres: genres }, false, 'tmdb/setTvGenres'),
  }), { name: 'TmdbStore' })
);

export default useTmdbStore;
