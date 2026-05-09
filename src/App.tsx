import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider, theme, Spin } from 'antd';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Nav from './components/navigation/nav/Nav';
import Sidebar from './components/navigation/sidebar/Sidebar';
import VideoPlayer from './features/player/VideoPlayer';
import MovieDetailDrawer from './components/ui/movie-detail-drawer/MovieDetailDrawer';
import type { Movie } from './models/movie';

// ─── Lazy-loaded routes ───────────────────────────────────────────────────────
const Home    = lazy(() => import('./features/home/Home'));
const Browse  = lazy(() => import('./features/browse/Browse'));
const Login   = lazy(() => import('./features/auth/login/Login'));
const Signup  = lazy(() => import('./features/auth/signup/Signup'));

const { Content, Footer } = Layout;

// Full-page loading fallback
function PageLoader() {
  const { colors } = useTheme();
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.bgBase,
      }}
    >
      <Spin size="large" />
    </div>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [detailMovie, setDetailMovie]   = useState<Movie | null>(null);
  const location = useLocation();
  const { colors } = useTheme();

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colors.bgBase }}>
      <Nav onMenuOpen={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Content
        style={{
          padding: 'clamp(16px, 3vw, 32px) clamp(16px, 4vw, 48px)',
          maxWidth: 1400,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onPlay={(m) => setPlayingMovie(m)}
                  onDetail={(m) => setDetailMovie(m)}
                />
              }
            />
            <Route
              path="/browse"
              element={
                <Browse
                  onPlay={(m) => setPlayingMovie(m)}
                  onDetail={(m) => setDetailMovie(m)}
                />
              }
            />
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
          © 2024 LoremFlix — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      </Footer>

      {/* Global modals */}
      <VideoPlayer
        movie={playingMovie}
        open={!!playingMovie}
        onClose={() => setPlayingMovie(null)}
      />
      <MovieDetailDrawer
        movie={detailMovie}
        open={!!detailMovie}
        onClose={() => setDetailMovie(null)}
        onPlay={(m) => {
          setDetailMovie(null);
          setPlayingMovie(m);
        }}
      />
    </Layout>
  );
}

// Inner component so useTheme() can access the provider
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
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
          Drawer: {
            colorBgElevated: colors.bgBase,
          },
          Modal: {
            contentBg: colors.bgBase,
            headerBg: colors.bgBase,
          },
          Card: {
            colorBgContainer: colors.bgCard,
          },
          Slider: {
            colorPrimaryBorder: '#e50914',
            colorPrimary: '#e50914',
          },
        },
      }}
    >
      <BrowserRouter>
        <AppLayout />
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
