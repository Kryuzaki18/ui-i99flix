import { useEffect } from "react";

const APP_NAME = "i99flix";

export function buildPlayerTitle(
  title: string,
  mediaType?: "movie" | "tv",
  season?: number,
  episode?: number
): string {
  const episodeSuffix =
    mediaType === "tv" && season != null && episode != null
      ? ` - S${season}E${episode}`
      : "";
  return `${title}${episodeSuffix} | ${APP_NAME}`;
}

export default function usePageTitle(
  title: string | null | undefined,
  mediaType?: "movie" | "tv",
  season?: number,
  episode?: number
) {
  useEffect(() => {
    if (title) {
      document.title = buildPlayerTitle(title, mediaType, season, episode);
    }
    return () => {
      document.title = APP_NAME;
    };
  }, [title, mediaType, season, episode]);
}
