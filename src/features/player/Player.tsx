import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Slider, Button, Tag, Space, Rate, Spin, Result, Tooltip } from 'antd';
import {
  PlayCircleOutlined, PauseCircleOutlined,
  ExpandOutlined, CompressOutlined,
  SoundOutlined, SoundFilled, StepForwardOutlined, StepBackwardOutlined,
  ArrowLeftOutlined, PlayCircleFilled,
} from '@ant-design/icons';
import { useMovieDetailQuery } from '../../api/useMoviesQuery';
import { GENRE_COLORS } from '../../constants/genres';
import { useTheme } from '../../context/ThemeContext';
import { useVolumeControl } from '../../hooks/useVolumeControl';
import { useFullscreen } from '../../hooks/useFullscreen';
import './Player.css';

const { Title, Text, Paragraph } = Typography;

// Inline muted SVG icon (no Ant Design equivalent)
function MutedIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      className={className}
      aria-label="Muted"
    >
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10.18l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l2 2L21 18.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

export default function Player() {
  const { id } = useParams<{ id: string }>();
  const { colors, isDark } = useTheme();

  const movieId = id ? parseInt(id, 10) : null;
  const { data: movie, isLoading, isError } = useMovieDetailQuery(
    Number.isFinite(movieId) ? movieId : null
  );

  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    volume,
    muted,
    volumeIcon,
    setVolume,
    toggleMute,
    resumeContext,
    setMediaMetadata,
  } = useVolumeControl();

  const { isFullscreen, toggleFullscreen, fullscreenRef } = useFullscreen();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="player-page player-page--loading" style={{ background: '#000' }}>
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
          subTitle="Lorem ipsum dolor sit amet — this movie doesn't exist."
          extra={
            <Link to="/">
              <Button type="primary" style={{ background: '#e50914', borderColor: '#e50914' }}>
                Back to Home
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const elapsedMinutes = Math.floor((progress / 100) * parseInt(movie.duration, 10) || 0);
  const sliderValue    = muted ? 0 : volume;

  const VolumeIconComponent =
    volumeIcon === 'muted' ? MutedIcon :
    volumeIcon === 'low'   ? SoundOutlined : SoundFilled;

  const volumeTooltip =
    muted
      ? 'Muted — click to unmute'
      : `Volume: ${volume}% (relative to system volume)`;

  const handlePlayToggle = async () => {
    await resumeContext();
    setMediaMetadata({
      title:   movie.title,
      artist:  `${movie.year} · ${movie.duration}`,
      album:   movie.genre.join(', '),
      artwork: movie.thumbnail,
    });
    setPlaying((p) => !p);
  };

  const handleVolumeChange = async (v: number) => {
    await resumeContext();
    setVolume(v);
  };

  const handleMuteToggle = async () => {
    await resumeContext();
    toggleMute();
  };

  return (
    <div className="player-page" style={{ background: '#000' }}>
      {/*
        fullscreenRef wraps the video area so the controls stay visible
        inside the fullscreen element.
      */}
      <div
        ref={fullscreenRef}
        className={`player-page__video${isFullscreen ? ' player-page__video--fullscreen' : ''}`}
        onDoubleClick={toggleFullscreen}
      >
        {/* Clickable video zone (separate from double-click to avoid conflict) */}
        <div className="player-page__video-clickzone" onClick={handlePlayToggle}>
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="player-page__backdrop"
            style={{ opacity: playing ? 0.25 : 0.65 }}
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
              <PlayCircleFilled style={{ color: '#e50914', fontSize: 20 }} />
              <Text className="player-page__brand">
                Lorem<span style={{ color: '#e50914' }}>Flix</span>
              </Text>
            </Space>
          </div>

          {/* Centre play/pause */}
          <div className="player-page__overlay">
            {!playing ? (
              <div className="player-page__play-wrap">
                <PlayCircleOutlined className="player-page__play-icon" />
                <Text className="player-page__play-hint">Click to play</Text>
              </div>
            ) : (
              <PauseCircleOutlined className="player-page__pause-icon" />
            )}
          </div>

          {/* Bottom title overlay */}
          <div className="player-page__title-overlay">
            <Space size={6} wrap>
              {movie.genre.map((g) => (
                <Tag key={g} color={GENRE_COLORS[g] || 'default'} style={{ fontSize: 11 }}>{g}</Tag>
              ))}
            </Space>
            <Title level={2} className="player-page__title">{movie.title}</Title>
            <Space size={12}>
              <Rate disabled allowHalf defaultValue={movie.rating / 2} style={{ fontSize: 13, color: '#fadb14' }} />
              <Text style={{ color: '#fadb14', fontWeight: 700, fontSize: 13 }}>{movie.rating}/10</Text>
              <Text style={{ color: '#ccc', fontSize: 13 }}>{movie.year}</Text>
              <Text style={{ color: '#ccc', fontSize: 13 }}>{movie.duration}</Text>
            </Space>
          </div>
        </div>

        {/* ── Controls bar (inside fullscreen root) ── */}
        <div
          className="player-page__controls"
          style={{ background: isDark ? '#0d0d0d' : '#111' }}
        >
          <Slider
            value={progress}
            onChange={setProgress}
            tooltip={{ formatter: (v) => `${v}%` }}
            styles={{ track: { background: '#e50914' }, handle: { borderColor: '#e50914' } }}
            className="player-page__progress"
          />

          <div className="player-page__controls-row">
            <Space size={4} align="center">
              <Button type="text" icon={<StepBackwardOutlined />} className="player-page__btn-nav" />
              <Button
                type="text"
                icon={playing ? <PauseCircleOutlined style={{ fontSize: 32 }} /> : <PlayCircleOutlined style={{ fontSize: 32 }} />}
                onClick={handlePlayToggle}
                className="player-page__btn-playpause"
              />
              <Button type="text" icon={<StepForwardOutlined />} className="player-page__btn-nav" />
              <Text className="player-page__time">
                {elapsedMinutes}m / {movie.duration}
              </Text>
            </Space>

            <Space size={4} align="center">
              <Tooltip title={volumeTooltip} placement="top">
                <Button
                  type="text"
                  icon={<VolumeIconComponent className={muted ? 'player-page__volume-icon--muted' : 'player-page__volume-icon'} />}
                  onClick={handleMuteToggle}
                  className={muted ? 'player-page__btn-mute--active' : 'player-page__btn-mute'}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                />
              </Tooltip>

              <Tooltip title={`${sliderValue}% — controls app audio relative to system volume`} placement="top">
                <Slider
                  value={sliderValue}
                  onChange={handleVolumeChange}
                  className="player-page__volume"
                  styles={{ track: { background: muted ? '#444' : '#e50914' }, handle: { borderColor: muted ? '#444' : '#e50914' } }}
                  aria-label="Volume"
                />
              </Tooltip>

              <Tooltip title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F · double-click)'} placement="top">
                <Button
                  type="text"
                  icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                  onClick={toggleFullscreen}
                  className="player-page__btn-nav"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      </div>

      {/* ── Movie info panel ── */}
      <div
        className="player-page__info"
        style={{ background: colors.bgBase, borderTop: `1px solid ${isDark ? '#1a1a2e' : '#e0e0e8'}` }}
      >
        <div className="player-page__info-inner">
          <div className="player-page__info-main">
            <Title level={4} style={{ margin: '0 0 8px', color: colors.textPrimary }}>
              {movie.title}
            </Title>
            <Space size={8} wrap style={{ marginBottom: 12 }}>
              {movie.genre.map((g) => (
                <Tag key={g} color={GENRE_COLORS[g] || 'default'}>{g}</Tag>
              ))}
              {movie.newRelease && <Tag color="gold">New Release</Tag>}
              {movie.trending   && <Tag color="red">Trending</Tag>}
            </Space>
            <Paragraph style={{ color: colors.textSecondary, lineHeight: 1.7, margin: 0 }}>
              {movie.description}
            </Paragraph>
          </div>

          <div className="player-page__info-meta">
            <div className="player-page__meta-item">
              <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>Year</Text>
              <Text strong style={{ color: colors.textPrimary }}>{movie.year}</Text>
            </div>
            <div className="player-page__meta-item">
              <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>Duration</Text>
              <Text strong style={{ color: colors.textPrimary }}>{movie.duration}</Text>
            </div>
            <div className="player-page__meta-item">
              <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>Rating</Text>
              <Text strong style={{ color: '#fadb14' }}>★ {movie.rating}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
