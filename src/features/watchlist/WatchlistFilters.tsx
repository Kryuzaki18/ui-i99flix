import { useRef } from "react";
import { Row, Col, Input, Select, Segmented, Flex } from "antd";
import {
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useWatchlistStore } from "../../store/watchlistStore";
import { useTheme } from "../../context/ThemeContext";

export default function WatchlistFilters() {
  const { colors } = useTheme();
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

  const toolbarRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={toolbarRef}
        className="watchlist__toolbar"
        style={{ backgroundColor: colors.bgCard }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={6} lg={7}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined style={{ color: colors.textMuted }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              maxLength={35}
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
          <Col xs={24} sm={24} md={3} lg={4}>
            <Flex justify="flex-end">
              <Segmented
                value={layout}
                onChange={(v) => setLayout(v as "grid" | "list")}
                options={[
                  { value: "grid", icon: <AppstoreOutlined /> },
                  { value: "list", icon: <BarsOutlined /> },
                ]}
              />
            </Flex>
          </Col>
        </Row>
      </div>
    </>
  );
}
