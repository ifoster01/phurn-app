import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/HomeScreen';
import { CategoryListScreen } from '@/screens/CategoryListScreen';
import { ProductListScreen } from '@/screens/ProductListScreen';

const Stack = createNativeStackNavigator();

export function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
    </Stack.Navigator>
  );
}