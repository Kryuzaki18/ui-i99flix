/**
 * AuthLayout — shared split-screen wrapper for all auth pages.
 * Left: AnimatedShowcase panel | Right: form panel
 */
import { useTheme } from '../../context/ThemeContext';
import AuthShowcase from './AuthShowcase';
import AuthLogo from './AuthLogo';
import './auth.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isDark } = useTheme();
  const bg = isDark ? '#0d0d1a' : '#f0f2f5';

  return (
    <div className="auth-layout" style={{ background: bg }}>
      <AuthShowcase />
      <div className="auth-panel" style={{ background: bg }}>
        <div className="auth-panel__inner">
          <AuthLogo />
          {children}
        </div>
      </div>
    </div>
  );
}
