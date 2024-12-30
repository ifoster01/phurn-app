import React from 'react';
import { ScrollView, StyleSheet, ImageSourcePropType, Text } from 'react-native';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryCard } from '@/components/home/CategoryCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import PhurnLogo from '@/assets/logos/phurn.svg';
import { useProductFilter } from '@/providers/ProductFilterProvider';
import { FilterCategory, NavigationType } from '@/stores/useProductFilterStore';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

interface Category {
  id: string;
  title: string;
  image: ImageSourcePropType;
  type: 'navigation' | 'filter';
}

const categories: Category[] = [
  { 
    id: 'new', 
    title: 'New',
    image: require('@/assets/images/categories/new-image.jpg'),
    type: 'filter'
  },
  { 
    id: 'deals', 
    title: 'Best Deals', 
    image: require('@/assets/images/categories/best-deals.jpg'),
    type: 'filter'
  },
  { 
    id: 'type', 
    title: 'Shop By Type', 
    image: require('@/assets/images/categories/shop-by-type.jpg'),
    type: 'navigation'
  },
  { 
    id: 'room', 
    title: 'Shop By Room', 
    image: require('@/assets/images/categories/shop-by-room.jpg'),
    type: 'navigation'
  },
  { 
    id: 'brand',
    title: 'Shop By Brand', 
    image: require('@/assets/images/categories/brand-img.jpg'),
    type: 'navigation'
  }
];

export function HomeScreen({ navigation }: Props) {
  const { 
    addFilterCategory, 
    removeFilterCategory, 
    setNavigationType,
    clearAll 
  } = useProductFilter();

  const handleCategoryPress = (categoryId: string, type: 'navigation' | 'filter') => {
    clearAll(); // Clear all filters and navigation state
    
    if (type === 'filter') {
      addFilterCategory(categoryId as FilterCategory);
      navigation.navigate('ProductList', {
        category: categoryId
      });
    } else {
      setNavigationType(categoryId as NavigationType);
      if (categoryId === 'room') {
        navigation.navigate('RoomList');
      } else {
        navigation.navigate('CategoryList', {
          category: categoryId,
          image: categories.find(category => category.id === categoryId)?.image,
          title: categories.find(category => category.id === categoryId)?.title || ''
        });
      }
    }
  };

  return (
    <SafeAreaWrapper>
      <Animated.View 
        entering={FadeIn.duration(400)}
        style={styles.header}
      >
        <PhurnLogo width={40} height={40} />
        <Text style={styles.headerText}>
          PHURN
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeIn.delay(100).duration(400)}
      >
        <SearchBar />
      </Animated.View>

      <ScrollView style={styles.container}>
        {categories.map((category, index) => (
          <Animated.View 
            key={category.id}
            entering={FadeInDown.delay(200 + (index * 100)).duration(400)}
          >
            <CategoryCard
              title={category.title}
              image={category.image}
              onPress={() => handleCategoryPress(category.id, category.type)}
            />
          </Animated.View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ea3a00',
    textAlign: 'center',
  },
});