import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { ProductCard } from '@/components/product/ProductCard';
import { NavigationProps } from '@/navigation/types';

type Props = NavigationProps<'ProductList'>;

// Mock data - replace with actual API call
const products = [
  {
    id: '1',
    title: 'Lorraine Marble Coffee Table 36"',
    brand: 'West Elm',
    price: 899,
    image: 'https://example.com/table1.jpg',
  },
  {
    id: '2',
    title: 'Scatola Rectangular Brown Burl Wood Coffee Table',
    brand: 'CB2',
    price: 1299,
    image: 'https://example.com/table2.jpg',
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

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  return (
    <SafeAreaWrapper>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Coffee Tables" />
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