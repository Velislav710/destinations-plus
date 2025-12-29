// constants/theme.ts
type ColorSchemeName = 'light' | 'dark' | null;

export const lightColors = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  primary: '#2563EB',
  secondary: '#16A34A',
  highlight: '#F59E0B',
};

export const darkColors = {
  background: '#0F172A',
  card: '#020617',
  text: '#E5E7EB',
  primary: '#2563EB',
  secondary: '#16A34A',
  highlight: '#F59E0B',
};

// hook за избор на тема
export const useTheme = (colorScheme: ColorSchemeName) => {
  return colorScheme === 'dark' ? darkColors : lightColors;
};
