import { Typography, Space, Flex } from 'antd';
import MovieCard from '../movie-card/MovieCard';
import MovieListRow from '../movie-list-row/MovieListRow';
import { MovieCardSkeleton, MovieListRowSkeleton } from '../movie-card-skeleton/MovieCardSkeleton';
import ScrollableRow from '../scrollable-row/ScrollableRow';
import { usePlayerStore } from '../../../store/playerStore';
import type { Movie } from '../../../models/movieModel';
import './MovieSection.css';

const { Title } = Typography;

interface MovieSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  movies: Movie[];
  isLoading: boolean;
  layout: 'grid' | 'list';
}

export default function MovieSection({ id, title, icon, movies, isLoading, layout }: MovieSectionProps) {
  const { playMovie, openDetail } = usePlayerStore();

  const gridContent = isLoading
    ? Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="movie-section__item">
          <MovieCardSkeleton />
        </div>
      ))
    : movies.map((movie) => (
        <div key={movie.id} className="movie-section__item">
          <MovieCard movie={movie} onPlay={playMovie} onDetail={openDetail} />
        </div>
      ));

  const listContent = isLoading
    ? Array.from({ length: 6 }).map((_, i) => <MovieListRowSkeleton key={i} />)
    : movies.map((movie) => (
        <MovieListRow key={movie.id} movie={movie} onPlay={playMovie} onDetail={openDetail} />
      ));

  return (
    <section id={id} className="home-section">
      <Flex align="center" justify="space-between" className="home-section__header">
        <Space align="center">
          <span className="home-section__icon">{icon}</span>
          <Title level={3} className="home-section__title">
            {title}
          </Title>
        </Space>
      </Flex>

      {layout === 'grid' ? (
        <ScrollableRow scrollAmount={640}>
          <div className="movie-section__track">{gridContent}</div>
        </ScrollableRow>
      ) : (
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {listContent}
        </Space>
      )}
    </section>
  );
}
