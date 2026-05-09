import { Typography, Row, Col, Space } from 'antd';
import { FireOutlined, ThunderboltOutlined, StarOutlined } from '@ant-design/icons';
import HeroBanner from '../../components/ui/hero-banner/HeroBanner';
import MovieCard from '../../components/ui/movie-card/MovieCard';
import { useMovies } from '../../hooks/useMovies';
import { useTheme } from '../../context/ThemeContext';
import type { Movie } from '../../models/movie';

const { Title } = Typography;

interface HomeProps {
  onPlay: (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

function MovieSection({ title, icon, movies, onPlay, onDetail }: SectionProps) {
  return (
    <section style={{ marginBottom: 48 }}>
      <Space align="center" style={{ marginBottom: 20 }}>
        <span style={{ color: '#e50914', fontSize: 20 }}>{icon}</span>
        <Title level={3} style={{ margin: 0 }}>
          {title}
        </Title>
      </Space>
      <Row gutter={[16, 16]}>
        {movies.map((movie) => (
          <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <MovieCard movie={movie} onPlay={onPlay} onDetail={onDetail} />
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default function Home({ onPlay, onDetail }: HomeProps) {
  const { featured, trending, newReleases } = useMovies();
  useTheme(); // ensure re-render on theme change

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <HeroBanner movies={featured} onPlay={onPlay} onDetail={onDetail} />
      </div>

      <MovieSection
        title="Trending Now"
        icon={<FireOutlined />}
        movies={trending}
        onPlay={onPlay}
        onDetail={onDetail}
      />

      <MovieSection
        title="New Releases"
        icon={<ThunderboltOutlined />}
        movies={newReleases}
        onPlay={onPlay}
        onDetail={onDetail}
      />

      <MovieSection
        title="Top Rated"
        icon={<StarOutlined />}
        movies={featured}
        onPlay={onPlay}
        onDetail={onDetail}
      />
    </div>
  );
}
