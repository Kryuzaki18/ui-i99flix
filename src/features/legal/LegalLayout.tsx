import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Breadcrumb } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';

const { Content } = Layout;
const { Title, Text } = Typography;

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  breadcrumb: string;
  children: ReactNode;
}

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  breadcrumb,
  children,
}: LegalLayoutProps) {
  const { colors } = useTheme();

  return (
    <Layout style={{ minHeight: '100dvh', backgroundColor: colors.bgBase }}>
      <div
        style={{
          borderBottom: `1px solid ${colors.border}`,
          padding: '16px clamp(20px, 5vw, 80px)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          backgroundColor: colors.bgBase,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/i99flix-logo.png" alt="i99flix" height={28} />
        </Link>
        <Breadcrumb
          style={{ marginLeft: 8 }}
          items={[
            {
              title: (
                <Link to="/" style={{ color: colors.textMuted, fontSize: 13 }}>
                  <ArrowLeftOutlined style={{ marginRight: 6, fontSize: 12 }} />
                  Home
                </Link>
              ),
            },
            {
              title: <span style={{ color: colors.textPrimary, fontSize: 13 }}>{breadcrumb}</span>,
            },
          ]}
        />
      </div>

      <Content
        style={{
          maxWidth: 800,
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(32px, 5vw, 64px) clamp(20px, 5vw, 48px)',
        }}
      >
        <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: `1px solid ${colors.border}` }}>
          <Title
            level={1}
            style={{ color: colors.textPrimary, marginBottom: 8, fontSize: 'clamp(28px, 4vw, 40px)' }}
          >
            {title}
          </Title>
          {subtitle && (
            <Text style={{ color: colors.textMuted, fontSize: 16, display: 'block', marginBottom: 12 }}>
              {subtitle}
            </Text>
          )}
          {lastUpdated && (
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
              Last updated: {lastUpdated}
            </Text>
          )}
        </div>

        <div
          style={{
            color: colors.textPrimary,
            lineHeight: 1.8,
            fontSize: 15,
          }}
        >
          {children}
        </div>

        <div
          style={{
            marginTop: 64,
            paddingTop: 32,
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'About', to: '/about' },
            { label: 'Privacy Policy', to: '/privacy-policy' },
            { label: 'Terms of Service', to: '/terms-of-service' },
          ].map(({ label, to }) => (
            <Link key={to} to={to} style={{ color: colors.textMuted, fontSize: 13, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
          <Text style={{ color: colors.textMuted, fontSize: 13, marginLeft: 'auto' }}>
            © 2026 i99flix
          </Text>
        </div>
      </Content>
    </Layout>
  );
}
