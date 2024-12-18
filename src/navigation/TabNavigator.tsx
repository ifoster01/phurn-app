import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeNavigator } from './HomeNavigator';
import { WishListsScreen } from '@/screens/WishListsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const getTabIcon = (routeName: keyof TabParamList, focused: boolean): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Wishlists':
      return focused ? 'heart' : 'heart-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    case 'Settings':
      return focused ? 'settings' : 'settings-outline';
    default:
      return 'help-outline';
  }
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E85D3F',
        tabBarInactiveTintColor: '#E85D3F',
        headerShown: false,
        tabBarStyle: {
          paddingTop: 12,
          marginBottom: -4,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator} 
        options={{ title: '' }}
      />
      <Tab.Screen 
        name="Wishlists" 
        component={WishListsScreen} 
        options={{ title: '' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: '' }}
      />
    </Tab.Navigator>
  );
}