import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryListItem } from '@/components/category/CategoryListItem';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { CategoryType, RoomType, categories, roomCategories } from '@/constants/categories';

type Props = NativeStackScreenProps<HomeStackParamList, 'CategoryList'>;

export function CategoryListScreen({ navigation, route }: Props) {
  const { category, subcategory } = route.params;

  // If we have a subcategory and it's a room type, show room-specific categories
  const items = subcategory && category === 'room' && isRoomType(subcategory)
    ? roomCategories[subcategory]
    : categories[category as CategoryType] || [];

  const categoryTitle = subcategory 
    ? subcategory.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
    : category[0].toUpperCase() + category.slice(1);

  return (
    <SafeAreaWrapper>
      <Appbar.Header>
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
            onPress={() => navigation.navigate('ProductList', { 
              category,
              subcategory: item.id 
            })}
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