import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const APP_NAME = "i99flix";

const ROUTE_TITLES: Record<string, string> = {
  "/": APP_NAME,
  "/browse": `Browse | ${APP_NAME}`,
  "/watchlist": `Watchlist | ${APP_NAME}`,
  "/profile": `Profile | ${APP_NAME}`,
};

export function useRouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = ROUTE_TITLES[pathname] ?? APP_NAME;
  }, [pathname]);
}

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
