import React from 'react';
import { ScrollView, StyleSheet, ImageSourcePropType } from 'react-native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryCard } from '@/components/home/CategoryCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

interface Category {
  id: string;
  title: string;
  image: ImageSourcePropType;
}

const categories: Category[] = [
  { 
    id: 'new', 
    title: 'New',
    image: require('@/assets/images/categories/new-image.png')
  },
  { 
    id: 'deals', 
    title: 'Best Deals', 
    image: require('@/assets/images/categories/best-deals.jpeg')
  },
  { 
    id: 'type', 
    title: 'Shop By Type', 
    image: require('@/assets/images/categories/shop-by-type.jpeg')
  },
  { 
    id: 'room', 
    title: 'Shop By Room', 
    image: require('@/assets/images/categories/shop-by-room.png')
  },
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
            onPress={() => 
              navigation.navigate('CategoryList', { 
                category: category.id 
              })
            }
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