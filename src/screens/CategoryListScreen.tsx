import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryListItem } from '@/components/category/CategoryListItem';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { CategoryType, RoomType, categories, roomCategories } from '@/constants/categories';
import { useProductFilter } from '@/providers/ProductFilterProvider';
import { FurnitureType } from '@/stores/useProductFilterStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'CategoryList'>;

export function CategoryListScreen({ navigation, route }: Props) {
  const { category, subcategory } = route.params;
  const { 
    addRoom,
    addFurnitureType,
    addBrand,
    clearFilters,
    removeFurnitureType,
    selectedFurnitureTypes
  } = useProductFilter();

  // Get the appropriate items based on the navigation type and subcategory
  const items = subcategory && category === 'room' && isRoomType(subcategory)
    ? roomCategories[subcategory]
    : category === 'room'
      ? categories.room
      : category === 'type'
        ? categories.type
        : category === 'brand'
          ? categories.brand
          : [];

  const categoryTitle = subcategory 
    ? subcategory.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    : category[0].toUpperCase() + category.slice(1);

  const handleItemPress = (itemId: string) => {
    clearFilters(); // Clear existing filters

    if (category === 'room') {
      if (subcategory) {
        // If we're in a room subcategory, add both room and furniture type filters
        addRoom(subcategory as RoomType);
        if (itemId === 'all-furniture') {
          for (const furnitureType of selectedFurnitureTypes) {
            removeFurnitureType(furnitureType as FurnitureType);
          }
        } else {
          addFurnitureType(itemId as FurnitureType);
        }
        navigation.navigate('ProductList', { 
          category: 'room',
          subcategory: itemId 
        });
      } else {
        // If we're in the main room category, navigate to room-specific list
        const roomItem = items.find(item => item.id === itemId);
        if (roomItem?.hasSubcategories) {
          navigation.navigate('CategoryList', { 
            category: 'room',
            subcategory: itemId 
          });
        } else {
          addRoom(itemId as RoomType);
          navigation.navigate('ProductList', { 
            category: 'room',
            subcategory: itemId 
          });
        }
      }
    } else {
      if (categories['brand'].some(item => item.id === itemId)) {
        addBrand(itemId);
      } else {
        // For other categories, just add the furniture type or brand
        if (itemId === 'shop all furniture') {
          for (const furnitureType of selectedFurnitureTypes) {
            removeFurnitureType(furnitureType as FurnitureType);
          }
        } else {
          addFurnitureType(itemId as FurnitureType);
        }
      }
      navigation.navigate('ProductList', { 
        category,
        subcategory: itemId 
      });
    }
  };

  return (
    <SafeAreaWrapper>
      <Appbar.Header style={{ marginTop: -44 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Shop By ${categoryTitle}`} />
      </Appbar.Header>
      <SearchBar />
      <ScrollView style={styles.container}>
        {items.map((item) => (
          <CategoryListItem
            key={item.id}
            title={item.title}
            hasSubcategories={item.hasSubcategories}
            onPress={handleItemPress}
          />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

// Type guard to check if a string is a valid RoomType
function isRoomType(value: string): value is RoomType {
  return ['living-room', 'bedroom', 'dining-room', 'office'].includes(value);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});