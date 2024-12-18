import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { ProductCard } from '@/components/product/ProductCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { useAuth } from '@/hooks/useAuth';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductList'>;

interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  image: string;
}

// Mock data - replace with actual API call
const products: Product[] = [
  {
    id: '1',
    title: 'Lorraine Marble Coffee Table 36"',
    brand: 'West Elm',
    price: 899,
    image: 'https://cb2.scene7.com/is/image/CB2/CevaLtBlueVelvetSofaSHF23/$web_plp_card$/240215085233/ceva-light-blue-performance-velvet-sofa.jpg',
  },
  {
    id: '2',
    title: 'Nadine Shearling Accent Chair with Marble Legs by goop',
    brand: 'CB2',
    price: 1799,
    image: 'https://cb2.scene7.com/is/image/CB2/NadineShrlgAcntChrWMbLgsSHF24/$web_plp_card$/241214084127/NadineShrlgAcntChrWMbLgsSHF24.jpg',
  },
  {
    id: '3',
    title: 'Kareen Coffee Table',
    brand: 'AllModern',
    price: 1549,
    image: 'https://example.com/table3.jpg',
  },
  {
    id: '4',
    title: 'Lenia 46" Storage Coffee Table - Walnut',
    brand: 'Article',
    price: 499,
    image: 'https://example.com/table4.jpg',
  },
];

export function ProductListScreen({ navigation, route }: Props) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { category, subcategory } = route.params;
  const { requireAuth } = useAuth();

  const toggleFavorite = (productId: string) => {
    requireAuth(() => {
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(productId)) {
          newFavorites.delete(productId);
        } else {
          newFavorites.add(productId);
        }
        return newFavorites;
      });
    }, 'Please sign in to save items to your wishlist');
  };

  return (
    <SafeAreaWrapper>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={subcategory ? `${subcategory} Tables` : 'Products'} />
        <Appbar.Action icon="tune" onPress={() => {}} />
      </Appbar.Header>
      <SearchBar />
      <FlatList
        data={products}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            title={item.title}
            brand={item.brand}
            price={item.price}
            image={item.image}
            isFavorite={favorites.has(item.id)}
            onPress={() => {}}
            onFavoritePress={() => toggleFavorite(item.id)}
          />
        )}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});