import { Typography, Row, Col, Space, Skeleton, Segmented } from "antd";
import {
  FireOutlined,
  ThunderboltOutlined,
  StarOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";

import HeroBanner from "../../components/ui/hero-banner/HeroBanner";
import MovieCard from "../../components/ui/movie-card/MovieCard";
import MovieListRow from "../../components/ui/movie-list-row/MovieListRow";
import { usePlayerStore } from "../../store/playerStore";
import { useUIStore } from "../../store/uiStore";
import {
  useFeaturedMoviesQuery,
  useTrendingMoviesQuery,
  useNewReleasesQuery,
  useTopRatedMoviesQuery,
} from "../../api/useMoviesQuery";
import type { Movie } from "../../models/movie";
import "./Home.css";

const { Title } = Typography;

interface SectionProps {
  title:     string;
  icon:      React.ReactNode;
  movies:    Movie[];
  isLoading: boolean;
  layout:    'grid' | 'list';
}

function MovieSection({ title, icon, movies, isLoading, layout }: SectionProps) {
  const { playMovie, openDetail } = usePlayerStore();

  const gridContent = isLoading
    ? Array.from({ length: 4 }).map((_, i) => (
        <Col key={i} xs={24} sm={12} md={8} lg={6} xl={6}>
          <Skeleton.Image active style={{ width: "100%", height: 180 }} />
        </Col>
      ))
    : movies.map((movie) => (
        <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
          <MovieCard movie={movie} onPlay={playMovie} onDetail={openDetail} />
        </Col>
      ));

  const listContent = isLoading
    ? Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} active paragraph={{ rows: 1 }} />
      ))
    : movies.map((movie) => (
        <MovieListRow
          key={movie.id}
          movie={movie}
          onPlay={playMovie}
          onDetail={openDetail}
        />
      ));

  return (
    <section className="home-section">
      <div className="home-section__header">
        <Space align="center">
          <span className="home-section__icon">{icon}</span>
          <Title level={3} className="home-section__title">
            {title}
          </Title>
        </Space>
      </div>

      {layout === 'grid' ? (
        <Row gutter={[16, 16]}>{gridContent}</Row>
      ) : (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {listContent}
        </Space>
      )}
    </section>
  );
}

export default function Home() {
  const { playMovie, openDetail } = usePlayerStore();
  const { homeLayout, setHomeLayout } = useUIStore();

  const { data: featured = [] }                              = useFeaturedMoviesQuery();
  const { data: trending = [],     isLoading: loadingTrending     } = useTrendingMoviesQuery();
  const { data: newReleases = [],  isLoading: loadingNewReleases  } = useNewReleasesQuery();
  const { data: topRated = [],     isLoading: loadingTopRated     } = useTopRatedMoviesQuery();

  return (
    <div>
      <div className="home-hero-wrap">
        <HeroBanner
          movies={featured}
          onPlay={playMovie}
          onDetail={openDetail}
        />
      </div>

      <div className="home-toolbar">
        <Segmented
          value={homeLayout}
          onChange={(v) => setHomeLayout(v as 'grid' | 'list')}
          options={[
            { value: 'grid', icon: <AppstoreOutlined /> },
            { value: 'list', icon: <BarsOutlined /> },
          ]}
        />
      </div>

      <MovieSection
        title="Trending Now"
        icon={<FireOutlined />}
        movies={trending}
        isLoading={loadingTrending}
        layout={homeLayout}
      />
      <MovieSection
        title="New Releases"
        icon={<ThunderboltOutlined />}
        movies={newReleases}
        isLoading={loadingNewReleases}
        layout={homeLayout}
      />
      <MovieSection
        title="Top Rated"
        icon={<StarOutlined />}
        movies={topRated}
        isLoading={loadingTopRated}
        layout={homeLayout}
      />
    </div>
  );
}
