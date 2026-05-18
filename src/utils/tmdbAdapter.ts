/**
 * TMDB → App Movie adapter
 *
 * Converts TMDB API shapes into the app's internal Movie model so no
 * TMDB-specific types leak into pages or components.
 *
 * TMDB genre IDs are mapped to human-readable names via a genre map.
 * If the map is unavailable, the raw ID is used as a fallback.
 */

import type { Movie } from '../models/movie';
import type { TmdbMovieListItem, TmdbMovieDetail, TmdbGenre } from '../models/tmdb';
import type { TmdbTvListItem, TmdbTvDetail } from '../api/tmdbApi';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function tmdbPoster(path: string | null | undefined): string {
  if (!path || !/^\/[a-zA-Z0-9_.-]+$/.test(path)) return '';
  return `${TMDB_IMAGE_BASE}/w500${path}`;
}

export function tmdbBackdrop(path: string | null | undefined): string {
  if (!path || !/^\/[a-zA-Z0-9_.-]+$/.test(path)) return '';
  return `${TMDB_IMAGE_BASE}/w1280${path}`;
}

function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function releaseYear(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  const y = parseInt(dateStr.slice(0, 4), 10);
  return Number.isFinite(y) ? y : 0;
}

/** Build a genre-id → name lookup from a TMDB genres response */
export function buildGenreMap(genres: TmdbGenre[]): Map<number, string> {
  return new Map(genres.map((g) => [g.id, g.name]));
}

// ── Movie list item (search / discover / trending) ────────────────────────────

export function tmdbMovieListItemToMovie(
  item: TmdbMovieListItem,
  genreMap: Map<number, string> = new Map(),
): Movie {
  return {
    id:          item.id,
    title:       item.title,
    description: item.overview,
    genre:       item.genre_ids.map((id) => genreMap.get(id) ?? String(id)),
    rating:      Math.round(item.vote_average * 10) / 10,
    year:        releaseYear(item.release_date),
    duration:    'N/A',
    thumbnail:   tmdbPoster(item.poster_path),
    backdrop:    tmdbBackdrop(item.backdrop_path),
    mediaType:   'movie',
  };
}

// ── Movie detail ──────────────────────────────────────────────────────────────

export function tmdbMovieDetailToMovie(item: TmdbMovieDetail): Movie {
  return {
    id:          item.id,
    title:       item.title,
    description: item.overview,
    genre:       item.genres.map((g) => g.name),
    rating:      Math.round(item.vote_average * 10) / 10,
    year:        releaseYear(item.release_date),
    duration:    formatRuntime(item.runtime),
    thumbnail:   tmdbPoster(item.poster_path),
    backdrop:    tmdbBackdrop(item.backdrop_path),
    mediaType:   'movie',
  };
}

// ── TV list item ──────────────────────────────────────────────────────────────

export function tmdbTvListItemToMovie(
  item: TmdbTvListItem,
  genreMap: Map<number, string> = new Map(),
): Movie {
  return {
    id:          item.id,
    title:       item.name,
    description: item.overview,
    genre:       item.genre_ids.map((id) => genreMap.get(id) ?? String(id)),
    rating:      Math.round(item.vote_average * 10) / 10,
    year:        releaseYear(item.first_air_date),
    duration:    'N/A',
    thumbnail:   tmdbPoster(item.poster_path),
    backdrop:    tmdbBackdrop(item.backdrop_path),
    mediaType:   'tv',
  };
}

// ── TV detail ─────────────────────────────────────────────────────────────────

export function tmdbTvDetailToMovie(item: TmdbTvDetail): Movie {
  const avgRuntime = item.episode_run_time?.[0] ?? null;
  return {
    id:          item.id,
    title:       item.name,
    description: item.overview,
    genre:       item.genres.map((g) => g.name),
    rating:      Math.round(item.vote_average * 10) / 10,
    year:        releaseYear(item.first_air_date),
    duration:    formatRuntime(avgRuntime),
    thumbnail:   tmdbPoster(item.poster_path),
    backdrop:    tmdbBackdrop(item.backdrop_path),
    mediaType:   'tv',
  };
}
