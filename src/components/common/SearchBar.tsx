import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Keyboard, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton, useTheme } from 'react-native-paper';
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
  const theme = useTheme();

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
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={theme.colors.onSurfaceVariant} 
          style={styles.icon} 
        />
        <TextInput
          placeholder="Search products"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          style={[styles.input, { color: theme.colors.onSurface }]}
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
            iconColor={theme.colors.onSurfaceVariant}
          />
        )}
        {searchQuery.length > 0 && (
          <IconButton
            icon="magnify"
            size={24}
            onPress={handleSearch}
            style={styles.searchButton}
            iconColor={theme.colors.primary}
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
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingVertical: 8,
  },
  clearButton: {
    margin: 0,
    padding: 0,
  },
  searchButton: {
    margin: 0,
    marginLeft: -8,
    padding: 0,
  },
});