import { apiGet } from '../../services/apiService';
import { API_ROUTES } from '../environments';
import { useTmdbStore } from '../../store/tmdbStore';
import type {
  TmdbPaginatedResponse,
  TmdbMovieListItem,
  TmdbMovieDetail,
  TmdbVideosResponse,
  TmdbCreditsResponse,
  TmdbGenre,
  TmdbProductionCompany,
  TmdbProductionCountry,
  TmdbSpokenLanguage,
} from '../../models/tmdbModel';

let movieGenresPromise: Promise<{ genres: TmdbGenre[] }> | null = null;
let tvGenresPromise: Promise<{ genres: TmdbGenre[] }> | null = null;

export interface TmdbTvListItem {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
}

export interface TmdbTvSeason {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface TmdbTvDetail extends Omit<TmdbTvListItem, 'genre_ids'> {
  genres:               TmdbGenre[];
  episode_run_time:     number[];
  number_of_seasons:    number;
  number_of_episodes:   number;
  seasons:              TmdbTvSeason[];
  status:               string;
  tagline:              string;
  homepage:             string;
  in_production:        boolean;
  origin_country:       string[];
  production_companies: TmdbProductionCompany[];
  production_countries: TmdbProductionCountry[];
  spoken_languages:     TmdbSpokenLanguage[];
}

export interface TmdbMultiResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

export interface PageParams {
  page?: number;
  language?: string;
}

export interface SearchParams extends PageParams {
  query: string;
}

export interface DiscoverMovieParams extends PageParams {
  sort_by?: string;
  with_genres?: string;
  primary_release_year?: number;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  include_adult?: boolean;
  with_original_language?: string;
}

export interface DiscoverTvParams extends PageParams {
  sort_by?: string;
  with_genres?: string;
  'first_air_date.gte'?: string;
  'first_air_date.lte'?: string;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  with_original_language?: string;
}

function validateId(id: unknown, label = 'id'): number {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Invalid ${label}: must be a positive integer`);
  }
  return n;
}

function sanitiseQuery(query: unknown): string {
  if (typeof query !== 'string') throw new Error('Search query must be a string');
  const trimmed = query.trim().slice(0, 200);
  if (!trimmed) throw new Error('Search query must not be empty');
  return trimmed;
}

function buildPageParams(params: PageParams): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (params.page !== undefined) out['page'] = params.page;
  if (params.language !== undefined) out['language'] = params.language;
  return out;
}

export async function fetchTmdbMoviesPopular(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet(API_ROUTES.TMDB.MOVIES.POPULAR, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesTopRated(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet(API_ROUTES.TMDB.MOVIES.TOP_RATED, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesNowPlaying(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet(API_ROUTES.TMDB.MOVIES.NOW_PLAYING, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesUpcoming(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet(API_ROUTES.TMDB.MOVIES.UPCOMING, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesTrending(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  return apiGet(API_ROUTES.TMDB.MOVIES.TRENDING, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMoviesDiscover(
  params: DiscoverMovieParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const p: Record<string, string | number | boolean> = { ...buildPageParams(params) };
  if (params.sort_by) p['sort_by'] = params.sort_by;
  if (params.with_genres) p['with_genres'] = params.with_genres;
  if (params.primary_release_year) p['primary_release_year'] = params.primary_release_year;
  if (params['primary_release_date.gte']) p['primary_release_date.gte'] = params['primary_release_date.gte'];
  if (params['primary_release_date.lte']) p['primary_release_date.lte'] = params['primary_release_date.lte'];
  if (params['vote_average.gte'] !== undefined) p['vote_average.gte'] = params['vote_average.gte']!;
  if (params['vote_average.lte'] !== undefined) p['vote_average.lte'] = params['vote_average.lte']!;
  if (params.include_adult !== undefined) p['include_adult'] = params.include_adult;
  if (params.with_original_language) p['with_original_language'] = params.with_original_language;
  return apiGet(API_ROUTES.TMDB.MOVIES.DISCOVER, { params: p, signal: options?.signal });
}

export async function fetchTmdbMoviesSearch(
  params: SearchParams,
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const query = sanitiseQuery(params.query);
  return apiGet(API_ROUTES.TMDB.MOVIES.SEARCH, {
    params: { query, ...buildPageParams(params) },
    signal: options?.signal,
  });
}

export async function fetchTmdbMovieDetail(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbMovieDetail> {
  const safeId = validateId(id, 'movieId');
  return apiGet(API_ROUTES.TMDB.MOVIES.BY_ID(safeId), { signal: options?.signal });
}

export async function fetchTmdbMovieVideos(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbVideosResponse> {
  const safeId = validateId(id, 'movieId');
  return apiGet(API_ROUTES.TMDB.MOVIES.VIDEOS(safeId), { signal: options?.signal });
}

export async function fetchTmdbMovieCredits(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbCreditsResponse> {
  const safeId = validateId(id, 'movieId');
  return apiGet(API_ROUTES.TMDB.MOVIES.CREDITS(safeId), { signal: options?.signal });
}

export async function fetchTmdbMovieSimilar(
  id: number,
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const safeId = validateId(id, 'movieId');
  return apiGet(API_ROUTES.TMDB.MOVIES.SIMILAR(safeId), { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbMovieRecommendations(
  id: number,
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> {
  const safeId = validateId(id, 'movieId');
  return apiGet(API_ROUTES.TMDB.MOVIES.RECOMMENDATIONS(safeId), { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvPopular(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet(API_ROUTES.TMDB.TV.POPULAR, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvTopRated(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet(API_ROUTES.TMDB.TV.TOP_RATED, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvOnTheAir(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet(API_ROUTES.TMDB.TV.ON_THE_AIR, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvAiringToday(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet(API_ROUTES.TMDB.TV.AIRING_TODAY, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvTrending(
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  return apiGet(API_ROUTES.TMDB.TV.TRENDING, { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvDiscover(
  params: DiscoverTvParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  const p: Record<string, string | number | boolean> = { ...buildPageParams(params) };
  if (params.sort_by) p['sort_by'] = params.sort_by;
  if (params.with_genres) p['with_genres'] = params.with_genres;
  if (params['first_air_date.gte']) p['first_air_date.gte'] = params['first_air_date.gte'];
  if (params['first_air_date.lte']) p['first_air_date.lte'] = params['first_air_date.lte'];
  if (params['vote_average.gte'] !== undefined) p['vote_average.gte'] = params['vote_average.gte']!;
  if (params['vote_average.lte'] !== undefined) p['vote_average.lte'] = params['vote_average.lte']!;
  if (params.with_original_language) p['with_original_language'] = params.with_original_language;
  return apiGet(API_ROUTES.TMDB.TV.DISCOVER, { params: p, signal: options?.signal });
}

export async function fetchTmdbTvSearch(
  params: SearchParams,
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  const query = sanitiseQuery(params.query);
  return apiGet(API_ROUTES.TMDB.TV.SEARCH, {
    params: { query, ...buildPageParams(params) },
    signal: options?.signal,
  });
}

export async function fetchTmdbTvDetail(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbTvDetail> {
  const safeId = validateId(id, 'tvId');
  return apiGet(API_ROUTES.TMDB.TV.BY_ID(safeId), { signal: options?.signal });
}

export async function fetchTmdbTvVideos(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbVideosResponse> {
  const safeId = validateId(id, 'tvId');
  return apiGet(API_ROUTES.TMDB.TV.VIDEOS(safeId), { signal: options?.signal });
}

export async function fetchTmdbTvCredits(
  id: number,
  options?: { signal?: AbortSignal },
): Promise<TmdbCreditsResponse> {
  const safeId = validateId(id, 'tvId');
  return apiGet(API_ROUTES.TMDB.TV.CREDITS(safeId), { signal: options?.signal });
}

export async function fetchTmdbTvSimilar(
  id: number,
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  const safeId = validateId(id, 'tvId');
  return apiGet(API_ROUTES.TMDB.TV.SIMILAR(safeId), { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbTvRecommendations(
  id: number,
  params: PageParams = {},
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> {
  const safeId = validateId(id, 'tvId');
  return apiGet(API_ROUTES.TMDB.TV.RECOMMENDATIONS(safeId), { params: buildPageParams(params), signal: options?.signal });
}

export async function fetchTmdbSearchMulti(
  params: SearchParams,
  options?: { signal?: AbortSignal },
): Promise<TmdbPaginatedResponse<TmdbMultiResult>> {
  const query = sanitiseQuery(params.query);
  return apiGet(API_ROUTES.TMDB.SEARCH_MULTI, {
    params: { query, ...buildPageParams(params) },
    signal: options?.signal,
  });
}

export async function fetchTmdbGenresMovie(
  options?: { signal?: AbortSignal },
): Promise<{ genres: TmdbGenre[] }> {
  const store = useTmdbStore.getState();
  if (store.movieGenres && store.movieGenres.length > 0) {
    return { genres: store.movieGenres };
  }

  if (movieGenresPromise) return movieGenresPromise;

  movieGenresPromise = apiGet<{ genres: TmdbGenre[] }>(API_ROUTES.TMDB.GENRES_MOVIE, { signal: options?.signal })
    .then((res) => {
      store.setMovieGenres(res.genres);
      movieGenresPromise = null;
      return res;
    })
    .catch((err) => {
      movieGenresPromise = null;
      throw err;
    });

  return movieGenresPromise;
}

export async function fetchTmdbGenresTv(
  options?: { signal?: AbortSignal },
): Promise<{ genres: TmdbGenre[] }> {
  const store = useTmdbStore.getState();
  if (store.tvGenres && store.tvGenres.length > 0) {
    return { genres: store.tvGenres };
  }

  if (tvGenresPromise) return tvGenresPromise;

  tvGenresPromise = apiGet<{ genres: TmdbGenre[] }>(API_ROUTES.TMDB.GENRES_TV, { signal: options?.signal })
    .then((res) => {
      store.setTvGenres(res.genres);
      tvGenresPromise = null;
      return res;
    })
    .catch((err) => {
      tvGenresPromise = null;
      throw err;
    });

  return tvGenresPromise;
}
