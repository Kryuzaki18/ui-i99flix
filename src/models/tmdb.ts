/**
 * TMDB API v3 — TypeScript type definitions
 *
 * Shapes are derived from the official TMDB API documentation:
 * https://developer.themoviedb.org/reference/movie-details
 *
 * Only fields actually used by this application are typed; unknown fields
 * from the API response are ignored (not stored, not forwarded).
 */

// ── Shared primitives ─────────────────────────────────────────────────────────

/** ISO 8601 date string e.g. "2024-05-01" */
export type ISODate = string;

/** TMDB image path e.g. "/abc123.jpg" — prepend TMDB_IMAGE_BASE_URL */
export type ImagePath = string | null;

// ── Genre ─────────────────────────────────────────────────────────────────────

export interface TmdbGenre {
  id:   number;
  name: string;
}

// ── Production company ────────────────────────────────────────────────────────

export interface TmdbProductionCompany {
  id:             number;
  name:           string;
  logo_path:      ImagePath;
  origin_country: string;
}

// ── Movie list item (returned by search, discover, trending, etc.) ────────────

export interface TmdbMovieListItem {
  id:                number;
  title:             string;
  original_title:    string;
  overview:          string;
  release_date:      ISODate;
  poster_path:       ImagePath;
  backdrop_path:     ImagePath;
  genre_ids:         number[];
  vote_average:      number;
  vote_count:        number;
  popularity:        number;
  adult:             boolean;
  original_language: string;
  video:             boolean;
}

// ── Movie detail (returned by GET /movie/{id}) ────────────────────────────────

export interface TmdbMovieDetail extends Omit<TmdbMovieListItem, 'genre_ids'> {
  genres:               TmdbGenre[];
  runtime:              number | null;   // minutes
  status:               string;          // "Released" | "Post Production" | …
  tagline:              string;
  budget:               number;
  revenue:              number;
  homepage:             string;
  imdb_id:              string | null;
  production_companies: TmdbProductionCompany[];
  spoken_languages:     Array<{ iso_639_1: string; name: string }>;
  belongs_to_collection: {
    id:            number;
    name:          string;
    poster_path:   ImagePath;
    backdrop_path: ImagePath;
  } | null;
}

// ── Video (trailer, teaser, clip, etc.) ──────────────────────────────────────

export type TmdbVideoType = 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
export type TmdbVideoSite = 'YouTube' | 'Vimeo';

export interface TmdbVideo {
  id:           string;
  key:          string;          // YouTube/Vimeo video ID
  name:         string;
  site:         TmdbVideoSite;
  type:         TmdbVideoType;
  official:     boolean;
  published_at: string;
  size:         number;          // 360 | 480 | 720 | 1080
  iso_639_1:    string;
  iso_3166_1:   string;
}

export interface TmdbVideosResponse {
  id:      number;
  results: TmdbVideo[];
}

// ── Credits ───────────────────────────────────────────────────────────────────

export interface TmdbCastMember {
  id:           number;
  name:         string;
  character:    string;
  profile_path: ImagePath;
  order:        number;
  known_for_department: string;
}

export interface TmdbCrewMember {
  id:           number;
  name:         string;
  job:          string;
  department:   string;
  profile_path: ImagePath;
}

export interface TmdbCreditsResponse {
  id:   number;
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

// ── Paginated list response ───────────────────────────────────────────────────

export interface TmdbPaginatedResponse<T> {
  page:          number;
  results:       T[];
  total_pages:   number;
  total_results: number;
}

// ── Account states (requires user session) ────────────────────────────────────

export interface TmdbAccountStates {
  id:        number;
  favorite:  boolean;
  watchlist: boolean;
  rated:     { value: number } | false;
}

// ── Write operation responses ─────────────────────────────────────────────────

export interface TmdbStatusResponse {
  status_code:    number;
  status_message: string;
  success:        boolean;
}

// ── Discover params ───────────────────────────────────────────────────────────

export type TmdbSortBy =
  | 'popularity.asc'  | 'popularity.desc'
  | 'release_date.asc' | 'release_date.desc'
  | 'revenue.asc'     | 'revenue.desc'
  | 'primary_release_date.asc' | 'primary_release_date.desc'
  | 'vote_average.asc' | 'vote_average.desc'
  | 'vote_count.asc'  | 'vote_count.desc';

export interface TmdbDiscoverParams {
  page?:                  number;
  language?:              string;
  sort_by?:               TmdbSortBy;
  with_genres?:           string;   // comma-separated genre IDs
  primary_release_year?:  number;
  'primary_release_date.gte'?: ISODate;
  'primary_release_date.lte'?: ISODate;
  'vote_average.gte'?:    number;
  'vote_average.lte'?:    number;
  include_adult?:         boolean;
  include_video?:         boolean;
  with_original_language?: string;
}
