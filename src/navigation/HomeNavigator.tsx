import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/HomeScreen';
import { CategoryListScreen } from '@/screens/CategoryListScreen';
import { ProductListScreen } from '@/screens/ProductListScreen';
import { ProductScreen } from '@/screens/ProductScreen';
import type { HomeStackParamList } from './types';
import { RoomListScreen } from '@/screens/RoomListScreen';
import { useProductFilterStore } from '@/stores/useProductFilterStore';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeNavigator() {
  const { clearAll } = useProductFilterStore();

  return (
    <Stack.Navigator 
      initialRouteName="HomeScreen"
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{
          title: 'Home'
        }}
        listeners={{
          focus: () => clearAll()
        }}
      />
      <Stack.Screen 
        name="CategoryList" 
        component={CategoryListScreen}
        options={{
          title: 'Categories'
        }}
      />
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{
          title: 'Products'
        }}
      />
      <Stack.Screen 
        name="RoomList" 
        component={RoomListScreen}
        options={{
          title: 'Room List'
        }}
      />
      <Stack.Screen 
        name="Product" 
        component={ProductScreen}
        options={{
          title: 'Product Details'
        }}
      />
    </Stack.Navigator>
  );
}