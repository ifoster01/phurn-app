import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { WishListsScreen } from '@/screens/WishListsScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { WishListDetailScreen } from '@/screens/WishListDetailScreen';
import { WishlistProductScreen } from '@/screens/WishlistProductScreen';
import { RootStackParamList } from './types';
import { useAuth } from '@/providers/AuthProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Tabs" 
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
      
      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen 
          name="WishListDetail" 
          component={WishListDetailScreen}
          options={{
            headerShown: false,
            title: 'Wish List',
            presentation: 'card',
          }}
        />
        <Stack.Screen 
          name="WishlistProduct" 
          component={WishlistProductScreen}
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}