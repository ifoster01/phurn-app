import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const primaryColor = '#EA3A00';

const commonColors = {
  primary: primaryColor,
  onPrimary: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  placeholder: '#666666',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  error: '#B00020',
  notification: primaryColor,
  surfaceDisabled: '#CCCCCC',
  onSurfaceDisabled: '#666666',
  elevation: {
    level0: '#FFFFFF',
    level1: '#FFFFFF',
    level2: '#FFFFFF',
    level3: '#FFFFFF',
    level4: '#FFFFFF',
    level5: '#FFFFFF',
  }
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...commonColors,
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...commonColors,
  },
};

export { lightTheme, darkTheme };