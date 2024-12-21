import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Portal, Text, Button, List, useTheme, Divider, Chip, IconButton } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { CATEGORY_NAMES, FilterCategory, RoomType, useProductFilterStore } from '@/stores/useProductFilterStore';
import { subcategory_map } from '@/constants/categories';

interface FilterDrawerProps {
  visible: boolean;
  onDismiss: () => void;
}

const categories = ['new', 'clearance', 'type', 'room']
const roomTypes = ['living-room', 'bedroom', 'dining-room', 'office']
const subcategories = Object.keys(subcategory_map)

// Get screen height
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_DRAWER_HEIGHT = SCREEN_HEIGHT * 0.8; // 80% of screen height

export function FilterDrawer({ visible, onDismiss }: FilterDrawerProps) {
  const theme = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [MAX_DRAWER_HEIGHT], []);

  const {
    category,
    subcategory,
    roomType,
    clearFilters,
    hasActiveFilters,
    setCategory,
    setRoomType,
    setSubcategory,
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

  // Effects
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleFilterPress = (filter: string, type: 'category' | 'room' | 'subcategory') => {
    if (category?.toLowerCase() === filter.toLowerCase() && type === 'category') {
      setCategory(null)
      return
    } else if (roomType?.toLowerCase() === filter.toLowerCase() && type === 'room') {
      setRoomType(null)
      return
    } else if (subcategory?.toLowerCase() === filter.toLowerCase() && type === 'subcategory') {
      setSubcategory(null)
      return
    }

    if (type === 'category') {
      setCategory(filter as FilterCategory)
    } else if (type === 'room') {
      setRoomType(filter as RoomType)
    } else if (type === 'subcategory') {
      setSubcategory(filter)
    }
  }

  return (
    <Portal>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <BottomSheet
          ref={bottomSheetRef}
          index={visible ? 0 : -1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={styles.handle}
          backgroundStyle={styles.drawerContent}
        >
          <BottomSheetView style={styles.content}>
            {/* Header - Always visible */}
            <View style={styles.header}>
              <Text variant="titleLarge" style={styles.title}>
                Filters
              </Text>
              {hasActiveFilters() && (
                <Button 
                  mode="text" 
                  onPress={clearFilters}
                  textColor={theme.colors.error}
                >
                  Clear All
                </Button>
              )}
            </View>

            {/* Selected Filters - Always visible */}
            <View style={styles.selectedFiltersContainer}>
              {getFilterSummary() && getFilterSummary().map((filter) => {
                if (filter === null || filter === undefined) return null
                const filterType = categories.includes(filter.toLowerCase()) ? 'category' : roomTypes.includes(filter.toLowerCase()) ? 'room' : 'subcategory'
                return (
                  <Chip
                    key={filter}
                    style={styles.selectedFilterChip}
                    onPress={() => handleFilterPress(filter, filterType)}
                >
                  <View style={styles.selectedFilterChipContent}>
                    <Text>{filterType === 'category' ? CATEGORY_NAMES[filter as keyof typeof CATEGORY_NAMES] : filterType === 'room' ? filter.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') : filter.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}</Text>
                    <IconButton
                      icon="close"
                      size={16}
                      onPress={() => handleFilterPress(filter, filterType)}
                      style={styles.selectedFilterChipIcon}
                    />
                  </View>
                </Chip>
              )
              })}
            </View>

            {/* Scrollable Content */}
            <ScrollView 
              style={styles.scrollView} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
            >
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Category
              </Text>
              <View style={styles.chipContainer}>
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    selected={category === cat}
                    onPress={() => handleFilterPress(cat, 'category')}
                    style={styles.chip}
                  >
                    {CATEGORY_NAMES[cat as keyof typeof CATEGORY_NAMES]}
                  </Chip>
                ))}
              </View>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Room
              </Text>
              <View style={styles.chipContainer}>
                {roomTypes.map((room) => (
                  <Chip
                    key={room}
                    selected={roomType === room}
                    onPress={() => handleFilterPress(room, 'room')}
                    style={styles.chip}
                  >
                    {room.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                  </Chip>
                ))}
              </View>

              <Text variant="titleMedium" style={styles.sectionTitle}>
                Furniture Type
              </Text>
              <View style={styles.chipContainer}>
                {subcategories.map((sub) => (
                  <Chip
                    key={sub}
                    selected={subcategory === sub}
                    onPress={() => handleFilterPress(sub, 'subcategory')}
                    style={styles.chip}
                  >
                    {sub.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                  </Chip>
                ))}
              </View>
            </ScrollView>

            {/* Footer - Always visible */}
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
  gestureRoot: {
    flex: 1,
  },
  drawerContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    height: MAX_DRAWER_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontWeight: '600',
  },
  selectedFilterChip: {
    backgroundColor: '#DEDEDE',
    color: 'white',
  },
  selectedFilterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DEDEDE',
  },
  selectedFilterChipIcon: {
    padding: 0,
    margin: 0,
    height: 20,
    width: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DEDEDE',
    backgroundColor: 'white',
  },
  applyButton: {
    marginBottom: 4,
  },
}); 