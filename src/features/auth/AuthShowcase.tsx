import { useState, useEffect, useRef, useCallback } from "react";
import {
  StarFilled,
  FireFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Tag, Flex, Button } from "antd";
import { useTheme } from "../../context/ThemeContext";
import { GENRE_COLORS } from "../../constants/genres";
import { API_ROUTES } from "../../api/environments";
import { useTmdbStore } from "../../store/tmdbStore";
import type { Movie } from "../../models/movieModel";
import type { TmdbMovieListItem } from "../../models/tmdbModel";
import { fetchTmdbGenresMovie, fetchTmdbGenresTv } from "../../api/tmdb/tmdbApi";
import {
  tmdbMovieListItemToMovie,
  buildGenreMap,
} from "../../utils/tmdbAdapter";

const SLIDE_INTERVAL = 5000;
const SHOWCASE_COUNT = 10;

async function fetchShowcaseMovies(): Promise<Movie[]> {
  const resPromise = fetch(API_ROUTES.TMDB.SHOWCASE, {
    headers: { Accept: "application/json" },
  });

  const s = useTmdbStore.getState();
  const movieGenresPromise = s.movieGenres?.length
    ? Promise.resolve({ genres: s.movieGenres })
    : fetchTmdbGenresMovie().catch(() => ({ genres: [] }));
  const tvGenresPromise = s.tvGenres?.length
    ? Promise.resolve({ genres: s.tvGenres })
    : fetchTmdbGenresTv().catch(() => ({ genres: [] }));

  const [res, movieRes, tvRes] = await Promise.all([
    resPromise,
    movieGenresPromise,
    tvGenresPromise,
  ]);
  if (!res.ok) throw new Error(`Showcase fetch failed: ${res.status}`);
  const data = (await res.json()) as { results: TmdbMovieListItem[] };

  const mergedGenres = [...movieRes.genres, ...tvRes.genres];
  const dynamicGenreMap = buildGenreMap(mergedGenres);

  return data.results
    .slice(0, SHOWCASE_COUNT)
    .map((item) => tmdbMovieListItemToMovie(item, dynamicGenreMap));
}

export default function AuthShowcase() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    let cancelled = false;
    fetchShowcaseMovies()
      .then((result) => {
        if (!cancelled) setMovies(result);
      })
      .catch((err) => {
        if (!cancelled && import.meta.env.DEV) {
          console.warn(
            "[AuthShowcase] Failed to load showcase movies:",
            err?.message ?? err,
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (movies.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % movies.length);
    }, SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [movies.length]);

  const goToSlide = useCallback(
    (i: number) => {
      setActiveIdx(i);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setActiveIdx((idx) => (idx + 1) % movies.length);
      }, SLIDE_INTERVAL);
    },
    [movies.length],
  );

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const raf = requestAnimationFrame(updateArrows);
    const el = scrollRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("scroll", updateArrows);
    };
  }, [movies.length, updateArrows]);

  const scrollStrip = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  const handleCardClick = useCallback(
    (i: number) => {
      goToSlide(i);
      const el = scrollRef.current;
      const card = el?.children[i] as HTMLElement | undefined;
      card?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    },
    [goToSlide],
  );

  return (
    <div
      className="auth-showcase"
      style={
        {
          "--auth-edge-color": isDark ? "#0d0d1a" : "#f0f2f5",
          flex: 1,
        } as React.CSSProperties
      }
    >
      {movies.map((movie, i) => (
        <div
          key={movie.id}
          className={`auth-showcase__slide ${i === activeIdx ? "is-active" : ""}`}
          style={{
            backgroundImage: movie.backdrop
              ? `url(${movie.backdrop})`
              : undefined,
          }}
        />
      ))}

      <div className="auth-showcase__overlay" />
      <div className="auth-showcase__edge-fade" />

      <div className="auth-showcase__orb auth-showcase__orb--1" />
      <div className="auth-showcase__orb auth-showcase__orb--2" />
      <div className="auth-showcase__orb auth-showcase__orb--3" />

      {movies.length > 0 && (
        <Flex vertical className="auth-showcase__bottom">
          <div className="auth-showcase__info">
            {movies.map((movie, i) => (
              <div
                key={movie.id}
                className={`auth-showcase__info-content ${i === activeIdx ? "is-active" : ""}`}
              >
                <Flex
                  component="div"
                  align="center"
                  gap={6}
                  className="auth-showcase__info-badge"
                >
                  <FireFilled />
                  Trending
                </Flex>
                <h2 className="auth-showcase__info-title">{movie.title}</h2>
                <Flex
                  align="center"
                  gap={12}
                  wrap="wrap"
                  className="auth-showcase__info-meta"
                >
                  <Flex
                    component="span"
                    align="center"
                    gap={4}
                    className="auth-showcase__info-rating"
                  >
                    <StarFilled />
                    {movie.rating.toFixed(1)}
                  </Flex>
                  <span className="auth-showcase__info-year">{movie.year}</span>
                  {movie.duration && movie.duration !== "N/A" && (
                    <span className="auth-showcase__info-duration">
                      {movie.duration}
                    </span>
                  )}
                  {movie.genre.slice(0, 2).map((g) => (
                    <Tag
                      key={g}
                      color={GENRE_COLORS[g] ?? "default"}
                      style={{ margin: 0, fontSize: 11, fontWeight: 600 }}
                    >
                      {g}
                    </Tag>
                  ))}
                </Flex>
                {movie.description && (
                  <p className="auth-showcase__info-description">
                    {movie.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <Flex align="center" className="auth-showcase__cards-section">
            {canLeft && (
              <Button
                shape="circle"
                size="large"
                color="primary"
                variant="solid"
                icon={<LeftOutlined />}
                className="auth-showcase__scroll-btn auth-showcase__scroll-btn--left"
                onClick={() => scrollStrip("left")}
                aria-label="Scroll left"
              />
            )}

            <Flex
              ref={scrollRef}
              gap={10}
              flex={1}
              className="auth-showcase__cards"
              style={{ minWidth: 0 }}
            >
              {movies.map((movie, i) => (
                <div
                  key={movie.id}
                  className={`auth-showcase__movie-card ${i === activeIdx ? "is-active" : ""}`}
                  onClick={() => handleCardClick(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${movie.title}`}
                  onKeyDown={(e) => e.key === "Enter" && handleCardClick(i)}
                  style={{ flexShrink: 0 }}
                >
                  <img src={movie.thumbnail} alt={movie.title} loading="lazy" />
                  <div className="auth-showcase__card-label">{movie.title}</div>
                </div>
              ))}
            </Flex>

            {canRight && (
              <Button
                shape="circle"
                size="large"
                color="primary"
                variant="solid"
                icon={<RightOutlined />}
                className="auth-showcase__scroll-btn auth-showcase__scroll-btn--right"
                onClick={() => scrollStrip("right")}
                aria-label="Scroll right"
              />
            )}
          </Flex>

          {movies.length > 1 && (
            <Flex gap={8} align="center" className="auth-showcase__dots">
              {movies.map((movie, i) => (
                <button
                  key={movie.id}
                  className={`auth-showcase__dot ${i === activeIdx ? "is-active" : ""}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{ flexShrink: 0 }}
                />
              ))}
            </Flex>
          )}
        </Flex>
      )}
    </div>
  );
}
