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
import { useTmdbStore } from '../store/tmdbStore';
import type { Movie } from '../models/movieModel';

const STALE_TIME = 5 * 60 * 1000;

export function useFeaturedMoviesQuery() {
  const movieGenres = useTmdbStore((s) => s.movieGenres);
  const genreMap = new Map((movieGenres ?? []).map((g) => [g.id, g.name]));

  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.popular({}),
    queryFn:  async () => {
      const res = await fetchTmdbMoviesPopular({ page: 1 });
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useTrendingMoviesQuery() {
  const movieGenres = useTmdbStore((s) => s.movieGenres);
  const genreMap = new Map((movieGenres ?? []).map((g) => [g.id, g.name]));

  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.trending({}),
    queryFn:  async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetchTmdbMoviesTrending({ page: 1 });
      return res.results
        .filter((m) => m.release_date && m.release_date <= today)
        .slice(0, 8)
        .map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useNewReleasesQuery() {
  const movieGenres = useTmdbStore((s) => s.movieGenres);
  const genreMap = new Map((movieGenres ?? []).map((g) => [g.id, g.name]));

  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.nowPlaying({}),
    queryFn:  async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetchTmdbMoviesNowPlaying({ page: 1 });
      return res.results
        .filter((m) => m.release_date && m.release_date <= today)
        .slice(0, 8)
        .map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useTopRatedMoviesQuery() {
  const movieGenres = useTmdbStore((s) => s.movieGenres);
  const genreMap = new Map((movieGenres ?? []).map((g) => [g.id, g.name]));

  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.topRated({}),
    queryFn:  async () => {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetchTmdbMoviesTopRated({ page: 1 });
      return res.results
        .filter((m) => m.release_date && m.release_date <= today)
        .slice(0, 8)
        .map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useMovieDetailQuery(id: number | null) {
  return useQuery<Movie>({
    queryKey: tmdbKeys.movies.detail(id ?? 0),
    queryFn:  async () => {
      const detail = await fetchTmdbMovieDetail(id!);
      return tmdbMovieDetailToMovie(detail);
    },
    enabled:   id !== null && id > 0,
    staleTime: 10 * 60 * 1000,
  });
}
