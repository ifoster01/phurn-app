import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeNavigator } from './HomeNavigator';
import { WishListsScreen } from '@/screens/WishListsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { TabParamList } from './types';
import PhurnOffColor from '@/assets/logos/phurn-off-color.svg';
import PhurnOutlineOffColor from '@/assets/logos/phurn-outline-off-color.svg';

const Tab = createBottomTabNavigator<TabParamList>();

const getTabIcon = (routeName: keyof TabParamList, focused: boolean) => {
  if (routeName === 'Home') {
    const Icon = focused ? PhurnOffColor : PhurnOutlineOffColor;
    return <Icon width={24} height={24} />;
  }

  // For other tabs, use Ionicons
  let iconName: keyof typeof Ionicons.glyphMap;
  switch (routeName) {
    case 'Wishlists':
      iconName = focused ? 'heart' : 'heart-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'help-outline';
  }
  return <Ionicons name={iconName} size={24} color="#E85D3F" />;
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
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