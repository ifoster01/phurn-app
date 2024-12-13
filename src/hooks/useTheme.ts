import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export function useTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
}