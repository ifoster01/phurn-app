import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryListItem } from '@/components/category/CategoryListItem';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'CategoryList'>;

interface Category {
  id: string;
  title: string;
  hasSubcategories?: boolean;
}

const categories: Category[] = [
  { id: 'all', title: 'Shop All Furniture' },
  { id: 'accent', title: 'Accent Furniture', hasSubcategories: true },
  { id: 'beds', title: 'Beds', hasSubcategories: true },
  { id: 'decor', title: 'Decor', hasSubcategories: true },
  { id: 'seating', title: 'Seating', hasSubcategories: true },
  { id: 'storage', title: 'Storage', hasSubcategories: true },
  { id: 'tables', title: 'Tables', hasSubcategories: true },
];

export function CategoryListScreen({ navigation, route }: Props) {
  const { category } = route.params;

  return (
    <SafeAreaWrapper>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Shop By Type" />
      </Appbar.Header>
      <SearchBar />
      <ScrollView style={styles.container}>
        {categories.map((item) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});