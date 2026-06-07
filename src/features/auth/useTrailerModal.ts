import { useState, useCallback } from "react";
import { API_ROUTES } from "../../api/environments";
import type { Movie } from "../../models/movieModel";

interface TrailerVideo {
  site: string;
  type: string;
  key: string;
}

export function useTrailerModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openTrailer = useCallback(async (e: React.MouseEvent, movie: Movie) => {
    e.stopPropagation();
    setTitle(movie.title);
    setTrailerKey(null);
    setLoading(true);
    setOpen(true);
    try {
      const res = await fetch(API_ROUTES.TMDB.SHOWCASE_TRAILER(Number(movie.id)), {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as { results: TrailerVideo[] };
      const video =
        data.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
        data.results.find((v) => v.site === "YouTube" && v.type === "Teaser") ??
        data.results.find((v) => v.site === "YouTube");
      setTrailerKey(video?.key ?? null);
    } catch {
      setTrailerKey(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const closeTrailer = useCallback(() => {
    setOpen(false);
    setTrailerKey(null);
  }, []);

  return { open, title, trailerKey, loading, openTrailer, closeTrailer };
}
