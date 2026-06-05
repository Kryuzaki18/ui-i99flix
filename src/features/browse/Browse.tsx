import { useRef } from "react";
import {
  Typography,
  Row,
  Col,
  Space,
  Empty,
  Pagination,
  Tabs,
  Flex,
} from "antd";
import { VideoCameraOutlined, PlaySquareOutlined } from "@ant-design/icons";
import MovieCard from "../../components/ui/movie-card/MovieCard";
import MovieListRow from "../../components/ui/movie-list-row/MovieListRow";
import {
  MovieCardSkeleton,
  MovieListRowSkeleton,
} from "../../components/ui/movie-card-skeleton/MovieCardSkeleton";
import { useBrowseStore, selectActiveFilters } from "../../store/browseStore";
import { usePlayerStore } from "../../store/playerStore";
import { useBrowseQuery } from "../../api/useBrowseQuery";
import { PAGE_SIZE_OPTIONS } from "../../constants";
import { useTheme } from "../../context/ThemeContext";
import BrowseFilters from "./BrowseFilters";
import type { MediaType } from "../../store/browseStore";
import "./Browse.css";

const { Title, Text } = Typography;

const TMDB_PAGE_SIZE = 20;

export default function Browse() {
  const { colors } = useTheme();

  const mediaType = useBrowseStore((s) => s.mediaType);
  const setMediaType = useBrowseStore((s) => s.setMediaType);
  const setPage = useBrowseStore((s) => s.setPage);
  const setPageSize = useBrowseStore((s) => s.setPageSize);
  const { searchQuery, page, pageSize, layout } =
    useBrowseStore(selectActiveFilters);

  const { playMovie, openDetail } = usePlayerStore();
  const result = useBrowseQuery();
  
  const items = result.data?.movies ?? [];
  const total = result.data?.total ?? 0;
  const totalPages = result.data?.totalPages ?? 1;
  const isLoading = result.isLoading;
  const isFetching = result.isFetching;

  const paginationRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const displayItems =
    pageSize < TMDB_PAGE_SIZE ? items.slice(0, pageSize) : items;
  const cappedTotal = Math.min(total, totalPages * pageSize);
  const skeletonCount = Math.min(pageSize, 8);
  const skeletonKeys = Array.from(
    { length: skeletonCount },
    (_, n) => `sk-${n}`,
  );
  const isMovie = mediaType === "movie";

  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    if (ps !== pageSize) setPageSize(ps);
    const el = resultsRef.current;
    if (el) {
      const paginationHeight = paginationRef.current?.offsetHeight ?? 0;
      const top =
        el.getBoundingClientRect().top +
        window.scrollY -
        64 -
        paginationHeight -
        8;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const resultContent = isLoading ? (
    layout === "grid" ? (
      <Row gutter={[16, 20]}>
        {skeletonKeys.map((key) => (
          <Col key={key} xs={24} sm={12} md={8} lg={6}>
            <MovieCardSkeleton />
          </Col>
        ))}
      </Row>
    ) : (
      <Space orientation="vertical" size={12} style={{ width: "100%" }}>
        {skeletonKeys.map((key) => (
          <MovieListRowSkeleton key={key} />
        ))}
      </Space>
    )
  ) : items.length === 0 ? (
    <Empty
      description={
        <Text style={{ color: colors.textMuted }}>
          No {isMovie ? "movies" : "TV series"} found. Try a different search or
          filter.
        </Text>
      }
      style={{ padding: "60px 0" }}
    />
  ) : layout === "grid" ? (
    <Row ref={resultsRef} gutter={[16, 20]}>
      {displayItems.map((item) => (
        <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
          <MovieCard movie={item} onPlay={playMovie} onDetail={openDetail} />
        </Col>
      ))}
    </Row>
  ) : (
    <Space
      ref={resultsRef}
      orientation="vertical"
      size={12}
      style={{ width: "100%" }}
    >
      {displayItems.map((item) => (
        <MovieListRow
          key={item.id}
          movie={item}
          onPlay={playMovie}
          onDetail={openDetail}
        />
      ))}
    </Space>
  );

  const tabContent = (
    <>
      <BrowseFilters />
      <Flex
        ref={paginationRef}
        vertical
        align="center"
        gap={8}
        className="browse-pagination"
      >
        {cappedTotal > 0 && (
          <Text
            className="browse-pagination__total"
            style={{ color: colors.textMuted }}
          >
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, cappedTotal)}{" "}
            of{" "}
            <Text strong style={{ color: colors.textPrimary }}>
              {cappedTotal.toLocaleString()}
            </Text>{" "}
            {isMovie ? "movies" : "series"}
            {searchQuery && (
              <>
                {" "}
                for "<Text style={{ color: colors.accent }}>{searchQuery}</Text>
                "
              </>
            )}
          </Text>
        )}
        <Pagination
          current={page}
          pageSize={pageSize}
          total={cappedTotal}
          onChange={handlePageChange}
          onShowSizeChange={(_, ps) => {
            setPageSize(ps);
            setPage(1);
          }}
          showSizeChanger
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          disabled={total === 0 || isFetching}
          responsive
        />
      </Flex>
      {resultContent}
    </>
  );

  return (
    <div>
      <div className="browse-header">
        <Title level={2} style={{ marginBottom: 4, marginTop: 0 }}>
          Browse
        </Title>
        <Text style={{ color: colors.textMuted }}>
          Discover movies and TV series — search, filter by genre or year.
        </Text>
      </div>

      <Tabs
        activeKey={mediaType}
        onChange={(key) => setMediaType(key as MediaType)}
        className="browse-tabs"
        items={[
          {
            key: "movie",
            label: (
              <Space size={6}>
                <VideoCameraOutlined />
                Movies
              </Space>
            ),
            children: tabContent,
          },
          {
            key: "tv",
            label: (
              <Space size={6}>
                <PlaySquareOutlined />
                TV Series
              </Space>
            ),
            children: tabContent,
          },
        ]}
      />
    </div>
  );
}
