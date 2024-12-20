import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useFilter } from '@/providers/FilterProvider';

export function FilterBar() {
  const theme = useTheme();
  const { openFilterDrawer, getFilterSummary, hasActiveFilters, clearFilters } = useFilter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Pressable 
        style={styles.summaryContainer} 
        onPress={openFilterDrawer}
        android_ripple={{ color: theme.colors.onSurface, borderless: true }}
      >
        <IconButton
          icon="filter-variant"
          size={24}
          iconColor={hasActiveFilters() ? theme.colors.primary : theme.colors.onSurface}
        />
        <Text 
          variant="bodyLarge" 
          style={[
            styles.summaryText,
            hasActiveFilters() && { color: theme.colors.primary }
          ]}
        >
          {getFilterSummary()}
        </Text>
      </Pressable>

      {hasActiveFilters() && (
        <IconButton
          icon="close"
          size={20}
          onPress={clearFilters}
          iconColor={theme.colors.error}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  summaryContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    flex: 1,
  },
}); 