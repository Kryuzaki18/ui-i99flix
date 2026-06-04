import { useMemo } from "react";
import { useWatchHistoryQuery } from "../api/useWatchQuery";
import type { Movie } from "../models/movieModel";

interface WatchedStatus {
  isWatched: boolean;
  episodeCount: number;
  lastSeason: number | null;
  lastEpisode: number | null;
}

export default function useWatchedStatus(movie: Movie | null): WatchedStatus {
  const { data: watchHistory = [] } = useWatchHistoryQuery();

  return useMemo(() => {
    if (!movie)
      return {
        isWatched: false,
        episodeCount: 0,
        lastSeason: null,
        lastEpisode: null,
      };

    const entry = watchHistory.find((e) => e.movieId === String(movie.id));
    if (!entry)
      return {
        isWatched: false,
        episodeCount: 0,
        lastSeason: null,
        lastEpisode: null,
      };

    const episodeCount = entry.episodes
      ? new Set(entry.episodes.map((ep) => `${ep.season}-${ep.episode}`)).size
      : 0;

    const last = entry.episodes?.length
      ? entry.episodes.reduce((latest, ep) =>
          ep.watchedAt > latest.watchedAt ? ep : latest,
        )
      : null;

    return {
      isWatched: true,
      episodeCount,
      lastSeason: last?.season ?? null,
      lastEpisode: last?.episode ?? null,
    };
  }, [watchHistory, movie]);
}
