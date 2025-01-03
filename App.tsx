import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from '@/hooks/useTheme';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { env } from '@/config/env';
import { AuthProvider } from '@/providers/AuthProvider';
import { ProductFilterProvider } from '@/providers/ProductFilterProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { SplashScreen } from '@/components/SplashScreen';

const queryClient = new QueryClient()

export default function App() {
  const theme = useTheme()
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: env.google.iosClientId,
      webClientId: env.google.webClientId,
    });
  }, []);

  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ProductFilterProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </ProductFilterProvider>
          </AuthProvider>
        </QueryClientProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});