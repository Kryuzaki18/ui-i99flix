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
import { useTmdbGenresMovieQuery } from './useTmdbQuery';
import type { Movie } from '../models/movie';

const STALE_TIME = 5 * 60 * 1000;

export function useFeaturedMoviesQuery() {
  const { data: genresData } = useTmdbGenresMovieQuery();
  const genreMap = new Map((genresData?.genres ?? []).map((g) => [g.id, g.name]));

  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.popular({}),
    queryFn:  async ({ signal }) => {
      const res = await fetchTmdbMoviesPopular({ page: 1 }, { signal });
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useTrendingMoviesQuery() {
  const { data: genresData } = useTmdbGenresMovieQuery();
  const genreMap = new Map((genresData?.genres ?? []).map((g) => [g.id, g.name]));

  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.trending({}),
    queryFn:  async ({ signal }) => {
      const res = await fetchTmdbMoviesTrending({ page: 1 }, { signal });
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useNewReleasesQuery() {
  const { data: genresData } = useTmdbGenresMovieQuery();
  const genreMap = new Map((genresData?.genres ?? []).map((g) => [g.id, g.name]));

  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.nowPlaying({}),
    queryFn:  async ({ signal }) => {
      const res = await fetchTmdbMoviesNowPlaying({ page: 1 }, { signal });
      return res.results.slice(0, 8).map((m) => tmdbMovieListItemToMovie(m, genreMap));
    },
    staleTime: STALE_TIME,
  });
}

export function useTopRatedMoviesQuery() {
  const { data: genresData } = useTmdbGenresMovieQuery();
  const genreMap = new Map((genresData?.genres ?? []).map((g) => [g.id, g.name]));

  return useQuery<Movie[]>({
    queryKey: tmdbKeys.movies.topRated({}),
    queryFn:  async ({ signal }) => {
      const res = await fetchTmdbMoviesTopRated({ page: 1 }, { signal });
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
