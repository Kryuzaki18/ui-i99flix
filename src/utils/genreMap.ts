/**
 * Shared genre map utility.
 * Fetches the TMDB genre list once and returns a Map<id, name>.
 * Used by both useBrowseQuery and useMoviesQuery to avoid duplication.
 */

import { fetchTmdbGenresMovie } from '../api/tmdbApi';
import { buildGenreMap } from './tmdbAdapter';

export async function getGenreMap(): Promise<Map<number, string>> {
  try {
    const res = await fetchTmdbGenresMovie();
    return buildGenreMap(res.genres);
  } catch {
    return new Map();
  }
}
