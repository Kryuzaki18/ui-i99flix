import { useMemo } from 'react';
import { useTmdbStore } from '../store/tmdbStore';

export function useMovieGenreMap(): Map<number, string> {
  const movieGenres = useTmdbStore((s) => s.movieGenres);
  return useMemo(() => new Map(movieGenres.map((g) => [g.id, g.name])), [movieGenres]);
}

export function useTvGenreMap(): Map<number, string> {
  const tvGenres = useTmdbStore((s) => s.tvGenres);
  return useMemo(() => new Map(tvGenres.map((g) => [g.id, g.name])), [tvGenres]);
}

export function useCombinedGenreMap(): Map<number, string> {
  const movieGenres = useTmdbStore((s) => s.movieGenres);
  const tvGenres = useTmdbStore((s) => s.tvGenres);
  return useMemo(
    () => new Map([...movieGenres, ...tvGenres].map((g) => [g.id, g.name])),
    [movieGenres, tvGenres],
  );
}
