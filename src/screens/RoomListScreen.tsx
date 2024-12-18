import React from 'react';
import { ScrollView, StyleSheet, ImageSourcePropType } from 'react-native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryCard } from '@/components/home/CategoryCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { Appbar } from 'react-native-paper';

type Props = NativeStackScreenProps<HomeStackParamList, 'RoomList'>;

interface Category {
  id: string;
  title: string;
  image: ImageSourcePropType;
}

const roomCategories: Category[] = [
  { 
    id: 'living-room', 
    title: 'Living Room',
    image: require('@/assets/images/categories/shop-by-room.png')
  },
  { 
    id: 'bedroom', 
    title: 'Bedroom', 
    image: require('@/assets/images/categories/bedroom-img.png')
  },
  { 
    id: 'dining-room', 
    title: 'Dining & Kitchen', 
    image: require('@/assets/images/categories/dining-img.png')
  },
  { 
    id: 'office',
    title: 'Home Office', 
    image: require('@/assets/images/categories/office-img.png')
  },
];

export function RoomListScreen({ navigation }: Props) {
  return (
    <SafeAreaWrapper>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Shop By Room" />
      </Appbar.Header>
      <SearchBar />
      <ScrollView style={styles.container}>
        {roomCategories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            image={category.image}
            onPress={() => 
              navigation.navigate('CategoryList', {
                category: 'room',
                subcategory: category.id
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