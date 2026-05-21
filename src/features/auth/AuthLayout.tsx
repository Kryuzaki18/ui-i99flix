import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AuthShowcase from './AuthShowcase';
import AuthLogo from './AuthLogo';
import './auth.css';

interface AuthLayoutProps {
  children: ReactNode;
}

const FOOTER_LINKS = [
  { label: 'About',            to: '/about' },
  { label: 'Privacy Policy',   to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { colors } = useTheme();

  return (
    <div className="auth-layout" style={{ background: colors.bgBase }}>
      <AuthShowcase />
      <div className="auth-panel" style={{ background: colors.bgBase }}>

        {/* Logo — always visible at the top of the panel */}
        <AuthLogo />

        {/* Form content — vertically centred */}
        <div className="auth-panel__inner">
          {children}
        </div>

        {/* Footer — pinned to the bottom */}
        <footer className="auth-panel__footer">
          <div className="auth-panel__footer-links">
            {FOOTER_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{ color: colors.textMuted }}
                className="auth-panel__footer-link"
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="auth-panel__footer-copy" style={{ color: colors.textMuted }}>
            © 2026 i99flix
          </p>
        </footer>

      </div>
    </div>
  );
}
