import { lazy, Suspense, useState, useEffect } from "react";
import { Link, BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Layout, ConfigProvider, theme } from "antd";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useHomeStore } from "./store/homeStore";
import { usePlayerStore } from "./store/playerStore";
import { useAuthStore } from "./store/authStore";
import { useSessionQuery } from "./api/useAuthQuery";
import { fetchTmdbGenresMovie, fetchTmdbGenresTv } from "./api/tmdbApi";
import { useTmdbStore } from "./store/tmdbStore";
import Nav from "./components/navigation/nav/Nav";
import Sidebar from "./components/navigation/sidebar/Sidebar";
import VideoPlayer from "./features/video-player/VideoPlayer";
import MovieDetailDrawer from "./components/ui/movie-detail-drawer/MovieDetailDrawer";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Home = lazy(() => import("./features/home/Home"));
const Browse = lazy(() => import("./features/browse/Browse"));
const Login = lazy(() => import("./features/auth/login/Login"));
const Signup = lazy(() => import("./features/auth/signup/Signup"));
const ForgotPassword = lazy(() => import("./features/auth/forgot-password/ForgotPassword"));
const ResetPassword = lazy(() => import("./features/auth/reset-password/ResetPassword"));
const VerifyEmail = lazy(() => import("./features/auth/verify-email/VerifyEmail"));
const PlayerPage = lazy(() => import("./features/player/Player"));
const Watchlist  = lazy(() => import("./features/watchlist/Watchlist"));
const Profile    = lazy(() => import("./features/profile/Profile"));
const About = lazy(() => import("./features/legal/About"));
const PrivacyPolicy = lazy(() => import("./features/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./features/legal/TermsOfService"));

const { Content, Footer } = Layout;

const FADE_DURATION = 350;

function AppSplash({ visible, slowStart = false }: { visible: boolean; slowStart?: boolean }) {
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
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "#0d0d1a",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_DURATION}ms ease`,
        pointerEvents: visible ? "all" : "none",
      }}
    >
      <img src="/i99flix-logo.png" alt="i99flix logo" width={200} />
      <div
        style={{
          width: 180,
          height: 3,
          borderRadius: 2,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "40%",
            background: "#e50914",
            borderRadius: 2,
            animation: "splashBar 1.4s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes splashBar {
          0%   { left: -40%; }
          100% { left: 110%; }
        }
      `}</style>
      {slowStart && (
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 8, textAlign: 'center' }}>
          Server is waking up, please wait…
        </div>
      )}
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppLayout() {
  const location = useLocation();
  const { colors } = useTheme();
  const { sidebarOpen, openSidebar, closeSidebar } = useHomeStore();
  const { playingMovie, closePlayer, detailMovie, closeDetail, playFromDetail } = usePlayerStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/verify-email";

  const isLegalPage =
    location.pathname === "/about" ||
    location.pathname === "/privacy-policy" ||
    location.pathname === "/terms-of-service";

  if (isAuthPage) {
    return (
      <Suspense fallback={<AppSplash visible />}>
        <Routes>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  if (isLegalPage) {
    return (
      <Suspense fallback={<AppSplash visible />}>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Layout style={{ minHeight: "100dvh", background: colors.bgBase }}>
      <Nav onMenuOpen={openSidebar} />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <Content
        style={{
          padding: "clamp(16px, 3vw, 32px) clamp(16px, 4vw, 48px)",
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <Suspense fallback={<AppSplash visible />}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
            <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Content>
      <Footer
        style={{
          background: colors.footerBg,
          borderTop: `1px solid ${colors.border}`,
          textAlign: "center",
          padding: "24px 48px",
          color: colors.textMuted,
        }}
      >
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "About", to: "/about" },
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms of Service", to: "/terms-of-service" },
          ].map(({ label, to }) => (
            <Link key={to} to={to} style={{ color: colors.textMuted, fontSize: 13, textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
        <div style={{ color: colors.textMuted, fontSize: 12 }}>
          © 2026 i99flix — Stream unlimited movies, anytime.
        </div>
      </Footer>
      <VideoPlayer movie={playingMovie} open={!!playingMovie} onClose={closePlayer} />
      <MovieDetailDrawer movie={detailMovie} open={!!detailMovie} onClose={closeDetail} onPlay={playFromDetail} />
    </Layout>
  );
}

function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { isCheckingAuth, isAuthenticated } = useAuthStore();
  const [slowStart, setSlowStart] = useState(false);
  useSessionQuery();

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
    if (!isCheckingAuth) { setSlowStart(false); return; }
    const t = setTimeout(() => setSlowStart(true), 8000);
    return () => clearTimeout(t);
  }, [isCheckingAuth]);

  return (
    <>
      <ErrorBoundary>{children}</ErrorBoundary>
      <AppSplash visible={isCheckingAuth} slowStart={slowStart} />
    </>
  );
}

function ThemedApp() {
  const { isDark, colors } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: "#e50914",
          colorBgBase: colors.bgBase,
          colorTextBase: colors.textPrimary,
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        components: {
          Layout: {
            bodyBg: colors.bgBase,
            headerBg: "transparent",
            footerBg: colors.footerBg,
          },
          Menu: isDark
            ? {
              darkItemBg: "transparent",
              darkSubMenuItemBg: "transparent",
              darkItemSelectedBg: "rgba(229,9,20,0.15)",
              darkItemSelectedColor: "#fff",
            }
            : {
              itemSelectedBg: "rgba(229,9,20,0.08)",
              itemSelectedColor: "#e50914",
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
          Drawer: { colorBgElevated: colors.bgBase },
          Modal: { contentBg: colors.bgBase, headerBg: colors.bgBase },
          Card: { colorBgContainer: colors.bgCard },
          Slider: { colorPrimaryBorder: "#e50914", colorPrimary: "#e50914" },
        },
      }}
    >
      <BrowserRouter>
        <AppBootstrap>
          <Routes>
            <Route
              path="/player/:id"
              element={
                <Suspense fallback={<AppSplash visible />}>
                  <PlayerPage />
                </Suspense>
              }
            />
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
