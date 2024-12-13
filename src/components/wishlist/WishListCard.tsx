import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { WishList } from '@/types/wishlist';

interface Props {
  wishList: WishList;
  onPress: () => void;
}

export function WishListCard({ wishList, onPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{wishList.name}</Text>
          <Text style={styles.count}>({wishList.itemCount})</Text>
        </View>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.viewList}>View List</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity onPress={onPress}>
        <View style={styles.thumbnails}>
          {wishList.thumbnails.map((thumbnail, index) => (
            <Image
              key={index}
              source={{ uri: thumbnail }}
              style={styles.thumbnail}
            />
          ))}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  count: {
    fontSize: 16,
    color: '#666',
  },
  viewList: {
    fontSize: 16,
    color: '#E85D3F',
  },
  thumbnails: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  editButton: {
    marginTop: 8,
  },
  editText: {
    fontSize: 16,
    color: '#666',
  },
});