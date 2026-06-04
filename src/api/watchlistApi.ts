import { apiGet, apiPost, apiDelete } from '../services/apiService';
import { API_ROUTES } from './environments';
import type { Movie } from '../models/movieModel';

export interface WatchlistItem {
  movieId:     string;
  title:       string;
  description: string;
  genre:       string[];
  rating:      number;
  year:        number;
  releaseDate?: string;
  duration:    string;
  thumbnail:   string;
  backdrop:    string;
  mediaType?:  'movie' | 'tv';
  addedAt:     string;
}

export interface WatchlistResponse {
  watchlist: WatchlistItem[];
}

export function watchlistItemToMovie(item: WatchlistItem): Movie {
  return {
    id:          item.movieId,
    title:       item.title,
    description: item.description,
    genre:       item.genre,
    rating:      item.rating,
    year:        item.year,
    releaseDate: item.releaseDate,
    duration:    item.duration,
    thumbnail:   item.thumbnail,
    backdrop:    item.backdrop,
    mediaType:   item.mediaType,
  };
}

export const getWatchlist = () =>
  apiGet<WatchlistResponse>(API_ROUTES.WATCHLIST.BASE);

export const addToWatchlist = (movie: Movie) =>
  apiPost<WatchlistResponse>(API_ROUTES.WATCHLIST.BASE, {
    movieId:     String(movie.id),
    title:       movie.title,
    description: movie.description,
    genre:       movie.genre,
    rating:      movie.rating,
    year:        movie.year,
    releaseDate: movie.releaseDate,
    duration:    movie.duration,
    thumbnail:   movie.thumbnail,
    backdrop:    movie.backdrop,
    mediaType:   movie.mediaType,
  });

export const removeFromWatchlist = (movieId: string | number) =>
  apiDelete<WatchlistResponse>(API_ROUTES.WATCHLIST.ITEM(movieId));
