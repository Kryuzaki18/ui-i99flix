const API_BASE = "/api";

export const API_ROUTES = {
  BASE: API_BASE,

  AUTH: {
    SIGNIN: `${API_BASE}/signin`,
    SIGNUP: `${API_BASE}/signup`,
    SOCIAL_SIGNIN: `${API_BASE}/social-signin`,
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

  WATCHLIST: {
    BASE: `${API_BASE}/watchlist`,
    ITEM: (movieId: string | number) =>
      `${API_BASE}/watchlist/${encodeURIComponent(String(movieId))}`,
  },

  WATCH: {
    BASE: `${API_BASE}/watch`,
  },

  USER: {
    CHANGE_PASSWORD: `${API_BASE}/change-password`,
    DELETE_ACCOUNT: `${API_BASE}/account`,
  },

  TMDB: {
    SHOWCASE: `${API_BASE}/tmdb/showcase`,
    SHOWCASE_TRAILER: (id: number) => `${API_BASE}/tmdb/showcase/trailer/${id}`,
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
      RECOMMENDATIONS: (id: number) =>
        `${API_BASE}/tmdb/movies/${id}/recommendations`,
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
      RECOMMENDATIONS: (id: number) =>
        `${API_BASE}/tmdb/tv/${id}/recommendations`,
    },

    SEARCH_MULTI: `${API_BASE}/tmdb/search`,
    GENRES_MOVIE: `${API_BASE}/tmdb/genres/movie`,
    GENRES_TV: `${API_BASE}/tmdb/genres/tv`,
  },
} as const;

export interface EmbedServer {
  label: string;
  movie: (id: number | string) => string;
  tv: (id: number | string, season: number, episode: number) => string;
}

export const EMBED_SERVERS: EmbedServer[] = [
  {
    label: "vidsrc.pm",
    movie: (id) => `https://vidsrc.pm/embed/movie/${id}?autoplay=1`,
    tv: (id, s, e) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}?autoplay=1`,
  },
  {
    label: "vaplayer.ru", //https://vidapi.ru/api
    movie: (id) => `https://vaplayer.ru/embed/movie/${id}?autoplay=1`,
    tv: (id, s, e) => `https://vaplayer.ru/embed/tv/${id}/${s}/${e}?autoplay=1`,
  },
  {
    label: "vidking.net",
    movie: (id) => `https://www.vidking.net/embed/movie/${id}`,
    tv: (id, s, e) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}`,
  },
  {
    label: "player.videasy", //https://www.videasy.net/docs
    movie: (id) => `https://player.videasy.net/movie/${id}?autoplay=1`,
    tv: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}?autoplay=1`,
  }
];
