/**
 * useTrailerKey
 *
 * Fetches the YouTube trailer key for a TMDB movie ID via the backend proxy.
 * Picks the best available video in priority order:
 *   1. Official Trailer on YouTube
 *   2. Any Trailer on YouTube
 *   3. Teaser on YouTube
 *   4. First YouTube result
 *
 * Returns null while loading or when no YouTube video is available.
 */

import { useTmdbMovieVideosQuery } from '../api/useTmdbQuery';

export function useTrailerKey(movieId: number | null): {
  trailerKey: string | null;
  isLoading:  boolean;
} {
  const { data, isLoading } = useTmdbMovieVideosQuery(movieId);

  if (!data?.results?.length) {
    return { trailerKey: null, isLoading };
  }

  const youtubeVideos = data.results.filter((v) => v.site === 'YouTube');

  const pick =
    youtubeVideos.find((v) => v.type === 'Trailer' && v.official) ??
    youtubeVideos.find((v) => v.type === 'Trailer') ??
    youtubeVideos.find((v) => v.type === 'Teaser') ??
    youtubeVideos[0] ??
    null;

  return { trailerKey: pick?.key ?? null, isLoading };
}
