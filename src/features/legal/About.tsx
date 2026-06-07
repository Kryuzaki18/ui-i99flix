import { Typography } from 'antd';
import {
  PlayCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';
import LegalLayout from './LegalLayout';
import { Section, P } from './LegalSection';

const { Text } = Typography;

import { darkColors } from '../../constants/theme';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  const { colors } = useTheme();
  return (
    <div
      style={{
        flex: '1 1 160px',
        backgroundColor: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: '24px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 28, color: darkColors.accent, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: colors.textPrimary, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 6 }}>{label}</div>
    </div>
  );
}

export default function About() {
  const { colors } = useTheme();

  return (
    <LegalLayout
      title="About i99flix"
      subtitle="Your personal streaming destination for movies and TV shows."
      breadcrumb="About"
    >
      <div
        style={{
          background: `linear-gradient(135deg, rgba(229,9,20,0.12) 0%, rgba(99,0,255,0.08) 100%)`,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          padding: 'clamp(24px, 4vw, 40px)',
          marginBottom: 48,
          textAlign: 'center',
        }}
      >
        <img src="/i99flix-logo.png" alt="i99flix" height={56} style={{ marginBottom: 20 }} />
        <div style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: colors.textSecondary, maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
          i99flix is a personal streaming platform built for movie lovers who want a clean,
          fast, and distraction-free way to discover and watch content.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
        <StatCard icon={<PlayCircleOutlined />} value="10K+" label="Movies & Shows" />
        <StatCard icon={<TeamOutlined />} value="Free" label="Always" />
      </div>

      <Section title="What is i99flix?">
        <P>
          i99flix is a personal, non-commercial streaming platform that aggregates publicly
          available movie and TV show data from The Movie Database (TMDB) and provides
          embedded playback through third-party video sources.
        </P>
        <P>
          The platform is built as a personal project to demonstrate modern full-stack
          development — React, TypeScript, Fastify, MongoDB, and Firebase — and is not
          intended for commercial use or redistribution.
        </P>
      </Section>

      <Section title="What we offer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 8 }}>
          {[
            { icon: '🎬', title: 'Vast Library', desc: 'Thousands of movies and TV shows across every genre.' },
            { icon: '🔍', title: 'Smart Discovery', desc: 'Browse trending, top-rated, and upcoming titles.' },
            { icon: '🔐', title: 'Secure Accounts', desc: 'Email/password and social sign-in with JWT sessions.' },
            { icon: '🌙', title: 'Dark & Light', desc: 'Full dark and light theme support.' },
            { icon: '📱', title: 'Responsive', desc: 'Works on desktop, tablet, and mobile.' },
            { icon: '⚡', title: 'Fast', desc: 'Built with Vite, React 19, and a lean Fastify API.' },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                backgroundColor: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: '18px 16px',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>{title}</div>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>{desc}</Text>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Technology">
        <P>
          i99flix is built with a modern open-source stack:
        </P>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {['React 19', 'TypeScript', 'Vite', 'Ant Design', 'Fastify', 'MongoDB', 'Firebase', 'TanStack Query', 'Zustand', 'TMDB API'].map((tech) => (
            <span
              key={tech}
              style={{
                backgroundColor: 'rgba(229,9,20,0.1)',
                border: '1px solid rgba(229,9,20,0.25)',
                color: darkColors.accent,
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Disclaimer">
        <P>
          i99flix does not host, store, or distribute any video content. All media is
          streamed from third-party embed providers. Movie metadata and images are sourced
          from TMDB under their terms of use. This platform is a personal, non-commercial
          project.
        </P>
        <P>
          All trademarks, service marks, and trade names referenced on this site are the
          property of their respective owners.
        </P>
      </Section>

      <Section title="Contact">
        <P>
          For questions, feedback, or takedown requests, reach out at{' '}
          <a href="mailto:kjedumapit@gmail.com" style={{ color: darkColors.accent }}>
            kjedumapit@gmail.com
          </a>
          .
        </P>
      </Section>
    </LegalLayout>
  );
}
