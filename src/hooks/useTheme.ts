import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/theme';

export function useTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}