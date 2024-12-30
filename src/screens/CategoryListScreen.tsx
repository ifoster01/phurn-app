import React from 'react';
import { View, ScrollView, StyleSheet, ImageBackground, Text } from 'react-native';
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
  const { category, subcategory, image, title } = route.params;
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
        if (itemId === 'all furniture') {
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
          if (itemId === 'all seating') {
            addFurnitureType('seating')
          } else if (itemId === 'all tables') {
            addFurnitureType('tables')
          } else if (itemId === 'all storage') {
            addFurnitureType('storage')
          } else {
            addFurnitureType(itemId as FurnitureType);
          }
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
        <Appbar.BackAction color="#1B1B1B" onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={ category === 'room' ? `${categoryTitle}` : `Shop By ${categoryTitle}`}
          titleStyle={{ color: '#1B1B1B' }}
        />
      </Appbar.Header>
      <SearchBar />
      <ScrollView style={styles.container}>
        { image && <View style={styles.outerImageContainer}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={image}
              style={styles.image}
              imageStyle={styles.backgroundImage}
              resizeMode="cover"
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>
            </ImageBackground>
          </View>
        </View> }
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
  return ['living-room', 'bedroom', 'dining-room', 'office', 'outdoor'].includes(value);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  outerImageContainer: {
    height: 200,
    marginVertical: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});