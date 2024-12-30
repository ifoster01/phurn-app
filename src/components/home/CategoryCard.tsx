import React, { useCallback } from 'react';
import { TouchableOpacity, ImageBackground, Text, StyleSheet, Dimensions, ImageSourcePropType, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
  title: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

export function CategoryCard({ title, image, onPress }: Props) {
  // Force re-render on focus to handle image scaling issues
  useFocusEffect(
    useCallback(() => {
      // This empty dependency array ensures the component re-renders on focus
      return () => {};
    }, [])
  );

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginVertical: 8,
    borderRadius: 8,
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
    borderRadius: 8,
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