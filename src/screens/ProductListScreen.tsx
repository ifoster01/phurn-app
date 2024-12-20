import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, IconButton, Text } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { ProductCard } from '@/components/product/ProductCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useFurniture } from '@/hooks/api/useFurniture';
import { useWishlists, WishlistItem } from '@/hooks/api/useWishlists';
import { AddToWishlistDrawer } from '@/components/wishlist/AddToWishlistDrawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { categories, roomCategories } from '@/constants/categories';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'ProductList'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: NavigationProp;
  route: NativeStackScreenProps<HomeStackParamList, 'ProductList'>['route'];
};

export function ProductListScreen({ navigation, route }: Props) {
  const { category, subcategory } = route.params;
  const { user } = useAuth();
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  
  const { 
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    refetchWithReset,
    isRefetching,
    error,
  } = useFurniture();
  
  const { data: wishlistData } = useWishlists();

  // Flatten all pages of items into a single array
  const allItems = data?.pages.flatMap(page => page.items) ?? [];

  const isInWishlist = (furnitureId: string): boolean => {
    if (!user || !wishlistData?.groupedItems) return false;
    
    // Check if the furniture exists in any wishlist
    return Object.values(wishlistData.groupedItems).some(wishlist => 
      wishlist.items.some((item: WishlistItem) => item.furniture_id === furnitureId)
    );
  };

  const handleFavoritePress = (furnitureId: string) => {
    if (!user) {
      navigation.navigate('Tabs', { screen: 'Profile' });
      return;
    }
    setSelectedFurnitureId(furnitureId);
  };

  const renderFooter = () => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.footer}>
        {isFetchingNextPage ? (
          <ActivityIndicator size="large" color="#E85D3F" />
        ) : (
          <IconButton
            icon="refresh"
            size={24}
            iconColor="#E85D3F"
            onPress={() => fetchNextPage()}
          />
        )}
      </View>
    );
  };

  if (error) {
    return (
      <SafeAreaWrapper>
        <View style={styles.centerContainer}>
          <Text>Error loading products. Please try again.</Text>
          <IconButton onPress={() => refetch()} icon="refresh" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={subcategory ? `${subcategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : 'New Products'} />
        <Appbar.Action icon="tune" onPress={() => {}} />
      </Appbar.Header>
      <SearchBar />
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E85D3F" />
        </View>
      ) : (
        <FlatList
          data={allItems}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              title={item.name || ''}
              brand={item.brand || ''}
              price={item.current_price || 0}
              regPrice={item.regular_price || 0}
              image={item.img_src_url || ''}
              isFavorite={isInWishlist(item.id)}
              onPress={() => {}}
              onFavoritePress={() => handleFavoritePress(item.id)}
            />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={isRefetching}
          onRefresh={() => refetchWithReset()}
        />
      )}

      <AddToWishlistDrawer
        visible={!!selectedFurnitureId}
        onDismiss={() => setSelectedFurnitureId(null)}
        furnitureId={selectedFurnitureId || ''}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    padding: 8,
    alignItems: 'center',
  },
  listContent: {
    padding: 8,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    padding: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});