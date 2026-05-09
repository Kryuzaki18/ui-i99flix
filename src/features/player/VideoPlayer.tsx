import { Modal, Typography, Space, Tag, Button, Slider } from 'antd';
import {
  PlayCircleOutlined, PauseCircleOutlined, ExpandOutlined,
  SoundOutlined, StepForwardOutlined, StepBackwardOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import type { Movie } from '../../models/movie';
import { useTheme } from '../../context/ThemeContext';
import './VideoPlayer.css';

const { Title, Text } = Typography;

interface VideoPlayerProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ movie, open, onClose }: VideoPlayerProps) {
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume]     = useState(80);
  const { colors }              = useTheme();

  if (!movie) return null;

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
      {/* Video area */}
      <div
        className="player__video-area"
        onClick={() => setPlaying((p) => !p)}
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

      {/* Controls */}
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
              icon={playing
                ? <PauseCircleOutlined style={{ fontSize: 28 }} />
                : <PlayCircleOutlined  style={{ fontSize: 28 }} />}
              onClick={() => setPlaying((p) => !p)}
              className="player__btn-play-pause"
            />
            <Button type="text" icon={<StepForwardOutlined />} className="player__btn-nav" />
            <Text className="player__time-text">
              {Math.floor((progress / 100) * 138)}m / {movie.duration}
            </Text>
          </Space>

          <Space size={8} align="center">
            <SoundOutlined className="player__volume-icon" />
            <Slider
              value={volume}
              onChange={setVolume}
              className="player__volume-slider"
              styles={{ track: { background: '#e50914' }, handle: { borderColor: '#e50914' } }}
            />
            <Button type="text" icon={<ExpandOutlined />} className="player__expand-btn" />
          </Space>
        </div>

        <div className="player__info-row">
          {movie.genre.map((g) => (
            <Tag key={g} className="player__genre-tag">{g}</Tag>
          ))}
          <Text className="player__meta-text">{movie.year} · {movie.duration}</Text>
        </div>
      </div>
    </Modal>
  );
}
