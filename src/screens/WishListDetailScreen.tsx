import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { ProductCard } from '@/components/product/ProductCard';
import { useWishlists } from '@/hooks/api/useWishlists';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { AddToWishlistDrawer } from '@/components/wishlist/AddToWishlistDrawer';

type Props = NativeStackScreenProps<RootStackParamList, 'WishListDetail'>;

export function WishListDetailScreen({ navigation, route }: Props) {
  const { wishlistId } = route.params;
  const { user } = useAuth();
  const { data: wishlistData, isLoading, isError } = useWishlists();
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);

  const wishlist = wishlistData?.groupedItems[wishlistId];

  const handleFavoritePress = (furnitureId: string) => {
    if (!user) {
      navigation.navigate('Tabs', { screen: 'Profile' });
      return;
    }
    setSelectedFurnitureId(furnitureId);
  };

  const isInWishlist = (furnitureId: string): boolean => {
    if (!user || !wishlistData?.groupedItems) return false;
    
    // Check if the furniture exists in any wishlist
    return Object.values(wishlistData.groupedItems).some(wishlist => 
      wishlist.items.some(item => item.furniture_id === furnitureId)
    );
  };

  if (isLoading) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#E85D3F" />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (isError || !wishlist) {
    return (
      <SafeAreaWrapper>
        <View style={[styles.container, styles.centerContent]}>
          <Text>Failed to load wishlist</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <Appbar.Header style={{ marginTop: -44 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={wishlist.name} />
      </Appbar.Header>

      <FlatList
        data={wishlist.items}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            title={item.furniture.name || ''}
            brand={item.furniture.brand || ''}
            price={item.furniture.current_price || 0}
            image={item.furniture.img_src_url || ''}
            isFavorite={isInWishlist(item.furniture_id)}
            regPrice={item.furniture.regular_price || 0}
            onPress={() => {}}
            onFavoritePress={() => handleFavoritePress(item.furniture_id)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in this wishlist yet</Text>
          </View>
        )}
      />

      <AddToWishlistDrawer
        visible={!!selectedFurnitureId}
        onDismiss={() => setSelectedFurnitureId(null)}
        furnitureId={selectedFurnitureId || ''}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    gap: 16,
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
}); 