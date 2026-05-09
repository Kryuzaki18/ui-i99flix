import { useState, useEffect, useCallback, memo } from 'react';
import { Button, Typography, Space, Tag, Rate, Skeleton } from 'antd';
import { PlayCircleOutlined, InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Movie } from '../../../models/movie';
import { useTheme } from '../../../context/ThemeContext';
import { GENRE_COLORS } from '../../../constants/genres';
import './HeroBanner.css';

const { Title, Paragraph, Text } = Typography;

const SLIDE_INTERVAL_MS = 6000;

interface HeroBannerProps {
  movies:   Movie[];
  onPlay:   (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

function HeroBannerInner({ movies, onPlay, onDetail }: HeroBannerProps) {
  const [current, setCurrent]     = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { colors }                = useTheme();

  // Reset image loaded state when slide changes
  useEffect(() => { setImgLoaded(false); }, [current]);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + movies.length) % movies.length),
    [movies.length],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % movies.length),
    [movies.length],
  );

  // Auto-advance — pauses when the tab is hidden (Page Visibility API)
  useEffect(() => {
    if (movies.length <= 1) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      timer = setInterval(next, SLIDE_INTERVAL_MS);
    };
    const stop = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };

    const handleVisibility = () => {
      document.hidden ? stop() : start();
    };

    start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [movies.length, next]);

  if (!movies.length) return null;

  const movie = movies[current];

  return (
    <section
      className="hero-banner"
      style={{ background: colors.skeletonBg }}
      aria-label={`Featured movies — currently showing: ${movie.title}`}
      aria-roledescription="carousel"
    >
      {/* Skeleton while loading */}
      {!imgLoaded && (
        <div className="hero-banner__skeleton" aria-hidden="true">
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
        alt=""
        aria-hidden="true"
        onLoad={() => setImgLoaded(true)}
        className="hero-banner__img"
        style={{ opacity: imgLoaded ? 1 : 0 }}
      />

      {/* Gradient overlay */}
      {imgLoaded && <div className="hero-banner__gradient" aria-hidden="true" />}

      {/* Content */}
      {imgLoaded && (
        <div className="hero-banner__content" aria-live="polite" aria-atomic="true">
          <Space size={6} wrap className="hero-banner__tags">
            {movie.genre.map((g) => (
              <Tag key={g} color={GENRE_COLORS[g] || 'default'}>{g}</Tag>
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
              aria-label={`Rating: ${movie.rating} out of 10`}
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
              icon={<PlayCircleOutlined aria-hidden="true" />}
              onClick={() => onPlay(movie)}
              className="hero-banner__btn-play"
              aria-label={`Play ${movie.title}`}
            >
              Play Now
            </Button>
            <Button
              size="large"
              icon={<InfoCircleOutlined aria-hidden="true" />}
              onClick={() => onDetail(movie)}
              className="hero-banner__btn-info"
              aria-label={`More info about ${movie.title}`}
            >
              More Info
            </Button>
          </Space>
        </div>
      )}

      {/* Prev / Next arrows */}
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        onClick={prev}
        className="hero-banner__arrow hero-banner__arrow--prev"
        aria-label="Previous movie"
      />
      <Button
        shape="circle"
        icon={<RightOutlined />}
        onClick={next}
        className="hero-banner__arrow hero-banner__arrow--next"
        aria-label="Next movie"
      />

      {/* Slide indicator dots */}
      <div className="hero-banner__dots" role="tablist" aria-label="Movie slides">
        {movies.map((m, i) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}: ${m.title}`}
            onClick={() => setCurrent(i)}
            className={`hero-banner__dot ${i === current ? 'hero-banner__dot--active' : 'hero-banner__dot--inactive'}`}
          />
        ))}
      </div>
    </section>
  );
}

export default memo(HeroBannerInner);
