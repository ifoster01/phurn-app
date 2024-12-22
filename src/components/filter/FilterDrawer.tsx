import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Portal, Text, Button, useTheme, Chip, Divider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FILTER_NAMES, FilterCategory, FurnitureType, useProductFilterStore } from '@/stores/useProductFilterStore';
import { categories, roomCategories, RoomType, subcategory_map } from '@/constants/categories';

interface FilterDrawerProps {
  visible: boolean;
  onDismiss: () => void;
}

// Get screen height and adjust for safe area
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_DRAWER_HEIGHT = SCREEN_HEIGHT * 0.85; // Slightly increased for better visibility

const FILTER_CATEGORIES: FilterCategory[] = ['new', 'clearance'];
const ROOM_TYPES = Object.keys(roomCategories) as RoomType[];
const FURNITURE_TYPES = Object.keys(subcategory_map) as FurnitureType[];
const BRANDS = categories.brand.map(brand => brand.id);

export function FilterDrawer({ visible, onDismiss }: FilterDrawerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  
  // Calculate snap points accounting for safe areas
  const snapPoints = useMemo(() => {
    const availableHeight = SCREEN_HEIGHT - insets.top - insets.bottom;
    return [Math.min(MAX_DRAWER_HEIGHT, availableHeight)];
  }, [insets]);

  const {
    filterCategories,
    selectedRooms,
    selectedFurnitureTypes,
    selectedBrands,
    addFilterCategory,
    removeFilterCategory,
    addRoom,
    removeRoom,
    addFurnitureType,
    removeFurnitureType,
    addBrand,
    removeBrand,
    clearFilters,
    hasActiveFilters,
    getFilterSummary,
  } = useProductFilterStore();

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onDismiss();
    }
  }, [onDismiss]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleFilterPress = (filter: FilterCategory) => {
    if (filterCategories.includes(filter)) {
      removeFilterCategory(filter);
    } else {
      addFilterCategory(filter);
    }
  };

  const handleRoomPress = (room: RoomType) => {
    if (selectedRooms.includes(room)) {
      removeRoom(room);
    } else {
      addRoom(room);
    }
  };

  const handleFurnitureTypePress = (type: FurnitureType) => {
    if (selectedFurnitureTypes.includes(type)) {
      removeFurnitureType(type);
    } else {
      addFurnitureType(type);
    }
  };

  const handleBrandPress = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      removeBrand(brand);
    } else {
      addBrand(brand);
    }
  };

  const renderFilterSection = <T extends string>(
    title: string,
    items: T[],
    selectedItems: T[],
    onPress: (item: T) => void,
    formatLabel?: (item: T) => string
  ) => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={styles.chipContainer}>
        {items.map((item) => (
          <Chip
            key={item}
            selected={selectedItems.includes(item)}
            onPress={() => onPress(item)}
            style={styles.chip}
            mode="outlined"
          >
            {formatLabel ? formatLabel(item) : item}
          </Chip>
        ))}
      </View>
    </>
  );

  return (
    <Portal>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          handleIndicatorStyle={styles.handleIndicator}
          topInset={insets.top}
        >
          <BottomSheetView style={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text variant="titleLarge" style={styles.title}>
                Filters
              </Text>
              {hasActiveFilters() && (
                <Button onPress={clearFilters} textColor={theme.colors.error}>
                  Clear All
                </Button>
              )}
            </View>

            {/* Scrollable Content */}
            <ScrollView 
              style={styles.scrollView} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
            >
              {/* Special Filters */}
              {renderFilterSection(
                'Special',
                FILTER_CATEGORIES,
                filterCategories,
                handleFilterPress,
                (filter) => FILTER_NAMES[filter]
              )}
              
              <Divider style={styles.divider} />
              
              {/* Room Filters */}
              {renderFilterSection(
                'Room',
                ROOM_TYPES,
                selectedRooms,
                handleRoomPress,
                (room) => room.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
              )}
              
              <Divider style={styles.divider} />

              {/* Brand Filters */}
              {renderFilterSection(
                'Brand',
                BRANDS,
                selectedBrands,
                handleBrandPress,
                (brand) => brand.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
              )}
              
              <Divider style={styles.divider} />
              
              {/* Furniture Type Filters */}
              {renderFilterSection(
                'Furniture Type',
                FURNITURE_TYPES,
                selectedFurnitureTypes,
                handleFurnitureTypePress,
                (type) => type.split(' ').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
              )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={onDismiss}
                style={styles.applyButton}
              >
                Apply Filters
              </Button>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  applyButton: {
    width: '100%',
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    marginTop: 8,
  },
}); 