import React from 'react';
import { ScrollView, StyleSheet, ImageSourcePropType } from 'react-native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryCard } from '@/components/home/CategoryCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { Appbar } from 'react-native-paper';
import { useProductFilter } from '@/providers/ProductFilterProvider';
import { RoomType } from '@/stores/useProductFilterStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'RoomList'>;

interface Category {
  id: RoomType;
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
  const { addRoom, clearFilters } = useProductFilter();

  const handleRoomPress = (roomId: RoomType) => {
    clearFilters(); // Clear existing filters
    addRoom(roomId); // Add the selected room
    navigation.navigate('CategoryList', {
      category: 'room',
      subcategory: roomId
    });
  };

  return (
    <SafeAreaWrapper>
      <Appbar.Header style={{ marginTop: -44 }}>
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
            onPress={() => handleRoomPress(category.id)}
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