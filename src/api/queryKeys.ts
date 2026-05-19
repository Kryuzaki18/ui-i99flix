export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters: { genre?: string; year?: string; search?: string }) =>
    [...movieKeys.lists(), filters] as const,
  featured:    () => [...movieKeys.all, 'featured']    as const,
  trending:    () => [...movieKeys.all, 'trending']    as const,
  newReleases: () => [...movieKeys.all, 'newReleases'] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail:  (id: number) => [...movieKeys.details(), id] as const,
} as const;

export const tmdbKeys = {
  all: ['tmdb'] as const,

  movies: {
    all:      () => [...tmdbKeys.all, 'movies']                          as const,
    popular:  (params: object) => [...tmdbKeys.movies.all(), 'popular',  params] as const,
    topRated: (params: object) => [...tmdbKeys.movies.all(), 'topRated', params] as const,
    nowPlaying:(params: object)=> [...tmdbKeys.movies.all(), 'nowPlaying',params] as const,
    upcoming: (params: object) => [...tmdbKeys.movies.all(), 'upcoming', params] as const,
    trending: (params: object) => [...tmdbKeys.movies.all(), 'trending', params] as const,
    discover: (params: object) => [...tmdbKeys.movies.all(), 'discover', params] as const,
    search:   (params: object) => [...tmdbKeys.movies.all(), 'search',   params] as const,
    detail:   (id: number)     => [...tmdbKeys.movies.all(), 'detail',   id]     as const,
    videos:   (id: number)     => [...tmdbKeys.movies.all(), 'videos',   id]     as const,
    credits:  (id: number)     => [...tmdbKeys.movies.all(), 'credits',  id]     as const,
    similar:  (id: number, params: object) => [...tmdbKeys.movies.all(), 'similar',         id, params] as const,
    recommendations: (id: number, params: object) => [...tmdbKeys.movies.all(), 'recommendations', id, params] as const,
  },

  tv: {
    all:          () => [...tmdbKeys.all, 'tv']                              as const,
    popular:      (params: object) => [...tmdbKeys.tv.all(), 'popular',      params] as const,
    topRated:     (params: object) => [...tmdbKeys.tv.all(), 'topRated',     params] as const,
    onTheAir:     (params: object) => [...tmdbKeys.tv.all(), 'onTheAir',     params] as const,
    airingToday:  (params: object) => [...tmdbKeys.tv.all(), 'airingToday',  params] as const,
    trending:     (params: object) => [...tmdbKeys.tv.all(), 'trending',     params] as const,
    discover:     (params: object) => [...tmdbKeys.tv.all(), 'discover',     params] as const,
    search:       (params: object) => [...tmdbKeys.tv.all(), 'search',       params] as const,
    detail:       (id: number)     => [...tmdbKeys.tv.all(), 'detail',       id]     as const,
    videos:       (id: number)     => [...tmdbKeys.tv.all(), 'videos',       id]     as const,
    credits:      (id: number)     => [...tmdbKeys.tv.all(), 'credits',      id]     as const,
    similar:      (id: number, params: object) => [...tmdbKeys.tv.all(), 'similar',         id, params] as const,
    recommendations: (id: number, params: object) => [...tmdbKeys.tv.all(), 'recommendations', id, params] as const,
  },

  searchMulti: (params: object) => [...tmdbKeys.all, 'search', params] as const,
  genresMovie: ()               => [...tmdbKeys.all, 'genres', 'movie'] as const,
  genresTv:    ()               => [...tmdbKeys.all, 'genres', 'tv']    as const,
} as const;
