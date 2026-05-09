import { useState, useEffect } from 'react';
import { Button, Typography, Space, Tag, Rate, Skeleton } from 'antd';
import { PlayCircleOutlined, InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Movie } from '../../../models/movie';
import { useTheme } from '../../../context/ThemeContext';
import './HeroBanner.css';

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
  const [current, setCurrent]   = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { colors }              = useTheme();

  useEffect(() => { setImgLoaded(false); }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (!movies.length) return null;

  const movie = movies[current];
  const prev  = () => setCurrent((c) => (c - 1 + movies.length) % movies.length);
  const next  = () => setCurrent((c) => (c + 1) % movies.length);

  return (
    <div
      className="hero-banner"
      style={{ background: colors.skeletonBg }}
    >
      {/* Skeleton while loading */}
      {!imgLoaded && (
        <div className="hero-banner__skeleton">
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

      {/* Backdrop */}
      <img
        key={movie.id}
        src={movie.backdrop}
        alt={movie.title}
        onLoad={() => setImgLoaded(true)}
        className="hero-banner__img"
        style={{ opacity: imgLoaded ? 1 : 0 }}
      />

      {/* Gradient overlay */}
      {imgLoaded && <div className="hero-banner__gradient" />}

      {/* Content */}
      {imgLoaded && (
        <div className="hero-banner__content">
          <Space size={6} wrap className="hero-banner__tags">
            {movie.genre.map((g) => (
              <Tag key={g} color={genreColors[g] || 'default'}>{g}</Tag>
            ))}
            {movie.newRelease && <Tag color="gold">New Release</Tag>}
            {movie.trending   && <Tag color="red">Trending</Tag>}
          </Space>

          <Title level={1} className="hero-banner__title">
            {movie.title}
          </Title>

          <Space size={12} className="hero-banner__meta">
            <Rate
              disabled
              allowHalf
              defaultValue={movie.rating / 2}
              style={{ fontSize: 14, color: '#fadb14' }}
            />
            <Text className="hero-banner__rating-value">{movie.rating}/10</Text>
            <Text className="hero-banner__meta-text">{movie.year}</Text>
            <Text className="hero-banner__meta-text">{movie.duration}</Text>
          </Space>

          <Paragraph className="hero-banner__desc" ellipsis={{ rows: 3 }}>
            {movie.description}
          </Paragraph>

          <Space size={12} wrap>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => onPlay(movie)}
              className="hero-banner__btn-play"
            >
              Play Now
            </Button>
            <Button
              size="large"
              icon={<InfoCircleOutlined />}
              onClick={() => onDetail(movie)}
              className="hero-banner__btn-info"
            >
              More Info
            </Button>
          </Space>
        </div>
      )}

      {/* Arrows */}
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        onClick={prev}
        className="hero-banner__arrow hero-banner__arrow--prev"
      />
      <Button
        shape="circle"
        icon={<RightOutlined />}
        onClick={next}
        className="hero-banner__arrow hero-banner__arrow--next"
      />

      {/* Dots */}
      <div className="hero-banner__dots">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`hero-banner__dot ${i === current ? 'hero-banner__dot--active' : 'hero-banner__dot--inactive'}`}
          />
        ))}
      </div>
    </div>
  );
}
