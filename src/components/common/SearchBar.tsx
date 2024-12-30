import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Keyboard, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface SearchBarProps {
  onSearch?: (query: string) => void;
  initialValue?: string;
}

export function SearchBar({ onSearch, initialValue }: SearchBarProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState(initialValue ?? '');
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();

  const handleSearch = useCallback((): void => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    
    Keyboard.dismiss();
    
    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      // If we're already on the ProductList screen, just update the params
      if (route.name === 'ProductList') {
        navigation.setParams({ searchQuery: trimmedQuery });
      } else {
        // If we're on any other screen, navigate to ProductList with the search query
        navigation.navigate('ProductList', { searchQuery: trimmedQuery });
      }
    }
  }, [searchQuery, route.name, navigation, onSearch]);

  const handleClear = useCallback((): void => {
    setSearchQuery('');
    if (route.name === 'ProductList') {
      navigation.setParams({ searchQuery: undefined });
    }
    if (onSearch) {
      onSearch('');
    }
  }, [route.name, navigation, onSearch]);

  return (
    <Pressable style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#666666"
          style={styles.icon} 
        />
        <TextInput
          placeholder="Search products"
          placeholderTextColor="#666666"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          clearButtonMode="never"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            onPress={handleClear}
            style={styles.clearButton}
            iconColor="#666666"
            theme={{ colors: { onSurfaceVariant: '#666666' } }}
          />
        )}
        {searchQuery.length > 0 && (
          <IconButton
            icon="magnify"
            size={24}
            onPress={handleSearch}
            style={styles.searchButton}
            iconColor="#EA3A00"
            theme={{ colors: { onSurfaceVariant: '#EA3A00' } }}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#F5F5F5',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingVertical: 8,
    color: '#000000',
  },
  clearButton: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  searchButton: {
    margin: 0,
    marginLeft: -8,
    padding: 0,
    backgroundColor: 'transparent',
  },
});