const tintColourLight = '#00897B';
const tintColourDark = '#4DB6AC';

export const Theme = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#5F6368',
    background: '#F8F9FA',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: 'rgba(26, 26, 26, 0.4)',
    accent: tintColourLight,
    warning: '#B00020',
    icon: '#5F6368',
    tabIconDefault: '#9AA0A6',
    tabIconSelected: tintColourLight,
    meanColour: '#EF5350',
    standardDeviationColour: 'rgba(144, 202, 249, 0.3)',
    interventionColour: 'rgba(77, 182, 172, 0.25)',
  },
  dark: {
    text: '#E8EAED',
    textSecondary: '#9AA0A6',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: 'rgba(232, 234, 237, 0.4)',
    accent: tintColourDark,
    warning: '#CF6679',
    icon: '#9AA0A6',
    tabIconDefault: '#9AA0A6',
    tabIconSelected: tintColourDark,
    meanColour: '#FF6E6E',
    standardDeviationColour: 'rgba(100, 181, 246, 0.35)',
    interventionColour: 'rgba(77, 182, 172, 0.3)',
  },
};

export const Fonts = {
    sans: 'Inter',
    serif: 'Inter',
    rounded: 'Inter',
    mono: 'Inter',
};