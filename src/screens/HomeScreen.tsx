import React from 'react';
import { ScrollView, StyleSheet, ImageSourcePropType, View, Text } from 'react-native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryCard } from '@/components/home/CategoryCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import PhurnLogo from '@/assets/logos/phurn.svg';

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
  { 
    id: 'brand',
    title: 'Shop By Brand', 
    image: require('@/assets/images/categories/brand-img.jpeg')
  },
];

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <PhurnLogo width={40} height={40} fill="#E85D3F" />
        <Text style={styles.headerText}>
          PHURN
        </Text>
      </View>
      <SearchBar />
      <ScrollView style={styles.container}>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            image={category.image}
            onPress={() => {
              if (category.id === 'new') {
                navigation.navigate('ProductList', {
                  category: category.id
                })
              } else if (category.id === 'room') {
                navigation.navigate('RoomList')
              } else {
                navigation.navigate('CategoryList', {
                  category: category.id
                })
              }
            }}
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
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E85D3F',
  },
});