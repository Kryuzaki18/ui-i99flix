import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AuthShowcase from './AuthShowcase';
import AuthLogo from './AuthLogo';
import './auth.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { colors } = useTheme();

  return (
    <div className="auth-layout" style={{ background: colors.bgBase }}>
      <AuthShowcase />
      <div className="auth-panel" style={{ background: colors.bgBase }}>
        <div className="auth-panel__inner">
          <AuthLogo />
          {children}
        </div>
      </div>
    </div>
  );
}
