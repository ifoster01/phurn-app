import React, { useState } from 'react';
import { StyleSheet, View, Image, Pressable, Dimensions } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useAuth } from '@/providers/AuthProvider';
import { AuthPromptModal } from '@/components/auth/AuthPromptModal';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ProductCardProps {
  title: string;
  brand: string;
  price: number;
  regPrice: number;
  image: string;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export function ProductCard({
  title,
  brand,
  price,
  regPrice,
  image,
  isFavorite,
  onPress,
  onFavoritePress,
}: ProductCardProps) {
  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const hasDiscount = price < regPrice;

  const handleFavoritePress = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    onFavoritePress();
  };

  return (
    <>
      <Animated.View 
        entering={FadeIn.duration(400)}
        style={styles.container}
      >
        <Pressable onPress={onPress} style={styles.pressable}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <IconButton
              icon={isFavorite ? 'heart' : 'heart-outline'}
              iconColor={isFavorite ? '#EA3A00' : '#666666'}
              size={24}
              onPress={handleFavoritePress}
              style={styles.favoriteButton}
            />
          </View>
          <View style={styles.content}>
            <Text numberOfLines={1} style={styles.brand}>{brand}</Text>
            <Text numberOfLines={2} style={styles.title}>{title.replace('\\', '"')}</Text>
            <View style={styles.priceContainer}>
              <Text style={{
                ...styles.price,
                color: hasDiscount ? '#EA3A00' : '#1B1B1B',
              }}>{price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
              {hasDiscount && (
                <Text style={styles.regPrice}>${regPrice}</Text>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>

      <AuthPromptModal
        visible={showAuthPrompt}
        onDismiss={() => setShowAuthPrompt(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  pressable: {
    flex: 1,
  },
  imageContainer: {
    aspectRatio: 1,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 4,
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    color: '#1B1B1B',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B1B1B',
  },
  regPrice: {
    fontSize: 12,
    color: '#666666',
    textDecorationLine: 'line-through',
  },
});