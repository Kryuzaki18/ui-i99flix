import { useMemo } from 'react';
import {
  MOVIES,
  getFeaturedMovies,
  getTrendingMovies,
  getNewReleases,
} from '../core/services/movieService';

export const useMovies = () => {
  const featured = useMemo(() => getFeaturedMovies(), []);
  const trending = useMemo(() => getTrendingMovies(), []);
  const newReleases = useMemo(() => getNewReleases(), []);
  const all = useMemo(() => MOVIES, []);

  return { featured, trending, newReleases, all };
};