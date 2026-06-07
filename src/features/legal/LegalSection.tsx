import type { ReactNode } from 'react';
import { Typography } from 'antd';
import { useTheme } from '../../context/ThemeContext';

const { Title, Text, Paragraph } = Typography;

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  const { colors } = useTheme();
  return (
    <section style={{ marginBottom: 40 }}>
      <Title level={3} style={{ color: colors.textPrimary, marginBottom: 12, fontSize: 20 }}>
        {title}
      </Title>
      {children}
    </section>
  );
}

interface PProps { children: ReactNode }

export function P({ children }: PProps) {
  const { colors } = useTheme();
  return (
    <Paragraph style={{ color: colors.textSecondary, marginBottom: 12, lineHeight: 1.8 }}>
      {children}
    </Paragraph>
  );
}

interface UlProps { items: string[] }

export function Ul({ items }: UlProps) {
  const { colors } = useTheme();
  return (
    <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
      {items.map((item) => (
        <li key={item} style={{ marginBottom: 6 }}>
          <Text style={{ color: colors.textSecondary, lineHeight: 1.8 }}>{item}</Text>
        </li>
      ))}
    </ul>
  );
}

interface HighlightBoxProps { children: ReactNode }

export function HighlightBox({ children }: HighlightBoxProps) {
  const { colors } = useTheme();
  return (
    <div
      style={{
        backgroundColor: 'rgba(229,9,20,0.08)',
        borderLeft: '3px solid #e50914',
        borderRadius: '0 8px 8px 0',
        padding: '14px 18px',
        marginBottom: 16,
      }}
    >
      <Text style={{ color: colors.textSecondary, lineHeight: 1.8 }}>{children}</Text>
    </div>
  );
}
