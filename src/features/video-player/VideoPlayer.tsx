import { Modal, Typography, Space, Tag, Button, Slider, Tooltip } from 'antd';
import {
  PlayCircleOutlined, PauseCircleOutlined,
  ExpandOutlined, CompressOutlined,
  SoundOutlined, SoundFilled, StepForwardOutlined, StepBackwardOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import type { Movie } from '../../models/movie';
import { useTheme } from '../../context/ThemeContext';
import { useVolumeControl } from '../../hooks/useVolumeControl';
import { useFullscreen } from '../../hooks/useFullscreen';
import './VideoPlayer.css';

const { Title, Text } = Typography;

function MutedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" className={className} aria-label="Muted">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10.18l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18l2 2L21 18.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

interface VideoPlayerProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ movie, open, onClose }: VideoPlayerProps) {
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const { colors } = useTheme();

  const { volume, muted, volumeIcon, setVolume, toggleMute, resumeContext, setMediaMetadata } = useVolumeControl();
  const { isFullscreen, toggleFullscreen, fullscreenRef } = useFullscreen();

  if (!movie) return null;

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

  const handleVolumeChange = async (v: number) => { await resumeContext(); setVolume(v); };
  const handleMuteToggle   = async ()            => { await resumeContext(); toggleMute(); };

  const sliderValue = muted ? 0 : volume;
  const VolumeIconComponent = volumeIcon === 'muted' ? MutedIcon : volumeIcon === 'low' ? SoundOutlined : SoundFilled;
  const volumeTooltip = muted ? 'Muted — click to unmute' : `Volume: ${volume}% (relative to system volume)`;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="min(900px, 95vw)"
      centered
      style={{ padding: 0 }}
      styles={{
        body: { background: '#000', padding: 0, borderRadius: 12, overflow: 'hidden' },
        mask: { backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.85)' },
      }}
      closeIcon={<span className="player__close-icon">✕</span>}
    >
      {/*
        The fullscreenRef wraps BOTH the video area and the controls bar so
        that when fullscreen is active, the controls are still visible inside
        the fullscreen element and the CSS can position them at the bottom.
      */}
      <div
        ref={fullscreenRef}
        className={`player__fullscreen-root${isFullscreen ? ' player__fullscreen-root--active' : ''}`}
      >
        {/* ── Video area (click = play/pause, double-click = fullscreen) ── */}
        <div
          className="player__video-area"
          onClick={handlePlayToggle}
          onDoubleClick={toggleFullscreen}
        >
          <img
            src={movie.backdrop}
            alt={movie.title}
            className="player__backdrop"
            style={{ opacity: playing ? 0.3 : 0.7 }}
          />

          <div className="player__overlay">
            {!playing ? (
              <PlayCircleOutlined className="player__play-icon" />
            ) : (
              <div className="player__pause-wrap">
                <PauseCircleOutlined className="player__pause-icon" />
                <div className="player__pause-label-wrap">
                  <Text className="player__pause-label">Now Playing — Demo Mode</Text>
                </div>
              </div>
            )}
          </div>

          <div className="player__title-overlay">
            <Title level={5} className="player__title">{movie.title}</Title>
          </div>
        </div>

        {/* ── Controls bar ── */}
        <div className="player__controls" style={{ background: colors.playerControls }}>
          <Slider
            value={progress}
            onChange={setProgress}
            tooltip={{ formatter: (v) => `${v}%` }}
            styles={{ track: { background: '#e50914' }, handle: { borderColor: '#e50914' } }}
            style={{ marginBottom: 8 }}
          />

          <div className="player__controls-row">
            <Space size={8}>
              <Button type="text" icon={<StepBackwardOutlined />} className="player__btn-nav" />
              <Button
                type="text"
                icon={playing ? <PauseCircleOutlined style={{ fontSize: 28 }} /> : <PlayCircleOutlined style={{ fontSize: 28 }} />}
                onClick={handlePlayToggle}
                className="player__btn-play-pause"
              />
              <Button type="text" icon={<StepForwardOutlined />} className="player__btn-nav" />
              <Text className="player__time-text">
                {Math.floor((progress / 100) * 138)}m / {movie.duration}
              </Text>
            </Space>

            <Space size={4} align="center">
              <Tooltip title={volumeTooltip} placement="top">
                <Button
                  type="text"
                  icon={<VolumeIconComponent className={muted ? 'player__volume-icon--muted' : 'player__volume-icon'} />}
                  onClick={handleMuteToggle}
                  className={muted ? 'player__btn-mute--active' : 'player__btn-mute'}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                />
              </Tooltip>

              <Tooltip title={`${sliderValue}% — controls app audio relative to system volume`} placement="top">
                <Slider
                  value={sliderValue}
                  onChange={handleVolumeChange}
                  className="player__volume-slider"
                  styles={{ track: { background: muted ? '#555' : '#e50914' }, handle: { borderColor: muted ? '#555' : '#e50914' } }}
                  aria-label="Volume"
                />
              </Tooltip>

              <Tooltip title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F · double-click)'} placement="top">
                <Button
                  type="text"
                  icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                  onClick={toggleFullscreen}
                  className="player__expand-btn"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                />
              </Tooltip>
            </Space>
          </div>

          <div className="player__info-row">
            <div className="player__info">
              <Text className="player__meta-text">{movie.year}</Text>
              {movie.genre.map((g) => (
                <Tag key={g} className="player__genre-tag">{g}</Tag>
              ))}
            </div>
            <Button
              size="small"
              color="default"
              variant="solid"
              icon={<LinkOutlined />}
              onClick={() => window.open(`/player/${movie.id}`, '_blank', 'noopener,noreferrer')}
            >
              Open in new tab
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
