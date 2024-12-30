import React, { useCallback, useState } from 'react';
import { View, ScrollView, StyleSheet, Linking, Platform, Dimensions, Share } from 'react-native';
import { Button, Text, useTheme, IconButton, Surface } from 'react-native-paper';
import { SafeAreaWrapper } from '@/components/layout/SafeAreaWrapper';
import { Image } from 'expo-image';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useWishlists } from '@/hooks/api/useWishlists';
import { AddToWishlistDrawer } from '@/components/wishlist/AddToWishlistDrawer';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { AuthPromptModal } from '@/components/auth/AuthPromptModal';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'WishlistProduct'>;

export function WishlistProductScreen({ navigation, route }: Props): React.JSX.Element {
  const { furniture } = route.params;
  const theme = useTheme();
  const { user } = useAuth();
  const { data: wishlistData } = useWishlists();
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(() => {
    if (!user || !wishlistData?.groupedItems) return false;
    return Object.values(wishlistData.groupedItems).some(wishlist => 
      wishlist.items.some(item => item.furniture_id === furniture.id)
    );
  });

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleShare = useCallback(async () => {
    const url = furniture.navigate_url;
    try {
      await Share.share({
        message: `Check out this product: ${furniture.name}\n${url}`,
        url: url ?? undefined,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [furniture.name, furniture.navigate_url]);

  const handleToggleFavorite = useCallback(() => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowWishlistDrawer(true);
  }, [user]);

  const handleBuyNow = useCallback(async () => {
    const url = furniture.navigate_url;
    if (!url) return;
    
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Linking.openURL(url);
    }
  }, [furniture.navigate_url]);

  const discountPercentage = furniture.regular_price && furniture.current_price
    ? Math.round((1 - furniture.current_price / furniture.regular_price) * 100)
    : 0;

  const pattern = /<a [^>]*>(.*?)<\/a>/g;
  const cleanDescription = furniture.description?.replace(pattern, '$1');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header Buttons */}
      <View style={styles.headerButtons}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={24}
          onPress={handleBack}
          style={styles.headerButton}
        />
        <View style={styles.headerRightButtons}>
          <IconButton
            icon="share-variant"
            iconColor="white"
            size={24}
            onPress={handleShare}
            style={styles.headerButton}
          />
          <IconButton
            icon={isInWishlist ? 'heart' : 'heart-outline'}
            iconColor={isInWishlist ? theme.colors.error : 'white'}
            size={24}
            onPress={handleToggleFavorite}
            style={styles.headerButton}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: furniture.img_src_url }}
          style={styles.image}
          contentFit="cover"
        />

        <Surface style={styles.infoContainer} elevation={0}>
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text style={styles.brand}>{furniture.brand}</Text>
            <Text style={styles.title}>{furniture.name}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={{
                ...styles.price,
                color: furniture.current_price && furniture.current_price < (furniture.regular_price ?? 0) ? '#EF5350' : theme.colors.onSurface,
              }}>
                {furniture.current_price?.toLocaleString("en-US", {currency: "USD", style: "currency"})}
              </Text>
              {furniture.current_price && furniture.current_price < (furniture.regular_price ?? 0) && furniture.regular_price && (
                <Text style={styles.regPrice}>
                  ${furniture.regular_price}
                </Text>
              )}
              {discountPercentage > 0 && (
                <View style={[styles.discountBadge, { backgroundColor: '#EF5350' }]}>
                  <Text style={styles.discountText}>-{discountPercentage}%</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {furniture.description && (
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={styles.descriptionContainer}
            >
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>{cleanDescription}</Text>
            </Animated.View>
          )}
        </Surface>
      </ScrollView>

      <Animated.View
        entering={FadeInRight.delay(600).springify()}
        style={styles.bottomButton}
      >
        <Button
          mode="contained"
          onPress={handleBuyNow}
          style={styles.buyButton}
          contentStyle={styles.buyButtonContent}
        >
          View on {furniture.brand}
        </Button>
      </Animated.View>

      <AddToWishlistDrawer
        visible={showWishlistDrawer}
        onDismiss={() => setShowWishlistDrawer(false)}
        furnitureId={furniture.id}
      />

      <AuthPromptModal
        visible={showAuthPrompt}
        onDismiss={() => setShowAuthPrompt(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerRightButtons: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: width,
    height: width,
  },
  infoContainer: {
    marginTop: -24,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  brand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  regPrice: {
    fontSize: 18,
    color: '#666',
    marginLeft: 8,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1B1B1B',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
  },
  buyButton: {
    borderRadius: 12,
  },
  buyButtonContent: {
    paddingVertical: 8,
  },
}); 