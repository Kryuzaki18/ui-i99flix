import { useQuery } from '@tanstack/react-query';
import { tmdbKeys } from './queryKeys';
import {
  fetchTmdbMoviesTrending,
  fetchTmdbMoviesPopular,
  fetchTmdbMoviesNowPlaying,
  fetchTmdbMoviesTopRated,
  fetchTmdbMovieDetail,
} from './tmdbApi';
import {
  tmdbMovieListItemToMovie,
  tmdbMovieDetailToMovie,
} from '../utils/tmdbAdapter';
import { getGenreMap } from '../utils/genreMap';
import type { Movie } from '../models/movie';

const STALE_TIME = 5 * 60 * 1000;

export function useFeaturedMoviesQuery() {
  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.popular({}),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesPopular({ page: 1 }, { signal }),
        getGenreMap(),
      ]);
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useTrendingMoviesQuery() {
  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.trending({}),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesTrending({ page: 1 }, { signal }),
        getGenreMap(),
      ]);
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useNewReleasesQuery() {
  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.nowPlaying({}),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesNowPlaying({ page: 1 }, { signal }),
        getGenreMap(),
      ]);
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useTopRatedMoviesQuery() {
  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.topRated({}),
    queryFn:  async ({ signal }) => {
      const [res, genreMap] = await Promise.all([
        fetchTmdbMoviesTopRated({ page: 1 }, { signal }),
        getGenreMap(),
      ]);
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useMovieDetailQuery(id: number | null) {
  return useQuery<Movie>({
    queryKey: tmdbKeys.movies.detail(id ?? 0),
    queryFn:  async ({ signal }) => {
      const detail = await fetchTmdbMovieDetail(id!, { signal });
      return tmdbMovieDetailToMovie(detail);
    },
    enabled:   id !== null && id > 0,
    staleTime: 10 * 60 * 1000,
  });
}
