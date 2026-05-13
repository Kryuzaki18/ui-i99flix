import { Typography, Row, Col, Space, Skeleton } from 'antd';
import { FireOutlined, ThunderboltOutlined, StarOutlined } from '@ant-design/icons';
import HeroBanner from '../../components/ui/hero-banner/HeroBanner';
import MovieCard from '../../components/ui/movie-card/MovieCard';
import { usePlayerStore } from '../../store/playerStore';
import {
  useFeaturedMoviesQuery,
  useTrendingMoviesQuery,
  useNewReleasesQuery,
  useTopRatedMoviesQuery,
} from '../../api/useMoviesQuery';
import type { Movie } from '../../models/movie';
import './Home.css';

const { Title } = Typography;

interface SectionProps {
  title:     string;
  icon:      React.ReactNode;
  movies:    Movie[];
  isLoading: boolean;
}

function MovieSection({ title, icon, movies, isLoading }: SectionProps) {
  const { playMovie, openDetail } = usePlayerStore();

  return (
    <section className="home-section">
      <Space align="center" className="home-section__header">
        <span className="home-section__icon">{icon}</span>
        <Title level={3} className="home-section__title">{title}</Title>
      </Space>
      <Row gutter={[16, 16]}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Col key={i} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Skeleton.Image active style={{ width: '100%', height: 180 }} />
              </Col>
            ))
          : movies.map((movie) => (
              <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <MovieCard movie={movie} onPlay={playMovie} onDetail={openDetail} />
              </Col>
            ))}
      </Row>
    </section>
  );
}

export default function Home() {
  const { playMovie, openDetail } = usePlayerStore();

  const { data: featured    = [], isLoading: loadingFeatured    } = useFeaturedMoviesQuery();
  const { data: trending    = [], isLoading: loadingTrending    } = useTrendingMoviesQuery();
  const { data: newReleases = [], isLoading: loadingNewReleases } = useNewReleasesQuery();
  const { data: topRated    = [], isLoading: loadingTopRated    } = useTopRatedMoviesQuery();

  return (
    <div>
      <div className="home-hero-wrap">
        <HeroBanner
          movies={featured}
          onPlay={playMovie}
          onDetail={openDetail}
        />
      </div>

      <MovieSection
        title="Trending Now"
        icon={<FireOutlined />}
        movies={trending}
        isLoading={loadingTrending}
      />
      <MovieSection
        title="New Releases"
        icon={<ThunderboltOutlined />}
        movies={newReleases}
        isLoading={loadingNewReleases}
      />
      <MovieSection
        title="Top Rated"
        icon={<StarOutlined />}
        movies={topRated}
        isLoading={loadingTopRated}
      />
    </div>
  );
}
