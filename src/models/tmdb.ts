export type ISODate = string;
export type ImagePath = string | null;

export interface TmdbGenre {
  id:   number;
  name: string;
}

export interface TmdbProductionCompany {
  id:             number;
  name:           string;
  logo_path:      ImagePath;
  origin_country: string;
}

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

export interface TmdbMovieDetail extends Omit<TmdbMovieListItem, 'genre_ids'> {
  genres:               TmdbGenre[];
  runtime:              number | null;
  status:               string;
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

export type TmdbVideoType = 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | 'Behind the Scenes' | 'Bloopers';
export type TmdbVideoSite = 'YouTube' | 'Vimeo';

export interface TmdbVideo {
  id:           string;
  key:          string;
  name:         string;
  site:         TmdbVideoSite;
  type:         TmdbVideoType;
  official:     boolean;
  published_at: string;
  size:         number;
  iso_639_1:    string;
  iso_3166_1:   string;
}

export interface TmdbVideosResponse {
  id:      number;
  results: TmdbVideo[];
}

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

export interface TmdbPaginatedResponse<T> {
  page:          number;
  results:       T[];
  total_pages:   number;
  total_results: number;
}

export interface TmdbAccountStates {
  id:        number;
  favorite:  boolean;
  watchlist: boolean;
  rated:     { value: number } | false;
}

export interface TmdbStatusResponse {
  status_code:    number;
  status_message: string;
  success:        boolean;
}

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
  with_genres?:           string;
  primary_release_year?:  number;
  'primary_release_date.gte'?: ISODate;
  'primary_release_date.lte'?: ISODate;
  'vote_average.gte'?:    number;
  'vote_average.lte'?:    number;
  include_adult?:         boolean;
  include_video?:         boolean;
  with_original_language?: string;
}
