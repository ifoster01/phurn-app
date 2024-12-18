import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { WishListsScreen } from '@/screens/WishListsScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
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
      
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      
      {user && (
        <Stack.Screen 
          name="WishListDetail" 
          component={WishListsScreen}
          options={{
            headerShown: true,
            title: 'Wish List',
            presentation: 'card',
          }}
        />
      )}
    </Stack.Navigator>
  );
}