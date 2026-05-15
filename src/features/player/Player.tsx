import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
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
  PlayCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useMovieDetailQuery } from "../../api/useMoviesQuery";
import { useTrailerKey } from "../../hooks/useTrailerKey";
import { GENRE_COLORS } from "../../constants/genres";
import { useTheme } from "../../context/ThemeContext";
import { useFullscreen } from "../../hooks/useFullscreen";
import ServerSelector from "../../components/ui/server-selector/ServerSelector";
import ServerIframe from "../../components/ui/server-iframe/ServerIframe";
import "./Player.css";

const { Title, Text, Paragraph } = Typography;

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const { colors } = useTheme();
  const [servers, setServers] = useState(1);

  const movieId = id ? parseInt(id, 10) : null;
  const safeId = Number.isFinite(movieId) && movieId! > 0 ? movieId : null;

  const { data: movie, isLoading, isError } = useMovieDetailQuery(safeId);
  const { trailerKey, isLoading: trailerLoading } = useTrailerKey(safeId);

  const [playing, setPlaying] = useState(false);
  const { isFullscreen, toggleFullscreen, fullscreenRef } = useFullscreen();

  // Pause iframes when navigating away
  useEffect(() => {
    return () => {
      fullscreenRef.current?.querySelectorAll("iframe").forEach((iframe) => {
        iframe.contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*",
        );
      });
    };
  }, [fullscreenRef]);

  const handlePlay = useCallback(() => setPlaying(true), []);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="player-page player-page--loading" style={{ background: "#000" }}>
        <Spin size="large" />
      </div>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────────────
  if (isError || !movie) {
    return (
      <div className="player-page player-page--error" style={{ background: colors.bgBase }}>
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
      <div
        ref={fullscreenRef}
        className={`player-page__video${isFullscreen ? " player-page__video--fullscreen" : ""}`}
        onDoubleClick={toggleFullscreen}
      >
        {/* ── Poster / play gate ── */}
        {!playing && (
          <div className="player-page__video-clickzone" onClick={handlePlay}>
            <img
              src={movie.backdrop || movie.thumbnail}
              alt={movie.title}
              className="player-page__backdrop"
            />
            <div className="player-page__vignette" />

            {/* Top bar */}
            <div className="player-page__topbar">
              <Link to="/" className="player-page__back-link">
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  className="player-page__back-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Back
                </Button>
              </Link>
              <Space align="center" size={8}>
                <PlayCircleFilled style={{ color: "#e50914", fontSize: 20 }} />
                <Text className="player-page__brand">
                  i99<span style={{ color: "#e50914" }}>flix</span>
                </Text>
              </Space>
            </div>

            {/* Centre play icon */}
            <div className="player-page__overlay">
              {trailerLoading ? (
                <LoadingOutlined className="player-page__play-icon" />
              ) : trailerKey ? (
                <div className="player-page__play-wrap">
                  <PlayCircleOutlined className="player-page__play-icon" />
                  <Text className="player-page__play-hint">Click to watch</Text>
                </div>
              ) : (
                <div className="player-page__play-wrap">
                  <PlayCircleOutlined className="player-page__play-icon player-page__play-icon--dim" />
                  <Text className="player-page__play-hint">No trailer available</Text>
                </div>
              )}
            </div>

            {/* Bottom title overlay */}
            <div className="player-page__title-overlay">
              <Space size={6} wrap>
                {movie.genre.map((g) => (
                  <Tag key={g} color={GENRE_COLORS[g] || "default"} style={{ fontSize: 11 }}>
                    {g}
                  </Tag>
                ))}
              </Space>
              <Title level={2} className="player-page__title">{movie.title}</Title>
              <Space size={12}>
                <Rate
                  disabled
                  allowHalf
                  defaultValue={movie.rating / 2}
                  style={{ fontSize: 13, color: "#fadb14" }}
                />
                <Text style={{ color: "#fadb14", fontWeight: 700, fontSize: 13 }}>
                  {movie.rating}/10
                </Text>
                <Text style={{ color: "#ccc", fontSize: 13 }}>{movie.year}</Text>
                <Text style={{ color: "#ccc", fontSize: 13 }}>{movie.duration}</Text>
              </Space>
            </div>
          </div>
        )}

        {/* ── Active player — shown after play ── */}
        {playing && (
          <div className="player-page__iframe-wrap">
            {/* Top bar stays visible over the iframe */}
            <div className="player-page__topbar player-page__topbar--over-iframe">
              <Link to="/" className="player-page__back-link">
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  className="player-page__back-btn"
                >
                  Back
                </Button>
              </Link>
              <Space align="center" size={8}>
                <PlayCircleFilled style={{ color: "#e50914", fontSize: 20 }} />
                <Text className="player-page__brand">
                  i99<span style={{ color: "#e50914" }}>flix</span>
                </Text>
              </Space>
            </div>

            <ServerIframe
              server={servers}
              movieId={movie.id}
              className="player-page__iframe"
            />
          </div>
        )}
      </div>

      {/* ── Controls bar ── */}
      <Flex
        gap="small"
        align="center"
        justify="space-between"
        style={{ background: colors.playerControls, padding: "0.5rem" }}
      >
        <Text>{movie.title} ({movie.year}) • {movie.duration}</Text>

        <ServerSelector activeServer={servers} onServerChange={setServers} />

        <Tooltip
          title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F · double-click)"}
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

      {/* ── Info panel ── */}
      <div
        className="player-page__info"
        style={{
          background: colors.bgBase,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div className="player-page__info-inner">
          <div className="player-page__info-main">
            <Title level={4} style={{ margin: "0 0 8px", color: colors.textPrimary }}>
              {movie.title}
            </Title>
            <Space size={8} wrap style={{ marginBottom: 12 }}>
              {movie.genre.map((g) => (
                <Tag key={g} color={GENRE_COLORS[g] || "default"}>{g}</Tag>
              ))}
              {movie.newRelease && <Tag color="gold">New Release</Tag>}
              {movie.trending && <Tag color="red">Trending</Tag>}
            </Space>
            <Paragraph style={{ color: colors.textSecondary, lineHeight: 1.7, margin: 0 }}>
              {movie.description}
            </Paragraph>
          </div>

          <div className="player-page__info-meta">
            <div className="player-page__meta-item">
              <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>
                Year
              </Text>
              <Text strong style={{ color: colors.textPrimary }}>{movie.year}</Text>
            </div>
            <div className="player-page__meta-item">
              <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>
                Duration
              </Text>
              <Text strong style={{ color: colors.textPrimary }}>{movie.duration}</Text>
            </div>
            <div className="player-page__meta-item">
              <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>
                Rating
              </Text>
              <Text strong style={{ color: "#fadb14" }}>★ {movie.rating}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
