import { createContext, useContext, useState, useEffect } from 'react';
import { darkColors, lightColors } from '../constants/theme';
import type { ThemeColors } from '../constants/theme';

type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  toggle: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  isDark: true,
  toggle: () => {},
  colors: darkColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('99flix-theme');
    return (saved as ThemeMode) ?? 'dark';
  });

  useEffect(() => {
    localStorage.setItem('99flix-theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
    document.body.style.background = mode === 'dark' ? '#0d0d1a' : '#f0f2f5';
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark: mode === 'dark',
        toggle,
        colors: mode === 'dark' ? darkColors : lightColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
