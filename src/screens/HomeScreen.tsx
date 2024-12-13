import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryCard } from '@/components/home/CategoryCard';
import { NavigationProps } from '@/navigation/types';

type Props = NavigationProps<'Home'>;

const categories = [
  { id: 'new', title: 'New', image: 'https://example.com/new.jpg' },
  { id: 'deals', title: 'Best Deals', image: 'https://example.com/deals.jpg' },
  { id: 'type', title: 'Shop By Type', image: 'https://example.com/type.jpg' },
  { id: 'room', title: 'Shop By Room', image: 'https://example.com/room.jpg' },
];

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaWrapper>
      <SearchBar />
      <ScrollView style={styles.container}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            image={category.image}
            onPress={() => navigation.navigate('CategoryList', { category: category.id })}
          />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});