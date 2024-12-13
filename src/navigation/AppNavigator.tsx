import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '@/screens/SplashScreen';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { TabNavigator } from './TabNavigator';
import { WishListsScreen } from '@/screens/WishListsScreen';
import { RootStackParamList } from './types';
import { useAuthStore } from '@/store/auth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen 
            name="WishListDetail" 
            component={WishListsScreen}
            options={{
              headerShown: true,
              title: 'Wish List',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}