import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AuthShowcase from './AuthShowcase';
import './auth.css';
import { Flex } from 'antd';

interface AuthLayoutProps {
  children: ReactNode;
}

const FOOTER_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { colors } = useTheme();

  return (
    <Flex className="auth-layout" style={{ background: colors.bgBase }}>
      <AuthShowcase />

      <Flex vertical align="center" justify="space-between" className="auth-panel" style={{ background: colors.bgBase, flexShrink: 0 }}>
        <Flex className="auth-panel__inner" justify="center" align="center" vertical flex={1}>
          <img src="/i99flix-logo.png" alt="i99flix logo" width={150} />
          {children}
        </Flex>

        <footer className="auth-panel__footer">
          <Flex justify="center" wrap="wrap" gap="6px 20px" className="auth-panel__footer-links">
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
          </Flex>
          <p className="auth-panel__footer-copy" style={{ color: colors.textMuted }}>
            © 2026 i99flix
          </p>
        </footer>

      </Flex>
    </Flex>
  );
}
