import {
  Input,
  Select,
  Row,
  Col,
  Segmented,
  Flex,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import { useBrowseStore, selectActiveFilters } from "../../store/browseStore";
import { useTmdbStore } from "../../store/tmdbStore";
import { useTheme } from "../../context/ThemeContext";
import { YEAR_RANGES } from "../../constants";

export default function BrowseFilters() {
  const { colors } = useTheme();

  const mediaType = useBrowseStore((s) => s.mediaType);
  const { selectedGenre, selectedYear, searchQuery, layout } =
    useBrowseStore(selectActiveFilters);
  const { setSearch, setGenre, setYear, setLayout, setPage } = useBrowseStore();

  const movieGenres = useTmdbStore((s) => s.movieGenres);
  const tvGenres    = useTmdbStore((s) => s.tvGenres);
  const activeGenres = mediaType === "movie" ? movieGenres : tvGenres;
  const isMovie = mediaType === "movie";

  const genres = [
    { label: "All", value: "all" },
    ...activeGenres.map((g) => ({ label: g.name, value: g.name })),
  ];

  return (
    <>
      <div
        className="browse-filters"
        style={{ backgroundColor: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={8}>
            <Input
              placeholder={isMovie ? "Search movies…" : "Search TV series…"}
              prefix={<SearchOutlined style={{ color: colors.textMuted }} />}
              value={searchQuery}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              maxLength={35}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={7} lg={7}>
            <Select
              value={selectedGenre}
              onChange={(v) => { setGenre(v); setPage(1); }}
              style={{ width: "100%" }}
              options={genres}
              placeholder="Select genre"
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={5}>
            <Select
              value={selectedYear}
              onChange={(v) => { setYear(v); setPage(1); }}
              style={{ width: "100%" }}
              placeholder={isMovie ? "Release year" : "Air year"}
              suffixIcon={<CalendarOutlined style={{ color: colors.textMuted }} />}
              options={YEAR_RANGES.map((r) => ({ label: r.label, value: r.value }))}
            />
          </Col>
          <Col xs={24} sm={12} md={3} lg={4}>
            <Flex justify="flex-end" align="center">
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

      <Flex wrap="wrap" gap={8} className="browse-genre-pills">
        {genres.map((g) => (
          <button
            key={g.value}
            className="browse-genre-pill"
            onClick={() => { setGenre(g.value); setPage(1); }}
            style={{
              border: `1px solid ${selectedGenre === g.value ? colors.accent : colors.border}`,
              background:  selectedGenre === g.value ? colors.accent : "transparent",
              color:       selectedGenre === g.value ? "#fff" : colors.textMuted,
              fontWeight:  selectedGenre === g.value ? 600 : 400,
              flexShrink: 0,
            }}
          >
            {g.label}
          </button>
        ))}
      </Flex>
    </>
  );
}
