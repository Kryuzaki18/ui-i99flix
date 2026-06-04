import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRecordWatchMutation, useWatchHistoryQuery } from "../../api/useWatchQuery";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  Typography,
  Button,
  Tag,
  Space,
  Spin,
  Result,
  Tooltip,
  Flex,
} from "antd";
import {
  PlayCircleOutlined,
  ArrowLeftOutlined,
  SunOutlined,
  MoonOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useMovieDetailQuery } from "../../api/useMoviesQuery";
import { useTmdbTvDetailQuery, useTmdbMovieDetailQuery } from "../../api/useTmdbQuery";
import { tmdbTvDetailToMovie } from "../../utils/tmdbAdapter";
import TvEpisodeSelector from "../../components/ui/tv-episode-selector/TvEpisodeSelector";
import CastSection from "../../components/ui/cast-section/CastSection";
import useResolvedGenres from "../../hooks/useResolvedGenres";
import usePageTitle from "../../hooks/usePageTitle";
import { useTheme } from "../../context/ThemeContext";
import ServerSelector from "../../components/ui/server-selector/ServerSelector";
import ServerIframe from "../../components/ui/server-iframe/ServerIframe";
import ExpandableText from "../../components/ui/expandable-text/ExpandableText";
import "./Player.css";

const { Title, Text } = Typography;

function PlayerHeader() {
  const { colors, isDark, toggle } = useTheme();
  return (
    <Flex
      component="header"
      align="center"
      justify="space-between"
      gap={12}
      className="player-page__header"
      style={{
        background: colors.bgBase,
        borderBottom: `1px solid ${colors.border}`,
        flexShrink: 0,
      }}
    >
      <Link to="/" className="player-page__back-link" style={{ flexShrink: 0 }}>
        <Button type="text" icon={<ArrowLeftOutlined />}>
          <span className="player-page__back-label">Back</span>
        </Button>
      </Link>

      <Link to="/" className="player-page__header-logo-link" style={{ flexShrink: 0 }}>
        <img
          src="/i99flix-logo.png"
          alt="i99flix"
          className="player-page__header-logo"
        />
      </Link>

      <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        <Button
          type="text"
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          icon={
            isDark ? (
              <SunOutlined
                style={{ fontSize: 18, color: colors.starRating }}
                aria-hidden="true"
              />
            ) : (
              <MoonOutlined
                style={{ fontSize: 18, color: colors.accent }}
                aria-hidden="true"
              />
            )
          }
        />
      </Tooltip>
    </Flex>
  );
}

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const isTv = type === "tv";

  const [season, setSeason] = useState(() =>
    parseInt(searchParams.get("season") || "1", 10),
  );
  const [episode, setEpisode] = useState(() =>
    parseInt(searchParams.get("episode") || "1", 10),
  );

  const { colors } = useTheme();
  const [servers, setServers] = useState(0);

  const movieId = id ? parseInt(id, 10) : null;
  const safeId = Number.isFinite(movieId) && movieId! > 0 ? movieId : null;

  const {
    data: movieData,
    isLoading: isMovieLoading,
    isError: isMovieError,
  } = useMovieDetailQuery(isTv ? null : safeId);
  const {
    data: tvDetail,
    isLoading: isTvLoading,
    isError: isTvError,
  } = useTmdbTvDetailQuery(isTv ? safeId : null);
  const { data: movieTmdbDetail } = useTmdbMovieDetailQuery(!isTv ? safeId : null);

  const tmdbDetail = isTv ? tvDetail : movieTmdbDetail;
  const studio   = tmdbDetail?.production_companies?.[0]?.name ?? null;
  const country  = isTv
    ? (tvDetail?.production_countries?.[0]?.name ?? tvDetail?.origin_country?.[0] ?? null)
    : (movieTmdbDetail?.production_countries?.[0]?.name ?? null);
  const language = tmdbDetail?.spoken_languages?.[0]?.name ?? null;

  const movie = isTv
    ? tvDetail
      ? tmdbTvDetailToMovie(tvDetail)
      : null
    : movieData;
  const isLoading = isTv ? isTvLoading : isMovieLoading;
  const isError = isTv ? isTvError : isMovieError;

  const resolvedGenres = useResolvedGenres(movie?.genre);

  const selectedSeasonData = tvDetail?.seasons?.find(
    (s) => s.season_number === season,
  );
  const totalEpisodesForSeason = selectedSeasonData?.episode_count || 30;

  const [playing, setPlaying] = useState(false);
  const recordWatch = useRecordWatchMutation();

  const { data: watchHistory } = useWatchHistoryQuery();

  const watchEntry = useMemo(
    () => watchHistory?.find((e) => movie && e.movieId === String(movie.id)),
    [watchHistory, movie?.id],
  );

  const watchedEpisodes = useMemo(() => {
    if (!watchEntry?.episodes?.length) return new Set<string>();
    return new Set(watchEntry.episodes.map((ep) => `${ep.season}-${ep.episode}`));
  }, [watchEntry?.episodes]);

  // Pre-select the last-watched season/episode.
  // Skip if the URL already carried explicit season/episode params.
  const hasUrlSeason  = searchParams.has("season");
  const hasUrlEpisode = searchParams.has("episode");
  const didInitEpisodeRef = useRef(false);

  useEffect(() => {
    if (!isTv) return;
    if (hasUrlSeason && hasUrlEpisode) return;
    if (didInitEpisodeRef.current) return;
    if (!watchEntry?.episodes?.length) return;

    const last = [...watchEntry.episodes].sort((a, b) =>
      b.watchedAt.localeCompare(a.watchedAt),
    )[0];

    setSeason(last.season);
    setEpisode(last.episode);
    didInitEpisodeRef.current = true;
  }, [isTv, hasUrlSeason, hasUrlEpisode, watchEntry?.episodes]);

  const wasWatched = !!watchEntry;

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
  }, [movie, isTv, season, episode, recordWatch]);

  const handleSeasonChange = useCallback((s: number) => {
    setSeason(s);
    if (playing && isTv && movie) {
      recordWatch.mutate({
        movieId:   String(movie.id),
        title:     movie.title,
        mediaType: "tv",
        thumbnail: movie.thumbnail,
        season:    s,
        episode,
      });
    }
  }, [playing, isTv, movie, episode, recordWatch]);

  const handleEpisodeChange = useCallback((ep: number) => {
    setEpisode(ep);
    if (playing && isTv && movie) {
      recordWatch.mutate({
        movieId:   String(movie.id),
        title:     movie.title,
        mediaType: "tv",
        thumbnail: movie.thumbnail,
        season,
        episode:   ep,
      });
    }
  }, [playing, isTv, movie, season, recordWatch]);

  usePageTitle(
    movie?.title,
    movie?.mediaType,
    isTv ? season : undefined,
    isTv ? episode : undefined,
  );

  if (isLoading) {
    return (
      <Flex
        vertical
        align="center"
        justify="center"
        className="player-page"
        style={{ background: "#000" }}
      >
        <Spin size="large" />
      </Flex>
    );
  }

  if (isError || !movie) {
    return (
      <Flex
        vertical
        align="center"
        justify="center"
        className="player-page"
        style={{ background: colors.bgBase }}
      >
        <Result
          status="404"
          title="Movie not found"
          subTitle="This movie doesn't exist or couldn't be loaded."
          extra={
            <Link to="/">
              <Button type="primary">Back to Home</Button>
            </Link>
          }
        />
      </Flex>
    );
  }

  return (
    <Flex
      vertical
      className="player-page"
      style={{ background: colors.bgBase }}
    >
      <PlayerHeader />

      <Flex vertical className="player-page__video" style={{ flexShrink: 0 }}>
        {!playing && (
          <div className="player-page__video-clickzone">
            <img
              src={movie.backdrop || movie.thumbnail}
              alt={movie.title}
              className="player-page__backdrop"
            />
            <div className="player-page__vignette" />

            {wasWatched && (
              <Tag
                icon={<CheckCircleFilled />}
                color="success"
                style={{
                  position:     "absolute",
                  top:          12,
                  left:         12,
                  zIndex:       3,
                  borderRadius: 12,
                  fontWeight:   600,
                  fontSize:     12,
                  padding:      "2px 10px",
                }}
              >
                {isTv
                  ? `${watchedEpisodes.size} episode${watchedEpisodes.size !== 1 ? "s" : ""} watched`
                  : "Watched"}
              </Tag>
            )}

            <Flex
              align="center"
              justify="center"
              className="player-page__overlay"
            >
              <Flex vertical align="center" gap={10}>
                <PlayCircleOutlined
                  className="player-page__play-icon"
                  onClick={handlePlay}
                />
              </Flex>
            </Flex>
          </div>
        )}

        {playing && (
          <Flex vertical flex="1" className="player-page__iframe-wrap">
            <ServerIframe
              server={servers}
              mediaId={movie.id}
              mediaType={movie.mediaType}
              season={season}
              episode={episode}
              className="player-page__iframe"
            />
          </Flex>
        )}
      </Flex>

      <Flex
        gap="small"
        align="center"
        justify="space-between"
        style={{
          background: colors.bgBase,
          padding: "0.5rem",
          position: "relative",
        }}
      >
        {isTv && (
          <TvEpisodeSelector
            season={season}
            episode={episode}
            onSeasonChange={handleSeasonChange}
            onEpisodeChange={handleEpisodeChange}
            watchedEpisodes={watchedEpisodes}
            seasons={tvDetail?.seasons}
            totalEpisodes={totalEpisodesForSeason}
          />
        )}
      </Flex>

      <div style={{ padding: "0.3rem 0.5rem" }}>
        <ServerSelector activeServer={servers} onServerChange={setServers} />
      </div>

      <div
        className="player-page__info"
        style={{
          background: colors.bgBase,
          borderTop: `1px solid ${colors.border}`,
          flex: 1,
        }}
      >
        <div className="player-page__info-inner">
          <div className="player-page__info-main">
            <Title
              level={4}
              style={{ margin: "0 0 8px", color: colors.textPrimary }}
            >
              {movie.title}
            </Title>

            <Flex
              wrap="wrap"
              gap="16px 24px"
              className="player-page__info-meta"
            >
              <Flex vertical gap={2} className="player-page__meta-item">
                <Text
                  className="player-page__meta-label"
                  style={{ color: colors.textMuted }}
                >
                  Year
                </Text>
                <Text strong style={{ color: colors.textPrimary }}>
                  {movie.year}
                </Text>
              </Flex>
              {movie.duration && movie.duration !== "N/A" && (
                <Flex vertical gap={2} className="player-page__meta-item">
                  <Text
                    className="player-page__meta-label"
                    style={{ color: colors.textMuted }}
                  >
                    Duration
                  </Text>
                  <Text strong style={{ color: colors.textPrimary }}>
                    {movie.duration}
                  </Text>
                </Flex>
              )}
              <Flex vertical gap={2} className="player-page__meta-item">
                <Text
                  className="player-page__meta-label"
                  style={{ color: colors.textMuted }}
                >
                  Rating
                </Text>
                <Text strong style={{ color: colors.starRating }}>
                  ★ {movie.rating}
                </Text>
              </Flex>
            </Flex>

            <Space size={8} wrap style={{ marginBottom: 12 }}>
              {resolvedGenres.map((rg) => (
                <Tag key={rg.key} color={rg.color || "default"}>
                  {rg.label}
                </Tag>
              ))}
              {movie.newRelease && <Tag color="gold">New Release</Tag>}
              {movie.trending && <Tag color="red">Trending</Tag>}
            </Space>

            {(studio || country || language) && (
              <Flex vertical gap={6} className="player-page__production">
                {studio && (
                  <Flex align="baseline" gap={8}>
                    <Text className="player-page__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Studio</Text>
                    <Text className="player-page__production-value" style={{ color: colors.textSecondary }}>{studio}</Text>
                  </Flex>
                )}
                {country && (
                  <Flex align="baseline" gap={8}>
                    <Text className="player-page__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Country</Text>
                    <Text className="player-page__production-value" style={{ color: colors.textSecondary }}>{country}</Text>
                  </Flex>
                )}
                {language && (
                  <Flex align="baseline" gap={8}>
                    <Text className="player-page__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Language</Text>
                    <Text className="player-page__production-value" style={{ color: colors.textSecondary }}>{language}</Text>
                  </Flex>
                )}
              </Flex>
            )}

            <ExpandableText
              text={movie.description || "No synopsis available."}
              collapsedLines={3}
              color={colors.textSecondary}
              lineHeight={1.7}
            />

            {safeId && (
              <div style={{ marginTop: 24 }}>
                <CastSection tmdbId={safeId} mediaType={movie.mediaType} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Flex>
  );
}
