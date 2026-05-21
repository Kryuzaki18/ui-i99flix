import { useState, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  Typography,
  Button,
  Tag,
  Space,
  Rate,
  Spin,
  Result,
  Tooltip,
  Flex,
} from "antd";
import {
  PlayCircleOutlined,
  ExpandOutlined,
  CompressOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useMovieDetailQuery } from "../../api/useMoviesQuery";
import { useTmdbTvDetailQuery } from "../../api/useTmdbQuery";
import { tmdbTvDetailToMovie } from "../../utils/tmdbAdapter";
import TvEpisodeSelector from "../../components/ui/tv-episode-selector/TvEpisodeSelector";
import CastSection from "../../components/ui/cast-section/CastSection";
import { GENRE_COLORS } from "../../constants/genres";
import { useTheme } from "../../context/ThemeContext";
import { useFullscreen } from "../../hooks/useFullscreen";
import ServerSelector from "../../components/ui/server-selector/ServerSelector";
import ServerIframe from "../../components/ui/server-iframe/ServerIframe";
import ExpandableText from "../../components/ui/expandable-text/ExpandableText";
import "./Player.css";

const { Title, Text } = Typography;

function PlayerHeader() {
  const { colors } = useTheme();
  return (
    <header className="player-page__header" style={{ background: colors.bgBase, borderBottom: `1px solid ${colors.border}` }}>
      <Link to="/" className="player-page__back-link">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
        >
          Back
        </Button>
      </Link>

      <Link to="/" className="player-page__header-logo-link">
        <img src="/i99flix-logo.png" alt="i99flix" width={100} />
      </Link>
    </header>
  );
}

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const isTv = type === "tv";

  const [season, setSeason] = useState(() => parseInt(searchParams.get("season") || "1", 10));
  const [episode, setEpisode] = useState(() => parseInt(searchParams.get("episode") || "1", 10));

  const { colors } = useTheme();
  const [servers, setServers] = useState(1);

  const movieId = id ? parseInt(id, 10) : null;
  const safeId = Number.isFinite(movieId) && movieId! > 0 ? movieId : null;

  const { data: movieData, isLoading: isMovieLoading, isError: isMovieError } = useMovieDetailQuery(isTv ? null : safeId);
  const { data: tvDetail, isLoading: isTvLoading, isError: isTvError } = useTmdbTvDetailQuery(isTv ? safeId : null);

  const movie = isTv ? (tvDetail ? tmdbTvDetailToMovie(tvDetail) : null) : movieData;
  const isLoading = isTv ? isTvLoading : isMovieLoading;
  const isError = isTv ? isTvError : isMovieError;

  const selectedSeasonData = tvDetail?.seasons?.find(
    (s) => s.season_number === season
  );
  const totalEpisodesForSeason = selectedSeasonData?.episode_count || 30;

  const [playing, setPlaying] = useState(false);
  const { isFullscreen, toggleFullscreen, fullscreenRef } = useFullscreen();

  const handlePlay = useCallback(() => setPlaying(true), []);

  if (isLoading) {
    return (
      <div
        className="player-page player-page--loading"
        style={{ background: "#000" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div
        className="player-page player-page--error"
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
      </div>
    );
  }

  return (
    <div className="player-page" style={{ background: "#000" }}>

      <PlayerHeader />

      <div
        ref={fullscreenRef}
        className={`player-page__video${isFullscreen ? " player-page__video--fullscreen" : ""}`}
        onDoubleClick={toggleFullscreen}
      >
        {!playing && (
          <div className="player-page__video-clickzone" onClick={handlePlay}>
            <img
              src={movie.backdrop || movie.thumbnail}
              alt={movie.title}
              className="player-page__backdrop"
            />
            <div className="player-page__vignette" />

            <div className="player-page__overlay">
              <div className="player-page__play-wrap">
                <PlayCircleOutlined className="player-page__play-icon" />
                <Text className="player-page__play-hint">Click to watch</Text>
              </div>
            </div>

            <div className="player-page__title-overlay">
              <Space size={6} wrap>
                {movie.genre.map((g) => (
                  <Tag
                    key={g}
                    color={GENRE_COLORS[g] || "default"}
                    style={{ fontSize: 11 }}
                  >
                    {g}
                  </Tag>
                ))}
              </Space>
              <Title level={2} className="player-page__title">
                {movie.title}
              </Title>
              <Space size={12}>
                <Rate
                  disabled
                  allowHalf
                  defaultValue={movie.rating / 2}
                  style={{ fontSize: 13, color: "#fadb14" }}
                />
                <Text
                  style={{ color: "#fadb14", fontWeight: 700, fontSize: 13 }}
                >
                  {movie.rating}/10
                </Text>
                <Text style={{ color: "#ccc", fontSize: 13 }}>
                  {movie.year}
                </Text>
                <Text style={{ color: "#ccc", fontSize: 13 }}>
                  {movie.duration}
                </Text>
              </Space>
            </div>
          </div>
        )}

        {playing && (
          <div className="player-page__iframe-wrap">
            <ServerIframe
              server={servers}
              mediaId={movie.id}
              mediaType={movie.mediaType}
              season={season}
              episode={episode}
              className="player-page__iframe"
            />
          </div>
        )}
      </div>

      <Flex
        gap="small"
        align="center"
        justify="space-between"
        style={{ background: colors.playerControls, padding: "0.5rem" }}
      >
        <ServerSelector activeServer={servers} onServerChange={setServers} />

        <Tooltip
          title={
            isFullscreen
              ? "Exit fullscreen (F)"
              : "Fullscreen (F · double-click)"
          }
          placement="top"
        >
          <Button
            type="text"
            icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
            onClick={toggleFullscreen}
            className="player-page__btn-nav"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          />
        </Tooltip>
      </Flex>

      {isTv && (
        <Flex
          style={{ background: colors.playerControls, padding: "0 0.5rem 0.5rem" }}
        >
          <TvEpisodeSelector
            season={season}
            episode={episode}
            onSeasonChange={setSeason}
            onEpisodeChange={setEpisode}
            totalSeasons={tvDetail?.number_of_seasons || 20}
            totalEpisodes={totalEpisodesForSeason}
          />
        </Flex>
      )}

      <div
        className="player-page__info"
        style={{
          background: colors.bgBase,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div className="player-page__info-inner">
          <div className="player-page__info-meta">
            <div className="player-page__meta-item">
              <Text
                className="player-page__meta-label"
                style={{ color: colors.textMuted }}
              >
                Year
              </Text>
              <Text strong style={{ color: colors.textPrimary }}>
                {movie.year}
              </Text>
            </div>
            <div className="player-page__meta-item">
              <Text
                className="player-page__meta-label"
                style={{ color: colors.textMuted }}
              >
                Duration
              </Text>
              <Text strong style={{ color: colors.textPrimary }}>
                {movie.duration}
              </Text>
            </div>
            <div className="player-page__meta-item">
              <Text
                className="player-page__meta-label"
                style={{ color: colors.textMuted }}
              >
                Rating
              </Text>
              <Text strong style={{ color: "#fadb14" }}>
                ★ {movie.rating}
              </Text>
            </div>
          </div>

          <div className="player-page__info-main">
            <Title
              level={4}
              style={{ margin: "0 0 8px", color: colors.textPrimary }}
            >
              {movie.title}
            </Title>
            <Space size={8} wrap style={{ marginBottom: 12 }}>
              {movie.genre.map((g) => (
                <Tag key={g} color={GENRE_COLORS[g] || "default"}>
                  {g}
                </Tag>
              ))}
              {movie.newRelease && <Tag color="gold">New Release</Tag>}
              {movie.trending && <Tag color="red">Trending</Tag>}
            </Space>
            <ExpandableText
              text={movie.description || 'No synopsis available.'}
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
    </div>
  );
}
