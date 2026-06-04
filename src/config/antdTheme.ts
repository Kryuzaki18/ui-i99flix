import { theme } from 'antd';
import type { ThemeConfig } from 'antd';
import type { ThemeColors } from '../constants/theme';

export function buildAntdTheme(isDark: boolean, colors: ThemeColors): ThemeConfig {
  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: colors.accent,
      colorBgBase: colors.bgBase,
      colorTextBase: colors.textPrimary,
      borderRadius: 8,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    components: {
      Layout: {
        bodyBg: colors.bgBase,
        headerBg: 'transparent',
        footerBg: colors.footerBg,
      },
      Menu: isDark
        ? {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(229,9,20,0.15)',
            darkItemSelectedColor: '#fff',
          }
        : {
            itemSelectedBg: 'rgba(229,9,20,0.08)',
            itemSelectedColor: colors.accent,
          },
      Input: {
        colorBgContainer: colors.inputBg,
        colorBorder: colors.border,
        colorText: colors.textPrimary,
        colorTextPlaceholder: colors.textMuted,
      },
      Select: {
        colorBgContainer: colors.inputBg,
        colorBorder: colors.border,
        colorText: colors.textPrimary,
      },
      Drawer: { colorBgElevated: colors.bgBase },
      Modal: { contentBg: colors.bgBase, headerBg: colors.bgBase },
      Card: { colorBgContainer: colors.bgCard },
      Slider: {
        colorPrimaryBorder: colors.accent,
        colorPrimary: colors.accent,
      },
    },
  };
}
