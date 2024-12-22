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
import { FilterDrawer } from '@/components/filter/FilterDrawer';
import { useProductFilter } from '@/providers/ProductFilterProvider';
import { FILTER_NAMES } from '@/stores/useProductFilterStore';

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
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const showFilterDrawer = () => setFilterDrawerVisible(true);
  const hideFilterDrawer = () => setFilterDrawerVisible(false);
  
  const {
    filterCategories,
  } = useProductFilter();

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

  // Get the screen title based on current state
  const getScreenTitle = () => {
    // First check filter categories
    if (filterCategories.length > 0) {
      return filterCategories.map(cat => FILTER_NAMES[cat as keyof typeof FILTER_NAMES]).join(' & ');
    }

    // Then check navigation state
    if (subcategory) {
      return subcategory.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    return 'Products';
  };

  // Flatten all pages of items into a single array
  const allItems = data?.pages.flatMap(page => page.items) ?? [];

  const isInWishlist = (furnitureId: string): boolean => {
    if (!user || !wishlistData?.groupedItems) return false;
    
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
      <Appbar.Header style={{ marginTop: -44 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={getScreenTitle()} />
        <Appbar.Action icon="tune-variant" onPress={showFilterDrawer} />
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

      <FilterDrawer
        visible={filterDrawerVisible}
        onDismiss={hideFilterDrawer}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    padding: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});