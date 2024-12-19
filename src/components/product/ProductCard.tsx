import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  brand: string;
  price: number;
  image: string;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export function ProductCard({
  title,
  brand,
  price,
  image,
  onPress,
  onFavoritePress,
  isFavorite,
}: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#E85D3F' : '#666'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text style={styles.brand}>{brand}</Text>
        <Text style={styles.title} numberOfLines={2}>{title.replace('\\', '"')}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
  },
  details: {
    paddingTop: 8,
  },
  brand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});