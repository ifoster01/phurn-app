import React from 'react';
import { TouchableOpacity, ImageBackground, Text, StyleSheet, Dimensions } from 'react-native';

interface Props {
  title: string;
  image: string;
  onPress: () => void;
}

export function CategoryCard({ title, image, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageBackground source={{ uri: image }} style={styles.image}>
        <Text style={styles.title}>{title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});