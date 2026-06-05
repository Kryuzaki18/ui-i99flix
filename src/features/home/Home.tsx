import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Flex, Segmented } from "antd";
import {
  FireOutlined,
  ThunderboltOutlined,
  StarOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";

import HeroBanner from "../../components/ui/hero-banner/HeroBanner";
import MovieSection from "../../components/ui/movie-section/MovieSection";
import { usePlayerStore } from "../../store/playerStore";
import { useHomeStore } from "../../store/homeStore";
import {
  useFeaturedMoviesQuery,
  useTrendingMoviesQuery,
  useNewReleasesQuery,
  useTopRatedMoviesQuery,
} from "../../api/tmdb/useMoviesQuery";
import "./Home.css";

export default function Home() {
  const location = useLocation();
  const { playMovie, openDetail } = usePlayerStore();
  const { homeLayout, setHomeLayout } = useHomeStore();

  const { data: featured = [] } = useFeaturedMoviesQuery();
  const { data: trending = [], isLoading: loadingTrending } = useTrendingMoviesQuery();
  const { data: newReleases = [], isLoading: loadingNewReleases } = useNewReleasesQuery();
  const { data: topRated = [], isLoading: loadingTopRated } = useTopRatedMoviesQuery();

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;

    window.history.replaceState({}, '');

    const el = document.getElementById(scrollTo);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div>
      <div className="home-hero-wrap">
        <HeroBanner movies={featured} onPlay={playMovie} onDetail={openDetail} />
      </div>

      <Flex justify="flex-end" className="home-toolbar">
        <Segmented
          value={homeLayout}
          onChange={(v) => setHomeLayout(v as 'grid' | 'list')}
          options={[
            { value: 'grid', icon: <AppstoreOutlined /> },
            { value: 'list', icon: <BarsOutlined /> },
          ]}
        />
      </Flex>

      <MovieSection
        id="trending"
        title="Trending Now"
        icon={<FireOutlined />}
        movies={trending}
        isLoading={loadingTrending}
        layout={homeLayout}
      />
      <MovieSection
        id="new-releases"
        title="New Releases"
        icon={<ThunderboltOutlined />}
        movies={newReleases}
        isLoading={loadingNewReleases}
        layout={homeLayout}
      />
      <MovieSection
        id="top-rated"
        title="Top Rated"
        icon={<StarOutlined />}
        movies={topRated}
        isLoading={loadingTopRated}
        layout={homeLayout}
      />
    </div>
  );
}
