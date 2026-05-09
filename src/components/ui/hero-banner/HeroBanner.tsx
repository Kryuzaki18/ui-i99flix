import { useState, useEffect } from 'react';
import { Button, Typography, Space, Tag, Rate, Skeleton } from 'antd';
import {
  PlayCircleOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { Movie } from '../../../models/movie';
import { useTheme } from '../../../context/ThemeContext';

const { Title, Paragraph, Text } = Typography;

interface HeroBannerProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

const genreColors: Record<string, string> = {
  Action: 'red',
  Drama: 'blue',
  Comedy: 'gold',
  Thriller: 'purple',
  'Sci-Fi': 'cyan',
  Horror: 'volcano',
  Romance: 'pink',
  Animation: 'green',
};

export default function HeroBanner({ movies, onPlay, onDetail }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { colors } = useTheme();

  // Reset loaded state when slide changes
  useEffect(() => {
    setImgLoaded(false);
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (!movies.length) return null;

  const movie = movies[current];
  const prev = () => setCurrent((c) => (c - 1 + movies.length) % movies.length);
  const next = () => setCurrent((c) => (c + 1) % movies.length);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(380px, 60vh, 620px)',
        overflow: 'hidden',
        borderRadius: 16,
        background: colors.skeletonBg,
      }}
    >
      {/* ── Skeleton shown while image loads ── */}
      {!imgLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(24px, 5vw, 64px)',
            gap: 16,
          }}
        >
          <Skeleton.Button active style={{ width: 160, height: 28, borderRadius: 20 }} />
          <Skeleton.Input active style={{ width: '55%', height: 48 }} />
          <Skeleton.Input active style={{ width: '35%', height: 20 }} />
          <Skeleton active paragraph={{ rows: 2, width: ['90%', '70%'] }} title={false} />
          <Space>
            <Skeleton.Button active style={{ width: 120, height: 44 }} />
            <Skeleton.Button active style={{ width: 120, height: 44 }} />
          </Space>
        </div>
      )}

      {/* ── Backdrop image ── */}
      <img
        key={movie.id}
        src={movie.backdrop}
        alt={movie.title}
        onLoad={() => setImgLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* ── Gradient overlay ── */}
      {imgLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.05) 100%)',
          }}
        />
      )}

      {/* ── Content ── */}
      {imgLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(24px, 5vw, 64px)',
            maxWidth: 600,
          }}
        >
          <Space size={6} wrap style={{ marginBottom: 12 }}>
            {movie.genre.map((g) => (
              <Tag key={g} color={genreColors[g] || 'default'}>
                {g}
              </Tag>
            ))}
            {movie.newRelease && <Tag color="gold">New Release</Tag>}
            {movie.trending && <Tag color="red">Trending</Tag>}
          </Space>

          <Title
            level={1}
            style={{
              color: '#fff',
              margin: '0 0 12px',
              fontSize: 'clamp(24px, 4vw, 48px)',
              lineHeight: 1.2,
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {movie.title}
          </Title>

          <Space size={12} style={{ marginBottom: 12 }}>
            <Rate
              disabled
              allowHalf
              defaultValue={movie.rating / 2}
              style={{ fontSize: 14, color: '#fadb14' }}
            />
            <Text style={{ color: '#fadb14', fontWeight: 700 }}>{movie.rating}/10</Text>
            <Text style={{ color: '#ccc' }}>{movie.year}</Text>
            <Text style={{ color: '#ccc' }}>{movie.duration}</Text>
          </Space>

          <Paragraph
            style={{
              color: '#ddd',
              fontSize: 'clamp(13px, 1.5vw, 16px)',
              marginBottom: 24,
              maxWidth: 480,
              lineHeight: 1.6,
            }}
            ellipsis={{ rows: 3 }}
          >
            {movie.description}
          </Paragraph>

          <Space size={12} wrap>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => onPlay(movie)}
              style={{
                background: '#e50914',
                borderColor: '#e50914',
                fontWeight: 600,
                height: 44,
                paddingInline: 28,
              }}
            >
              Play Now
            </Button>
            <Button
              size="large"
              icon={<InfoCircleOutlined />}
              onClick={() => onDetail(movie)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: '#fff',
                fontWeight: 600,
                height: 44,
                paddingInline: 28,
                backdropFilter: 'blur(4px)',
              }}
            >
              More Info
            </Button>
          </Space>
        </div>
      )}

      {/* ── Navigation arrows ── */}
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        onClick={prev}
        style={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          borderColor: 'transparent',
          color: '#fff',
          zIndex: 2,
        }}
      />
      <Button
        shape="circle"
        icon={<RightOutlined />}
        onClick={next}
        style={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          borderColor: 'transparent',
          color: '#fff',
          zIndex: 2,
        }}
      />

      {/* ── Dots ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 2,
        }}
      >
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background:
                i === current ? '#e50914' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
