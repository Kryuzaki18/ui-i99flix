import {
  Typography,
  Row,
  Col,
  Empty,
  Space,
  Segmented,
  Button,
  Skeleton,
  Input,
  Select,
} from "antd";
import {
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import MovieCard from "../../components/ui/movie-card/MovieCard";
import MovieListRow from "../../components/ui/movie-list-row/MovieListRow";
import { useWatchlistQuery } from "../../api/useWatchlistQuery";
import { watchlistItemToMovie } from "../../api/watchlistApi";
import { useWatchlistStore } from "../../store/watchlistStore";
import { usePlayerStore } from "../../store/playerStore";
import { useTheme } from "../../context/ThemeContext";
import "./Watchlist.css";

const { Title, Text } = Typography;

export default function Watchlist() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { playMovie, openDetail } = usePlayerStore();

  const {
    search,
    sortBy,
    layout,
    mediaFilter,
    setSearch,
    setSortBy,
    setLayout,
    setMediaFilter,
  } = useWatchlistStore();

  const { data: watchlistItems = [], isLoading } = useWatchlistQuery();

  const filtered = watchlistItems
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (item) =>
        mediaFilter === "all" || (item.mediaType ?? "movie") === mediaFilter,
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      if (sortBy === "oldest")
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      if (sortBy === "az") return a.title.localeCompare(b.title);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const skeletonCols = Array.from({ length: 8 });

  return (
    <div className="watchlist">
      <div className="watchlist__header">
        <div>
          <Title level={2} style={{ marginBottom: 4, marginTop: 0 }}>
            My Watchlist
          </Title>
          <Text style={{ color: colors.textMuted }}>
            {isLoading
              ? "Loading your watchlist…"
              : `${watchlistItems.length} ${watchlistItems.length === 1 ? "title" : "titles"} saved`}
          </Text>
        </div>
      </div>

      <div
        className="watchlist__toolbar"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={6} lg={7}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: colors.textMuted }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={5} lg={5}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: "100%" }}
              options={[
                { label: "Newest first", value: "newest" },
                { label: "Oldest first", value: "oldest" },
                { label: "A → Z", value: "az" },
                { label: "Highest rated", value: "rating" },
              ]}
            />
          </Col>
          <Col xs={24} sm={24} md={10} lg={8}>
            <Segmented
              value={mediaFilter}
              onChange={(v) => setMediaFilter(v as "all" | "movie" | "tv")}
              block
              options={[
                { value: "all", label: "All" },
                { value: "movie", label: "Movies" },
                { value: "tv", label: "TV Series" },
              ]}
            />
          </Col>
          <Col
            xs={24}
            sm={24}
            md={3}
            lg={4}
            className="watchlist__toolbar-layout"
          >
            <Segmented
              value={layout}
              onChange={(v) => setLayout(v as "grid" | "list")}
              options={[
                { value: "grid", icon: <AppstoreOutlined /> },
                { value: "list", icon: <BarsOutlined /> },
              ]}
            />
          </Col>
        </Row>
      </div>

      {isLoading ? (
        <Row gutter={[16, 20]} className="watchlist__grid">
          {skeletonCols.map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6}>
              <Skeleton.Image active style={{ width: "100%", height: 180 }} />
              <Skeleton
                active
                paragraph={{ rows: 2 }}
                style={{ marginTop: 8 }}
              />
            </Col>
          ))}
        </Row>
      ) : watchlistItems.length === 0 ? (
        <Empty
          className="watchlist__empty"
          image={<HeartOutlined className="watchlist__empty-icon" />}
          description={
            <Space orientation="vertical" align="center" size={4}>
              <Text strong style={{ fontSize: 16 }}>
                Your watchlist is empty
              </Text>
              <Text style={{ color: colors.textMuted }}>
                Browse movies and TV series and add them to watch later.
              </Text>
            </Space>
          }
        >
          <Button type="primary" onClick={() => navigate("/browse")}>
            Browse titles
          </Button>
        </Empty>
      ) : filtered.length === 0 ? (
        <Empty
          description={
            <Text style={{ color: colors.textMuted }}>
              No
              {mediaFilter !== "all"
                ? ` ${mediaFilter === "tv" ? "TV series" : "movies"}`
                : " titles"}
              {search ? (
                <>
                  {" "}
                  matching "<strong>{search}</strong>"
                </>
              ) : (
                " in your watchlist"
              )}
              .
            </Text>
          }
          style={{ padding: "60px 0" }}
        />
      ) : layout === "grid" ? (
        <Row gutter={[16, 20]} className="watchlist__grid">
          {filtered.map((item) => (
            <Col key={item.movieId} xs={24} sm={12} md={8} lg={6}>
              <MovieCard
                movie={watchlistItemToMovie(item)}
                onPlay={playMovie}
                onDetail={openDetail}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Space
          orientation="vertical"
          size={12}
          style={{ width: "100%" }}
          className="watchlist__list"
        >
          {filtered.map((item) => (
            <MovieListRow
              key={item.movieId}
              movie={watchlistItemToMovie(item)}
              onPlay={playMovie}
              onDetail={openDetail}
            />
          ))}
        </Space>
      )}
    </div>
  );
}
