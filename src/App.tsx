import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppBootstrap from './layouts/AppBootstrap';
import AppLayout from './layouts/AppLayout';
import AppSplash from './components/common/AppSplash';
import AuthLayout from './features/auth/AuthLayout';
import GuestRoute from './components/routing/GuestRoute';
import { buildAntdTheme } from './config/antdTheme';

const Login          = lazy(() => import('./features/auth/login/Login'));
const Signup         = lazy(() => import('./features/auth/signup/Signup'));
const ForgotPassword = lazy(() => import('./features/auth/forgot-password/ForgotPassword'));
const ResetPassword  = lazy(() => import('./features/auth/reset-password/ResetPassword'));
const VerifyEmail    = lazy(() => import('./features/auth/verify-email/VerifyEmail'));
const PlayerPage     = lazy(() => import('./features/player/Player'));
const About          = lazy(() => import('./features/legal/About'));
const PrivacyPolicy  = lazy(() => import('./features/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./features/legal/TermsOfService'));
const EmailPreview   = import.meta.env.DEV
  ? lazy(() => import('./features/dev/EmailPreview'))
  : null;

function ThemedApp() {
  const { isDark, colors } = useTheme();

  return (
    <ConfigProvider theme={buildAntdTheme(isDark, colors)}>
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

            <Route element={<AuthLayout />}>
              <Route path="/login"           element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/signup"          element={<GuestRoute><Signup /></GuestRoute>} />
              <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
              <Route path="/reset-password"  element={<GuestRoute><ResetPassword /></GuestRoute>} />
              <Route path="/verify-email"    element={<VerifyEmail />} />
            </Route>

            <Route path="/about"           element={<Suspense fallback={<AppSplash visible />}><About /></Suspense>} />
            <Route path="/privacy-policy"  element={<Suspense fallback={<AppSplash visible />}><PrivacyPolicy /></Suspense>} />
            <Route path="/terms-of-service" element={<Suspense fallback={<AppSplash visible />}><TermsOfService /></Suspense>} />

            {import.meta.env.DEV && EmailPreview && (
              <Route
                path="/dev/email-preview"
                element={
                  <Suspense fallback={<AppSplash visible />}>
                    <EmailPreview />
                  </Suspense>
                }
              />
            )}

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
