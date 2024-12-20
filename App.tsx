import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from '@/hooks/useTheme';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { env } from '@/config/env';
import { AuthProvider } from '@/providers/AuthProvider';
import { FilterProvider } from '@/providers/FilterProvider';
import { ProductFilterProvider } from '@/providers/ProductFilterProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

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
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ProductFilterProvider>
              <FilterProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </FilterProvider>
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