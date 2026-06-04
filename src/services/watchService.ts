import { apiGet, apiPost } from './apiService';
import { API_ROUTES } from '../api/environments';

export interface WatchEpisode {
  _id:       string;
  season:    number;
  episode:   number;
  watchedAt: string;
}

export interface WatchEntry {
  movieId:   string;
  title:     string;
  mediaType: 'movie' | 'tv';
  thumbnail: string;
  episodes:  WatchEpisode[];
  watchedAt: string;
}

export interface WatchHistoryResponse {
  history: WatchEntry[];
}

export interface RecordWatchResponse {
  entry: WatchEntry;
}

export interface RecordWatchPayload {
  movieId:    string;
  title:      string;
  mediaType:  'movie' | 'tv';
  thumbnail?: string;
  season?:    number;
  episode?:   number;
}

export const getWatchHistory = () =>
  apiGet<WatchHistoryResponse>(API_ROUTES.WATCH.BASE);

export const recordWatch = (payload: RecordWatchPayload) =>
  apiPost<RecordWatchResponse>(API_ROUTES.WATCH.BASE, payload);
