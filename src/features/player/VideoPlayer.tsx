import { Modal, Typography, Space, Tag, Button, Slider } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ExpandOutlined,
  SoundOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import type { Movie } from '../../models/movie';
import { useTheme } from '../../context/ThemeContext';

const { Title, Text } = Typography;

interface VideoPlayerProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ movie, open, onClose }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const { colors } = useTheme();

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
      closeIcon={
        <span
          style={{
            color: '#fff',
            fontSize: 18,
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </span>
      }
    >
      {/* Video area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: '#000',
          cursor: 'pointer',
        }}
        onClick={() => setPlaying((p) => !p)}
      >
        <img
          src={movie.backdrop}
          alt={movie.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: playing ? 0.3 : 0.7,
          }}
        />

        {/* Play / Pause overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!playing ? (
            <PlayCircleOutlined
              style={{
                fontSize: 72,
                color: 'rgba(255,255,255,0.9)',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
              }}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <PauseCircleOutlined
                style={{
                  fontSize: 72,
                  color: 'rgba(255,255,255,0.4)',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
                }}
              />
              <div style={{ marginTop: 12 }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                  Now Playing — Demo Mode
                </Text>
              </div>
            </div>
          )}
        </div>

        {/* Title overlay */}
        <div style={{ position: 'absolute', top: 16, left: 20 }}>
          <Title
            level={5}
            style={{
              color: '#fff',
              margin: 0,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            {movie.title}
          </Title>
        </div>
      </div>

      {/* Controls bar — always dark regardless of app theme */}
      <div style={{ background: colors.playerControls, padding: '12px 20px 16px' }}>
        <Slider
          value={progress}
          onChange={setProgress}
          tooltip={{ formatter: (v) => `${v}%` }}
          styles={{
            track: { background: '#e50914' },
            handle: { borderColor: '#e50914' },
          }}
          style={{ marginBottom: 8 }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <Space size={8}>
            <Button type="text" icon={<StepBackwardOutlined />} style={{ color: '#fff' }} />
            <Button
              type="text"
              icon={
                playing ? (
                  <PauseCircleOutlined style={{ fontSize: 28 }} />
                ) : (
                  <PlayCircleOutlined style={{ fontSize: 28 }} />
                )
              }
              onClick={() => setPlaying((p) => !p)}
              style={{ color: '#e50914' }}
            />
            <Button type="text" icon={<StepForwardOutlined />} style={{ color: '#fff' }} />
            <Text style={{ color: '#aaa', fontSize: 13 }}>
              {Math.floor((progress / 100) * 138)}m / {movie.duration}
            </Text>
          </Space>

          <Space size={8} align="center">
            <SoundOutlined style={{ color: '#aaa' }} />
            <Slider
              value={volume}
              onChange={setVolume}
              style={{ width: 80 }}
              styles={{
                track: { background: '#e50914' },
                handle: { borderColor: '#e50914' },
              }}
            />
            <Button type="text" icon={<ExpandOutlined />} style={{ color: '#aaa' }} />
          </Space>
        </div>

        <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {movie.genre.map((g) => (
            <Tag key={g} style={{ fontSize: 11 }}>
              {g}
            </Tag>
          ))}
          <Text style={{ color: '#666', fontSize: 12 }}>
            {movie.year} · {movie.duration}
          </Text>
        </div>
      </div>
    </Modal>
  );
}
