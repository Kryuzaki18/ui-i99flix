import { useState, useEffect } from 'react';
import { darkColors } from '../../constants/theme';

const FADE_DURATION = 350;

interface AppSplashProps {
  visible: boolean;
  slowStart?: boolean;
}

export default function AppSplash({ visible, slowStart = false }: AppSplashProps) {
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
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        backgroundColor: '#0d0d1a',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_DURATION}ms ease`,
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <img src="/i99flix-logo.png" alt="i99flix logo" width={200} />
      <div
        style={{
          width: 180,
          height: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '40%',
            backgroundColor: darkColors.accent,
            borderRadius: 2,
            animation: 'splashBar 1.4s ease-in-out infinite',
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
        <div
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 13,
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          Server is waking up, please wait…
        </div>
      )}
    </div>
  );
}
