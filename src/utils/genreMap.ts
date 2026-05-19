import { fetchTmdbGenresMovie, fetchTmdbGenresTv } from '../api/tmdbApi';
import { buildGenreMap } from './tmdbAdapter';

export async function getGenreMap(): Promise<Map<number, string>> {
  try {
    const [movieRes, tvRes] = await Promise.all([
      fetchTmdbGenresMovie(),
      fetchTmdbGenresTv(),
    ]);
    const mergedGenres = [...movieRes.genres, ...tvRes.genres];
    return buildGenreMap(mergedGenres);
  } catch {
    return new Map();
  }
}
