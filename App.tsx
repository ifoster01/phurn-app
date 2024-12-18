import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from '@/hooks/useTheme';
import { StatusBar } from 'expo-status-bar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { env } from '@/config/env';
import { AuthProvider } from '@/providers/AuthProvider';

const queryClient = new QueryClient()

export default function App() {
  const theme = useTheme()
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: env.google.iosClientId,
      webClientId: env.google.webClientId,
    });
  }, []);

  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </AuthProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}