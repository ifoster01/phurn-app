import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeNavigator } from './HomeNavigator';
import { WishListsScreen } from '@/screens/WishListsScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'WishLists') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

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
        name="WishLists" 
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