import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
  Tabs: undefined;
  WishListDetail: { id: string };
};

export type TabParamList = {
  HomeTab: undefined;
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