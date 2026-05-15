import { useState, useRef, useEffect, useCallback } from "react";
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
import "./Player.css";

const { Title, Text, Paragraph } = Typography;

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const [servers, setServers] = useState(1);

  const movieId = id ? parseInt(id, 10) : null;
  const safeId = Number.isFinite(movieId) && movieId! > 0 ? movieId : null;

  const { data: movie, isLoading, isError } = useMovieDetailQuery(safeId);
  const { trailerKey, isLoading: trailerLoading } = useTrailerKey(safeId);

  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isFullscreen, toggleFullscreen, fullscreenRef } = useFullscreen();

  // Pause when navigating away
  useEffect(() => {
    return () => {
      iframeRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "https://www.youtube.com",
      );
    };
  }, []);

  const handlePlay = useCallback(() => setPlaying(true), []);

  // ── Loading ───────────────────────────────────────────────────────────────
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

  // ── Error / not found ─────────────────────────────────────────────────────
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
              <Button
                type="primary"
                style={{ background: "#e50914", borderColor: "#e50914" }}
              >
                Back to Home
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const youtubeUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`
    : null;

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
                  <Text className="player-page__play-hint">
                    Click to watch trailer
                  </Text>
                </div>
              ) : (
                <div className="player-page__play-wrap">
                  <PlayCircleOutlined className="player-page__play-icon player-page__play-icon--dim" />
                  <Text className="player-page__play-hint">
                    No trailer available
                  </Text>
                </div>
              )}
            </div>

            {/* Bottom title overlay */}
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

        {/* ── YouTube iframe — shown after play ── */}
        {playing && youtubeUrl && (
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

            {servers === 1 && (
              <iframe
                src={`https://ezvidapi.com/embed/movie/${movie.id}?provider=vidsrc`}
                className="player__iframe"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}

            {servers === 2 && (
              <iframe
                src={`https://vidlink.pro/movie/${movie.id}`}
                className="player__iframe"
                allowFullScreen
              ></iframe>
            )}

            {servers === 3 && (
              <iframe
                src={`https://vidsrc.fyi/embed/movie/${movie.id}`}
                className="player__iframe"
                allowFullScreen
              ></iframe>
            )}

            {servers === 4 && (
              <iframe
                src={`https://www.2embed.stream/embed/movie/${movie.id}`}
                className="player__iframe"
                allowFullScreen
              ></iframe>
            )}
          </div>
        )}

        {playing && !youtubeUrl && (
          <div className="player-page__video-clickzone">
            <img
              src={movie.backdrop || movie.thumbnail}
              alt={movie.title}
              className="player-page__backdrop"
              style={{ opacity: 0.3 }}
            />
            <div className="player-page__vignette" />
            <div className="player-page__topbar">
              <Link to="/" className="player-page__back-link">
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  className="player-page__back-btn"
                >
                  Back
                </Button>
              </Link>
            </div>
            <div className="player-page__overlay">
              <Text style={{ color: "#fff", fontSize: 16 }}>
                No trailer available for this title
              </Text>
            </div>
          </div>
        )}
      </div>

      <Flex
        gap="small"
        align="center"
        justify="space-between"
        style={{ background: colors.playerControls, padding: "0.5rem" }}
      >
        <Text >
          {movie.title} ({movie.year}) • {movie.duration}
        </Text>

        <Flex gap="small" align="center" justify="center">
          <Button
            size="small"
            onClick={() => setServers(1)}
            type={servers === 1 ? "primary" : "default"}
          >
            Server 1
          </Button>
          <Button
            size="small"
            onClick={() => setServers(2)}
            type={servers === 2 ? "primary" : "default"}
          >
            Server 2
          </Button>
          <Button
            size="small"
            onClick={() => setServers(3)}
            type={servers === 3 ? "primary" : "default"}
          >
            Server 3
          </Button>
          <Button
            size="small"
            onClick={() => setServers(4)}
            type={servers === 4 ? "primary" : "default"}
          >
            Server 4
          </Button>
        </Flex>

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

      <div
        className="player-page__info"
        style={{
          background: colors.bgBase,
          borderTop: `1px solid ${isDark ? "#1a1a2e" : "#e0e0e8"}`,
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
            <Space size={8} wrap style={{ marginBottom: 12 }}>
              {movie.genre.map((g) => (
                <Tag key={g} color={GENRE_COLORS[g] || "default"}>
                  {g}
                </Tag>
              ))}
              {movie.newRelease && <Tag color="gold">New Release</Tag>}
              {movie.trending && <Tag color="red">Trending</Tag>}
            </Space>
            <Paragraph
              style={{
                color: colors.textSecondary,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {movie.description}
            </Paragraph>
          </div>

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
        </div>
      </div>
    </div>
  );
}
