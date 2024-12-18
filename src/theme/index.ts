import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const primaryColor = '#EA3A00';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: primaryColor,
    onPrimary: '#FFFFFF',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: primaryColor,
    onPrimary: '#FFFFFF',
  },
};

export { lightTheme, darkTheme };