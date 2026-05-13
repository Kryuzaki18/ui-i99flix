/**
 * AuthShowcase — animated left panel for login/signup pages.
 *
 * Fetches trending movies from the public backend endpoint
 * GET /api/v1/tmdb/showcase — no auth or TMDB token required in the browser.
 * The TMDB key stays entirely server-side.
 */

import { useState, useEffect, useRef } from 'react';
import { StarFilled, FireFilled } from '@ant-design/icons';
import { Skeleton } from 'antd';
import { useTheme } from '../../context/ThemeContext';
import type { Movie } from '../../models/movie';
import type { TmdbMovieListItem } from '../../models/tmdb';
import { tmdbMovieListItemToMovie } from '../../utils/tmdbAdapter';

const SLIDE_INTERVAL = 5000; // ms
const SHOWCASE_COUNT = 5;

// Base URL without /api/v1 suffix — showcase is a public call, no cookie needed
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?? 'http://localhost:4321/api/v1';

async function fetchShowcaseMovies(): Promise<Movie[]> {
  const res = await fetch(`${BASE_URL}/tmdb/showcase`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Showcase fetch failed: ${res.status}`);
  const data = await res.json() as { results: TmdbMovieListItem[] };
  return data.results
    .slice(0, SHOWCASE_COUNT)
    .map((item) => tmdbMovieListItemToMovie(item));
}

export default function AuthShowcase() {
  const [movies, setMovies]       = useState<Movie[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading]     = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    let cancelled = false;

    fetchShowcaseMovies()
      .then((result) => {
        if (!cancelled) {
          setMovies(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (import.meta.env.DEV) {
            console.warn('[AuthShowcase] Failed to load showcase movies:', err?.message ?? err);
          }
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  // Auto-advance slides once movies are loaded
  useEffect(() => {
    if (movies.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % movies.length);
    }, SLIDE_INTERVAL);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [movies.length]);

  const active = movies[activeIdx];

  return (
    <div
      className="auth-showcase"
      style={{ '--auth-edge-color': isDark ? '#0d0d1a' : '#f0f2f5' } as React.CSSProperties}
    >
      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="auth-showcase__skeleton">
          <Skeleton.Image active style={{ width: '100%', height: '100%', borderRadius: 0 }} />
        </div>
      )}

      {/* ── Backdrop slides ── */}
      {movies.map((movie, i) => (
        <div
          key={movie.id}
          className={`auth-showcase__slide ${i === activeIdx ? 'is-active' : ''}`}
          style={{ backgroundImage: movie.backdrop ? `url(${movie.backdrop})` : undefined }}
        />
      ))}

      {/* Overlays */}
      <div className="auth-showcase__overlay" />
      <div className="auth-showcase__edge-fade" />

      {/* Ambient orbs */}
      <div className="auth-showcase__orb auth-showcase__orb--1" />
      <div className="auth-showcase__orb auth-showcase__orb--2" />
      <div className="auth-showcase__orb auth-showcase__orb--3" />

      <div className="auth-showcase__brand">
        <img src="/i99flix-logo.png" alt="i99flix logo" width={70} />
      </div>

      {/* ── Floating movie cards ── */}
      {movies.length > 0 && (
        <div className="auth-showcase__cards">
          {movies.map((movie) => (
            <div key={movie.id} className="auth-showcase__movie-card">
              <img src={movie.thumbnail} alt={movie.title} loading="lazy" />
              <div className="auth-showcase__card-label">{movie.title}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Active movie info ── */}
      {active && (
        <div className="auth-showcase__info" key={activeIdx}>
          <div className="auth-showcase__info-badge">
            <FireFilled />
            Trending
          </div>
          <h2 className="auth-showcase__info-title">{active.title}</h2>
          <div className="auth-showcase__info-meta">
            <span className="auth-showcase__info-rating">
              <StarFilled />
              {active.rating.toFixed(1)}
            </span>
            <span className="auth-showcase__info-year">{active.year}</span>
            <span className="auth-showcase__info-duration">{active.duration}</span>
            {active.genre.slice(0, 2).map((g) => (
              <span key={g} className="auth-showcase__info-genre">{g}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Slide dots ── */}
      {movies.length > 1 && (
        <div className="auth-showcase__dots">
          {movies.map((_, i) => (
            <button
              key={i}
              className={`auth-showcase__dot ${i === activeIdx ? 'is-active' : ''}`}
              onClick={() => {
                setActiveIdx(i);
                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                  setActiveIdx((idx) => (idx + 1) % movies.length);
                }, SLIDE_INTERVAL);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
