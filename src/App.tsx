import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider, theme, Spin } from 'antd';
import { PlayCircleFilled } from '@ant-design/icons';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useUIStore }      from './store/uiStore';
import { usePlayerStore }  from './store/playerStore';
import { useAuthStore }    from './store/authStore';
import { useSessionQuery } from './api/useAuthQuery';
import Nav from './components/navigation/nav/Nav';
import Sidebar from './components/navigation/sidebar/Sidebar';
import VideoPlayer from './features/video-player/VideoPlayer';
import MovieDetailDrawer from './components/ui/movie-detail-drawer/MovieDetailDrawer';
import { ErrorBoundary } from './components/ErrorBoundary';

// ─── Lazy-loaded routes ───────────────────────────────────────────────────────
const Home           = lazy(() => import('./features/home/Home'));
const Browse         = lazy(() => import('./features/browse/Browse'));
const Login          = lazy(() => import('./features/auth/login/Login'));
const Signup         = lazy(() => import('./features/auth/signup/Signup'));
const ForgotPassword = lazy(() => import('./features/auth/forgot-password/ForgotPassword'));
const ResetPassword  = lazy(() => import('./features/auth/reset-password/ResetPassword'));
const PlayerPage     = lazy(() => import('./features/player/Player'));

const { Content, Footer } = Layout;

// ─── Full-screen branded splash ───────────────────────────────────────────────
// Rendered as a persistent overlay that fades out once auth is resolved.
// Never unmounts instantly — the fade gives the router time to redirect
// before any protected content becomes visible.
const FADE_DURATION = 350; // ms — must match the CSS transition below

function AppSplash({ visible }: { visible: boolean }) {
  // Keep the node in the DOM until the fade finishes, then remove it
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => setMounted(false), FADE_DURATION);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        background: '#0d0d1a',
        zIndex: 9999,
        // Fade out when visible flips to false
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_DURATION}ms ease`,
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <PlayCircleFilled style={{ fontSize: 40, color: '#e50914' }} />
        <span
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-1px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          i99<span style={{ color: '#e50914' }}>flix</span>
        </span>
      </div>

      {/* Spinner */}
      <Spin size="large" />

      {/* Sliding progress bar */}
      <div
        style={{
          width: 180,
          height: 3,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '40%',
            background: '#e50914',
            borderRadius: 2,
            animation: 'splashBar 1.4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes splashBar {
          0%   { left: -40%; }
          100% { left: 110%; }
        }
      `}</style>
    </div>
  );
}

// ─── Route guards ─────────────────────────────────────────────────────────────

/** Blocks protected pages until auth is confirmed. Never flashes content. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  // Auth check still in-flight — render nothing (AppBootstrap already shows splash)
  if (isCheckingAuth) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Redirects already-authenticated users away from auth pages. */
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ─── App shell ────────────────────────────────────────────────────────────────

function AppLayout() {
  const location = useLocation();
  const { colors } = useTheme();

  const { sidebarOpen, openSidebar, closeSidebar } = useUIStore();
  const {
    playingMovie, closePlayer,
    detailMovie,  closeDetail,
    playFromDetail,
  } = usePlayerStore();

  const isAuthPage =
    location.pathname === '/login'           ||
    location.pathname === '/signup'          ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password';

  if (isAuthPage) {
    return (
      <Suspense fallback={<AppSplash visible />}>
        <Routes>
          <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup"          element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password"  element={<GuestRoute><ResetPassword /></GuestRoute>} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colors.bgBase }}>
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
            <Route path="/"       element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </Content>

      <Footer
        style={{
          background: colors.footerBg,
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
          {['About', 'Privacy Policy', 'Terms of Service', 'Help Center', 'Contact'].map(
            (item) => (
              <a
                key={item}
                href="#"
                style={{ color: colors.textMuted, fontSize: 13, textDecoration: 'none' }}
              >
                {item}
              </a>
            )
          )}
        </div>
        <div style={{ color: colors.textMuted, fontSize: 12 }}>
          © 2026 i99flix — Stream unlimited movies, anytime.
        </div>
      </Footer>

      <VideoPlayer
        movie={playingMovie}
        open={!!playingMovie}
        onClose={closePlayer}
      />
      <MovieDetailDrawer
        movie={detailMovie}
        open={!!detailMovie}
        onClose={closeDetail}
        onPlay={playFromDetail}
      />
    </Layout>
  );
}

// ─── Bootstrap: fires the session check BEFORE any route renders ──────────────
// The splash is an overlay — children always render underneath it.
// This means the router resolves and redirects happen during the fade,
// so by the time the splash is fully gone the correct page is already mounted.
function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { isCheckingAuth } = useAuthStore();
  useSessionQuery();

  return (
    <>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <AppSplash visible={isCheckingAuth} />
    </>
  );
}

// ─── Themed wrapper ───────────────────────────────────────────────────────────

function ThemedApp() {
  const { isDark, colors } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#e50914',
          colorBgBase: colors.bgBase,
          colorTextBase: colors.textPrimary,
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        components: {
          Layout: {
            bodyBg: colors.bgBase,
            headerBg: 'transparent',
            footerBg: colors.footerBg,
          },
          Menu: isDark
            ? {
                darkItemBg: 'transparent',
                darkSubMenuItemBg: 'transparent',
                darkItemSelectedBg: 'rgba(229,9,20,0.15)',
                darkItemSelectedColor: '#fff',
              }
            : {
                itemSelectedBg: 'rgba(229,9,20,0.08)',
                itemSelectedColor: '#e50914',
              },
          Input: {
            colorBgContainer: colors.inputBg,
            colorBorder: colors.border,
            colorText: colors.textPrimary,
            colorTextPlaceholder: colors.textMuted,
          },
          Select: {
            colorBgContainer: colors.inputBg,
            colorBorder: colors.border,
            colorText: colors.textPrimary,
          },
          Drawer:  { colorBgElevated: colors.bgBase },
          Modal:   { contentBg: colors.bgBase, headerBg: colors.bgBase },
          Card:    { colorBgContainer: colors.bgCard },
          Slider:  { colorPrimaryBorder: '#e50914', colorPrimary: '#e50914' },
        },
      }}
    >
      <BrowserRouter>
        <AppBootstrap>
          <Routes>
            {/* Standalone full-page player — no nav/footer shell */}
            <Route
              path="/player/:id"
              element={
                <Suspense fallback={<AppSplash visible />}>
                  <PlayerPage />
                </Suspense>
              }
            />
            {/* Main app shell */}
            <Route path="*" element={<AppLayout />} />
          </Routes>
        </AppBootstrap>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
