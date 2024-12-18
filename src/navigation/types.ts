import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Tabs: { screen?: keyof TabParamList; params?: any };
  WishListDetail: { id: string };
  Signup: undefined;
};

export type TabParamList = {
  Home: undefined;
  WishLists: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  CategoryList: { category: string; subcategory?: string };
  ProductList: { category: string; subcategory?: string };
  RoomList: undefined;
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