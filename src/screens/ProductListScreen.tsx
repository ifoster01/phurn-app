import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Appbar, IconButton, Text, Button, useTheme, Chip, Icon } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { ProductCard } from '@/components/product/ProductCard';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList, RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useFurniture } from '@/hooks/api/useFurniture';
import { useWishlists } from '@/hooks/api/useWishlists';
import { AddToWishlistDrawer } from '@/components/wishlist/AddToWishlistDrawer';
import { FilterDrawer } from '@/components/filter/FilterDrawer';
import { useProductFilter } from '@/providers/ProductFilterProvider';
import { FILTER_NAMES } from '@/stores/useProductFilterStore';
import type { Furniture } from '@/hooks/api/useFurniture';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'ProductList'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: NavigationProp;
  route: NativeStackScreenProps<HomeStackParamList, 'ProductList'>['route'];
};

export function ProductListScreen({ navigation, route }: Props): React.JSX.Element {
  const { category, subcategory, searchQuery } = route.params ?? {};
  const { user } = useAuth();
  const theme = useTheme();
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  
  const showFilterDrawer = useCallback(() => setFilterDrawerVisible(true), []);
  const hideFilterDrawer = useCallback(() => setFilterDrawerVisible(false), []);
  
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
    isRefetching,
    error,
  } = useFurniture({ searchQuery });

  const { data: wishlistData } = useWishlists();

  const getScreenTitle = useCallback((): string => {
    if (searchQuery) {
      return 'Search Results';
    }

    if (filterCategories.length > 0) {
      return filterCategories.map(cat => FILTER_NAMES[cat]).join(' & ');
    }

    if (subcategory) {
      return subcategory.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    return 'Products';
  }, [searchQuery, filterCategories, subcategory]);

  const allItems = data?.pages.flatMap(page => page.items) ?? [];

  const isInWishlist = useCallback((furnitureId: string): boolean => {
    if (!user || !wishlistData?.groupedItems) return false;
    
    return Object.values(wishlistData.groupedItems).some(wishlist => 
      wishlist.items.some(item => item.furniture_id === furnitureId)
    );
  }, [user, wishlistData?.groupedItems]);

  const handleFavoritePress = useCallback((furnitureId: string): void => {
    if (!user) {
      navigation.navigate('Tabs', { screen: 'Profile' });
      return;
    }
    setSelectedFurnitureId(furnitureId);
  }, [user, navigation]);

  const handleClearSearch = useCallback((): void => {
    navigation.setParams({ searchQuery: undefined });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: Furniture }) => (
    <ProductCard
      title={item.name || ''}
      brand={item.brand || ''}
      price={item.current_price || 0}
      regPrice={item.regular_price || 0}
      image={item.img_src_url || ''}
      isFavorite={isInWishlist(item.id)}
      onPress={() => navigation.navigate('Product', { furniture: item })}
      onFavoritePress={() => handleFavoritePress(item.id)}
    />
  ), [isInWishlist, handleFavoritePress, navigation]);

  const renderHeader = () => {
    if (!searchQuery) return null;
    return (
      <View style={styles.searchInfo}>
        <Chip
          icon="magnify"
          closeIcon={() => <Icon source="close" size={16} color="#666666" />}
          onClose={() => navigation.setParams({ searchQuery: undefined })}
          style={styles.searchChip}
          textStyle={{ color: '#666666' }}
        >
          {searchQuery}
        </Chip>
        <Text variant="bodySmall" style={styles.resultCount}>
          {data?.pages[0]?.totalCount ?? 0} results found
        </Text>
      </View>
    );
  };

  const renderFooter = useCallback(() => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.footer}>
        {isFetchingNextPage ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <IconButton
            icon="refresh"
            size={24}
            iconColor={theme.colors.primary}
            onPress={() => fetchNextPage()}
          />
        )}
      </View>
    );
  }, [hasNextPage, isFetchingNextPage, theme.colors.primary, fetchNextPage]);

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
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={getScreenTitle()} />
        <Appbar.Action iconColor='#666666' icon="tune-variant" onPress={showFilterDrawer} />
      </Appbar.Header>
      
      <SearchBar initialValue={searchQuery} />
      
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : allItems.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text variant="titleMedium" style={styles.noResults}>No products found</Text>
          {searchQuery && (
            <Button 
              mode="contained" 
              onPress={handleClearSearch}
              style={styles.clearSearchButton}
            >
              Clear Search
            </Button>
          )}
        </View>
      ) : (
        <FlatList
          data={allItems}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={isRefetching}
          onRefresh={refetch}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#EA3A00']}
              tintColor="#EA3A00"
            />
          }
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
  header: {
    marginTop: -44,
    elevation: 0,
  },
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
  searchInfo: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchChip: {
    backgroundColor: '#F0F0F0',
  },
  resultCount: {
    color: '#666',
  },
  clearSearchButton: {
    marginTop: 16,
  },
  noResults: {
    marginBottom: 8,
    color: '#666',
  },
});