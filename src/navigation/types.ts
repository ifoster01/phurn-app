import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp, CompositeScreenProps } from '@react-navigation/native';
import type { Furniture } from '@/hooks/api/useFurniture';
import { ImageSourcePropType } from 'react-native';

export type TabParamList = {
  Home: {
    screen?: keyof HomeStackParamList;
    params?: {
      furniture?: Furniture;
    };
  };
  Profile: undefined;
  Wishlists: {
    screen?: 'Product';
    params?: {
      furniture?: Furniture;
    };
  };
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: {
    screen?: keyof TabParamList;
    params?: {
      screen?: keyof HomeStackParamList;
      params?: {
        furniture?: Furniture;
      };
    };
  };
  WishListDetail: {
    wishlistId: string;
  };
  WishlistProduct: {
    furniture: Furniture;
  };
  ProductList: {
    category: string;
    subcategory?: string;
  };
  Signup: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeStackParamList = {
  HomeScreen: undefined;
  CategoryList: { category: string; subcategory?: string, image?: ImageSourcePropType, title?: string };
  ProductList: { category?: string; subcategory?: string; searchQuery?: string };
  RoomList: undefined;
  Product: { furniture: Furniture };
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

export type TabNavigationProps<T extends keyof TabParamList> = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, T>,
    NativeStackNavigationProp<RootStackParamList>
  >;
  route: RouteProp<TabParamList, T>;
};

// Type for the auth store state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

// Type for the user
export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  fullName?: string;
  createdAt: string;
}