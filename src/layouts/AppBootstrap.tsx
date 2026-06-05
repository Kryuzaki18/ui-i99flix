import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import AppSplash from '../components/common/AppSplash';
import { useAuthStore } from '../store/authStore';
import { useTmdbStore } from '../store/tmdbStore';
import { useSessionQuery } from '../api/auth/useAuthQuery';
import { fetchTmdbGenresMovie, fetchTmdbGenresTv } from '../api/tmdb/tmdbApi';

const AUTH_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

export default function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { isCheckingAuth, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [slowStart, setSlowStart] = useState(false);
  useSessionQuery();

  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  useEffect(() => {
    const s = useTmdbStore.getState();
    if (!s.movieGenres || s.movieGenres.length === 0) {
      fetchTmdbGenresMovie().catch(() => {});
    }
    if (!s.tvGenres || s.tvGenres.length === 0) {
      fetchTmdbGenresTv().catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isCheckingAuth) return;
    const t = setTimeout(() => setSlowStart(true), 8000);
    return () => {
      clearTimeout(t);
      setSlowStart(false);
    };
  }, [isCheckingAuth]);

  return (
    <>
      <ErrorBoundary>{children}</ErrorBoundary>
      <AppSplash visible={isCheckingAuth && !isAuthPage} slowStart={slowStart} />
    </>
  );
}
