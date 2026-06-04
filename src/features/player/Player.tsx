import { useState, useCallback, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Button, Spin, Result, Flex } from "antd";
import { useMovieDetailQuery } from "../../api/useMoviesQuery";
import { useTmdbTvDetailQuery, useTmdbMovieDetailQuery } from "../../api/useTmdbQuery";
import { useRecordWatchMutation, useWatchHistoryQuery } from "../../api/useWatchQuery";
import { tmdbTvDetailToMovie } from "../../utils/tmdbAdapter";
import useResolvedGenres from "../../hooks/useResolvedGenres";
import usePageTitle from "../../hooks/usePageTitle";
import { useTheme } from "../../context/ThemeContext";
import PlayerVideoZone from "./PlayerVideoZone";
import PlayerMeta from "./PlayerMeta";
import "./Player.css";

function PlayerHeader() {
  const { colors, isDark, toggle } = useTheme();
  return (
    <Flex
      component="header"
      align="center"
      justify="space-between"
      gap={12}
      className="player-page__header"
      style={{ background: colors.bgBase, borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}
    >
      <Link to="/" className="player-page__back-link" style={{ flexShrink: 0 }}>
        <Button type="text" icon={<span>←</span>}>
          <span className="player-page__back-label">Back</span>
        </Button>
      </Link>
      <Link to="/" className="player-page__header-logo-link" style={{ flexShrink: 0 }}>
        <img src="/i99flix-logo.png" alt="i99flix" className="player-page__header-logo" />
      </Link>
      <Button
        type="text"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        icon={
          isDark
            ? <span style={{ fontSize: 18, color: colors.starRating }}>☀</span>
            : <span style={{ fontSize: 18, color: colors.accent }}>☾</span>
        }
      />
    </Flex>
  );
}

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isTv = searchParams.get("type") === "tv";

  const [manualSeason,  setManualSeason]  = useState<number | null>(() => {
    const v = parseInt(searchParams.get("season") || "", 10);
    return Number.isFinite(v) && v > 0 ? v : null;
  });
  const [manualEpisode, setManualEpisode] = useState<number | null>(() => {
    const v = parseInt(searchParams.get("episode") || "", 10);
    return Number.isFinite(v) && v > 0 ? v : null;
  });

  const { colors } = useTheme();
  const [playing,  setPlaying]  = useState(false);
  const [servers,  setServers]  = useState(0);

  const movieId = id ? parseInt(id, 10) : null;
  const safeId  = Number.isFinite(movieId) && movieId! > 0 ? movieId : null;

  const { data: movieData,     isLoading: isMovieLoading, isError: isMovieError } =
    useMovieDetailQuery(isTv ? null : safeId);
  const { data: tvDetail,      isLoading: isTvLoading,   isError: isTvError } =
    useTmdbTvDetailQuery(isTv ? safeId : null);
  const { data: movieTmdbDetail } = useTmdbMovieDetailQuery(!isTv ? safeId : null);

  const tmdbDetail = isTv ? tvDetail : movieTmdbDetail;
  const studio     = tmdbDetail?.production_companies?.[0]?.name ?? null;
  const country    = isTv
    ? (tvDetail?.production_countries?.[0]?.name ?? tvDetail?.origin_country?.[0] ?? null)
    : (movieTmdbDetail?.production_countries?.[0]?.name ?? null);
  const language   = tmdbDetail?.spoken_languages?.[0]?.name ?? null;

  const movie     = isTv ? (tvDetail ? tmdbTvDetailToMovie(tvDetail) : null) : movieData;
  const isLoading = isTv ? isTvLoading  : isMovieLoading;
  const isError   = isTv ? isTvError    : isMovieError;

  const resolvedGenres = useResolvedGenres(movie?.genre);

  const totalEpisodesForSeason =
    tvDetail?.seasons?.find((s) => s.season_number === (manualSeason ?? 1))?.episode_count ?? 30;

  const { data: watchHistory } = useWatchHistoryQuery();
  const recordWatch = useRecordWatchMutation();

  const watchEntry = useMemo(
    () => watchHistory?.find((e) => movie && e.movieId === String(movie.id)),
    [watchHistory, movie],
  );

  const watchedEpisodes = useMemo(() => {
    if (!watchEntry?.episodes?.length) return new Set<string>();
    return new Set(watchEntry.episodes.map((ep) => `${ep.season}-${ep.episode}`));
  }, [watchEntry]);

  const hasUrlSeason  = searchParams.has("season");
  const hasUrlEpisode = searchParams.has("episode");

  const lastWatched = useMemo(() => {
    if (!isTv || (hasUrlSeason && hasUrlEpisode) || !watchEntry?.episodes?.length) return null;
    return watchEntry.episodes.reduce((latest, ep) =>
      ep.watchedAt > latest.watchedAt ? ep : latest
    );
  }, [isTv, hasUrlSeason, hasUrlEpisode, watchEntry]);

  const season  = manualSeason  ?? lastWatched?.season  ?? 1;
  const episode = manualEpisode ?? lastWatched?.episode ?? 1;

  const handlePlay = useCallback(() => {
    if (movie) {
      recordWatch.mutate({
        movieId:   String(movie.id),
        title:     movie.title,
        mediaType: movie.mediaType ?? "movie",
        thumbnail: movie.thumbnail,
        ...(isTv ? { season, episode } : {}),
      });
    }
    setPlaying(true);
  }, [movie, isTv, season, episode, recordWatch, setPlaying]);

  const handleSeasonChange = useCallback((s: number) => {
    setManualSeason(s);
    if (playing && isTv && movie) {
      recordWatch.mutate({ movieId: String(movie.id), title: movie.title, mediaType: "tv", thumbnail: movie.thumbnail, season: s, episode });
    }
  }, [playing, isTv, movie, episode, recordWatch]);

  const handleEpisodeChange = useCallback((ep: number) => {
    setManualEpisode(ep);
    if (playing && isTv && movie) {
      recordWatch.mutate({ movieId: String(movie.id), title: movie.title, mediaType: "tv", thumbnail: movie.thumbnail, season, episode: ep });
    }
  }, [playing, isTv, movie, season, recordWatch]);

  usePageTitle(movie?.title, movie?.mediaType, isTv ? season : undefined, isTv ? episode : undefined);

  if (isLoading) {
    return (
      <Flex vertical align="center" justify="center" className="player-page" style={{ background: "#000" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (isError || !movie) {
    return (
      <Flex vertical align="center" justify="center" className="player-page" style={{ background: colors.bgBase }}>
        <Result
          status="404"
          title="Movie not found"
          subTitle="This movie doesn't exist or couldn't be loaded."
          extra={<Link to="/"><Button type="primary">Back to Home</Button></Link>}
        />
      </Flex>
    );
  }

  return (
    <Flex vertical className="player-page" style={{ background: colors.bgBase }}>
      <PlayerHeader />
      <PlayerVideoZone
        movie={movie}
        playing={playing}
        onPlay={handlePlay}
        isTv={isTv}
        season={season}
        episode={episode}
        onSeasonChange={handleSeasonChange}
        onEpisodeChange={handleEpisodeChange}
        watchedEpisodes={watchedEpisodes}
        wasWatched={!!watchEntry}
        tvDetail={tvDetail}
        totalEpisodesForSeason={totalEpisodesForSeason}
        servers={servers}
        onServerChange={setServers}
      />
      <PlayerMeta
        movie={movie}
        studio={studio}
        country={country}
        language={language}
        resolvedGenres={resolvedGenres}
        safeId={safeId}
      />
    </Flex>
  );
}
