/**
 * AuthShowcase — animated left panel for login/signup pages.
 *
 * Cycles through featured movie backdrops with a smooth crossfade,
 * shows floating movie card thumbnails, and displays metadata for
 * the currently active movie.
 *
 * Pure CSS animations — no extra libraries.
 */

import { useState, useEffect, useRef } from 'react';
import { PlayCircleFilled, StarFilled, FireFilled } from '@ant-design/icons';
import { MOVIES } from '../../constants/movies';
import { useTheme } from '../../context/ThemeContext';

// Pick a curated subset for the showcase
const SHOWCASE_MOVIES = MOVIES.filter((m) => m.featured || m.trending).slice(0, 5);
const CARD_MOVIES     = MOVIES.slice(0, 5);
const SLIDE_INTERVAL  = 5000; // ms

export default function AuthShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isDark } = useTheme();

  // Auto-advance slides
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % SHOWCASE_MOVIES.length);
    }, SLIDE_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const active = SHOWCASE_MOVIES[activeIdx];

  return (
    <div
      className="auth-showcase"
      style={{ '--auth-edge-color': isDark ? '#0d0d1a' : '#f0f2f5' } as React.CSSProperties}
    >
      {/* Backdrop slides */}
      {SHOWCASE_MOVIES.map((movie, i) => (
        <div
          key={movie.id}
          className={`auth-showcase__slide ${i === activeIdx ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
      ))}

      {/* Overlays */}
      <div className="auth-showcase__overlay" />
      <div className="auth-showcase__edge-fade" />

      {/* Ambient orbs */}
      <div className="auth-showcase__orb auth-showcase__orb--1" />
      <div className="auth-showcase__orb auth-showcase__orb--2" />
      <div className="auth-showcase__orb auth-showcase__orb--3" />

      {/* Brand — top left */}
      <div className="auth-showcase__brand">
        <PlayCircleFilled className="auth-showcase__brand-icon" />
        <span className="auth-showcase__brand-name">
          99<span className="auth-showcase__brand-accent">Flix</span>
        </span>
      </div>

      {/* Floating movie cards */}
      <div className="auth-showcase__cards">
        {CARD_MOVIES.map((movie) => (
          <div key={movie.id} className="auth-showcase__movie-card">
            <img src={movie.thumbnail} alt={movie.title} loading="lazy" />
            <div className="auth-showcase__card-label">{movie.title}</div>
          </div>
        ))}
      </div>

      {/* Active movie info */}
      <div className="auth-showcase__info" key={activeIdx}>
        <div className="auth-showcase__info-badge">
          <FireFilled />
          {active.trending ? 'Trending' : 'Featured'}
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

      {/* Slide dots */}
      <div className="auth-showcase__dots">
        {SHOWCASE_MOVIES.map((_, i) => (
          <button
            key={i}
            className={`auth-showcase__dot ${i === activeIdx ? 'is-active' : ''}`}
            onClick={() => {
              setActiveIdx(i);
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = setInterval(() => {
                setActiveIdx((idx) => (idx + 1) % SHOWCASE_MOVIES.length);
              }, SLIDE_INTERVAL);
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
