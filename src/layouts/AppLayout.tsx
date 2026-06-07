import { lazy, Suspense, useEffect } from 'react';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Nav from '../components/navigation/nav/Nav';
import Sidebar from '../components/navigation/sidebar/Sidebar';
import VideoPlayer from '../features/video-player/VideoPlayer';
import MovieDetailDrawer from '../components/ui/movie-detail-drawer/MovieDetailDrawer';
import AppSplash from '../components/common/AppSplash';
import ProtectedRoute from '../components/routing/ProtectedRoute';
import { useHomeStore } from '../store/homeStore';
import { usePlayerStore } from '../store/playerStore';
import { useTheme } from '../context/ThemeContext';
import { useRouteTitle } from '../hooks/usePageTitle';

const Home      = lazy(() => import('../features/home/Home'));
const Browse    = lazy(() => import('../features/browse/Browse'));
const Watchlist = lazy(() => import('../features/watchlist/Watchlist'));
const Profile   = lazy(() => import('../features/profile/Profile'));

const { Content, Footer } = Layout;

const FOOTER_LINKS = [
  { label: 'About',           to: '/about' },
  { label: 'Privacy Policy',  to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
];

export default function AppLayout() {
  const location = useLocation();
  const { colors } = useTheme();
  useRouteTitle();

  const { sidebarOpen, openSidebar, closeSidebar } = useHomeStore();
  const { playingMovie, closePlayer, detailMovie, closeDetail, playFromDetail } = usePlayerStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  return (
    <Layout style={{ minHeight: '100dvh', backgroundColor: colors.bgBase }}>
      <Nav onMenuOpen={openSidebar} />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <Content
        style={{
          padding: 'clamp(16px, 3vw, 32px) clamp(16px, 4vw, 48px)',
          maxWidth: 1400,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <Suspense fallback={<AppSplash visible />}>
          <Routes>
            <Route path="/"          element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/browse"    element={<ProtectedRoute><Browse /></ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
            <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Content>

      <Footer
        style={{
          backgroundColor: colors.footerBg,
          borderTop: `1px solid ${colors.border}`,
          textAlign: 'center',
          padding: '24px 48px',
          color: colors.textMuted,
        }}
      >
        <div
          style={{
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {FOOTER_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              style={{ color: colors.textMuted, fontSize: 13, textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
        </div>
        <div style={{ color: colors.textMuted, fontSize: 12 }}>
          © 2026 i99flix — Stream unlimited movies, anytime.
        </div>
      </Footer>

      <VideoPlayer movie={playingMovie} open={!!playingMovie} onClose={closePlayer} />
      <MovieDetailDrawer
        movie={detailMovie}
        open={!!detailMovie}
        onClose={closeDetail}
        onPlay={playFromDetail}
      />
    </Layout>
  );
}
