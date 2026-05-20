const API_BASE = '/api';

export const API_ROUTES = {
  BASE: API_BASE,

  AUTH: {
    SIGNIN: `${API_BASE}/signin`,
    SIGNUP: `${API_BASE}/signup`,
    SIGNOUT: `${API_BASE}/signout`,
    ME: `${API_BASE}/me`,
    FORGOT_PASSWORD: `${API_BASE}/forgot-password`,
    RESET_PASSWORD: `${API_BASE}/reset-password`,
    VERIFY_EMAIL: `${API_BASE}/verify-email`,
  },

  MOVIES: {
    BASE: `${API_BASE}/movies`,
    BY_ID: (id: string) => `${API_BASE}/movies/${encodeURIComponent(id)}`,
  },

  TMDB: {
    SHOWCASE: `${API_BASE}/tmdb/showcase`,
    MOVIES: {
      POPULAR: `${API_BASE}/tmdb/movies/popular`,
      TOP_RATED: `${API_BASE}/tmdb/movies/top-rated`,
      NOW_PLAYING: `${API_BASE}/tmdb/movies/now-playing`,
      UPCOMING: `${API_BASE}/tmdb/movies/upcoming`,
      TRENDING: `${API_BASE}/tmdb/movies/trending`,
      DISCOVER: `${API_BASE}/tmdb/movies/discover`,
      SEARCH: `${API_BASE}/tmdb/movies/search`,
      BY_ID: (id: number) => `${API_BASE}/tmdb/movies/${id}`,
      VIDEOS: (id: number) => `${API_BASE}/tmdb/movies/${id}/videos`,
      CREDITS: (id: number) => `${API_BASE}/tmdb/movies/${id}/credits`,
      SIMILAR: (id: number) => `${API_BASE}/tmdb/movies/${id}/similar`,
      RECOMMENDATIONS: (id: number) => `${API_BASE}/tmdb/movies/${id}/recommendations`,
    },

    TV: {
      POPULAR: `${API_BASE}/tmdb/tv/popular`,
      TOP_RATED: `${API_BASE}/tmdb/tv/top-rated`,
      ON_THE_AIR: `${API_BASE}/tmdb/tv/on-the-air`,
      AIRING_TODAY: `${API_BASE}/tmdb/tv/airing-today`,
      TRENDING: `${API_BASE}/tmdb/tv/trending`,
      DISCOVER: `${API_BASE}/tmdb/tv/discover`,
      SEARCH: `${API_BASE}/tmdb/tv/search`,
      BY_ID: (id: number) => `${API_BASE}/tmdb/tv/${id}`,
      VIDEOS: (id: number) => `${API_BASE}/tmdb/tv/${id}/videos`,
      CREDITS: (id: number) => `${API_BASE}/tmdb/tv/${id}/credits`,
      SIMILAR: (id: number) => `${API_BASE}/tmdb/tv/${id}/similar`,
      RECOMMENDATIONS: (id: number) => `${API_BASE}/tmdb/tv/${id}/recommendations`,
    },

    SEARCH_MULTI: `${API_BASE}/tmdb/search`,
    GENRES_MOVIE: `${API_BASE}/tmdb/genres/movie`,
    GENRES_TV: `${API_BASE}/tmdb/genres/tv`,
  },
} as const;

export interface EmbedServer {
  id: number;
  label: string;
  movie: (id: number | string) => string;
  tv: (id: number | string, season: number, episode: number) => string;
}

export const EMBED_SERVERS: EmbedServer[] = [
  {
    id: 1,
    label: "ezvidapi",
    movie: (id) => `https://ezvidapi.com/embed/movie/${id}?provider=vidsrc`,
    tv: (id, s, e) => `https://ezvidapi.com/embed/tv/${id}/${s}/${e}?provider=vidsrc`,
  },
  {
    id: 2,
    label: 'VidSrc.to',
    movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 3,
    label: 'VidSrc.me',
    movie: (id) => `https://vidsrc.me/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.me/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 4,
    label: 'VidSrc.mov',
    movie: (id) => `https://vidsrc.mov/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.mov/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 5,
    label: 'VidSrc.fyi',
    movie: (id) => `https://vidsrc.fyi/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.fyi/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 6,
    label: 'VidSrc.pm',
    movie: (id) => `https://vidsrc.pm/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 7,
    label: 'VidSrc.io',
    movie: (id) => `https://vidsrc.io/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.io/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: 8,
    label: 'VidSrc.cc',
    movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
  },
];
