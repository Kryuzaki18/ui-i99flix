export interface ThemeColors {
  bgBase:         string;
  bgCard:         string;
  bgElevated:     string;
  bgNav:          string;
  border:         string;
  borderSubtle:   string;
  textPrimary:    string;
  textSecondary:  string;
  textMuted:      string;
  accent:         string;
  footerBg:       string;
  inputBg:        string;
  authBg:         string;
  authCard:       string;
  playerControls: string;
  skeletonBg:     string;
}

export const darkColors: ThemeColors = {
  bgBase:         '#0d0d1a',
  bgCard:         '#1a1a2e',
  bgElevated:     '#1a1a2e',
  bgNav:          'rgba(13,13,26,0.92)',
  border:         '#2a2a4a',
  borderSubtle:   'rgba(255,255,255,0.06)',
  textPrimary:    '#ffffff',
  textSecondary:  '#cccccc',
  textMuted:      '#888888',
  accent:         '#e50914',
  footerBg:       '#080810',
  inputBg:        '#0d0d1a',
  authBg:         'linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d0d1a 100%)',
  authCard:       'rgba(26,26,46,0.95)',
  playerControls: '#111111',
  skeletonBg:     '#1a1a2e',
};

export const lightColors: ThemeColors = {
  bgBase:         '#f0f2f5',
  bgCard:         '#ffffff',
  bgElevated:     '#ffffff',
  bgNav:          'rgba(255,255,255,0.92)',
  border:         '#e0e0e8',
  borderSubtle:   'rgba(0,0,0,0.06)',
  textPrimary:    '#111111',
  textSecondary:  '#333333',
  textMuted:      '#666666',
  accent:         '#e50914',
  footerBg:       '#e8eaf0',
  inputBg:        '#ffffff',
  authBg:         'linear-gradient(135deg, #f0f2f5 0%, #e8e0f5 50%, #f0f2f5 100%)',
  authCard:       'rgba(255,255,255,0.97)',
  playerControls: '#1a1a1a',
  skeletonBg:     '#e8eaf0',
};
