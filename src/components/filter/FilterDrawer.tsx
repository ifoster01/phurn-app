import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Portal, Text, Button, useTheme, Chip, Divider, RadioButton, TextInput } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { FILTER_NAMES, FilterCategory, FurnitureType, PriceSortType, DiscountSortType, SORT_NAMES, useProductFilterStore } from '@/stores/useProductFilterStore';
import { categories, roomCategories, RoomType, subcategory_map } from '@/constants/categories';
import { useDebouncedCallback } from 'use-debounce';

interface FilterDrawerProps {
  visible: boolean;
  onDismiss: () => void;
}

interface FormValues {
  minPrice: string;
  maxPrice: string;
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
  
  const { control, setValue } = useForm<FormValues>({
    defaultValues: {
      minPrice: '',
      maxPrice: '',
    },
  });

  const {
    filterCategories,
    selectedRooms,
    selectedFurnitureTypes,
    selectedBrands,
    minPrice,
    maxPrice,
    addFilterCategory,
    removeFilterCategory,
    addRoom,
    removeRoom,
    addFurnitureType,
    removeFurnitureType,
    addBrand,
    removeBrand,
    setMinPrice,
    setMaxPrice,
    clearFilters,
    hasActiveFilters,
    priceSort,
    discountSort,
    setPriceSort,
    setDiscountSort,
    clearSorting,
  } = useProductFilterStore();

  // Initialize form values when the drawer opens
  useEffect(() => {
    if (visible) {
      setValue('minPrice', minPrice?.toString() ?? '');
      setValue('maxPrice', maxPrice?.toString() ?? '');
    }
  }, [visible, minPrice, maxPrice, setValue]);

  const updatePriceFilter = useDebouncedCallback((value: string, type: 'min' | 'max') => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const parsedValue = numericValue === '' ? null : parseInt(numericValue, 10);
    
    if (type === 'min') {
      setMinPrice(parsedValue);
    } else {
      setMaxPrice(parsedValue);
    }
  }, 300);

  // Calculate snap points accounting for safe areas
  const snapPoints = useMemo(() => {
    const availableHeight = SCREEN_HEIGHT - insets.top - insets.bottom;
    return [Math.min(MAX_DRAWER_HEIGHT, availableHeight)];
  }, [insets]);

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

  const handleApply = () => {
    onDismiss();
  };

  const handleClearAll = () => {
    clearFilters();
    clearSorting();
    setValue('minPrice', '');
    setValue('maxPrice', '');
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
            selectedColor="#EF5350"
            onPress={() => onPress(item)}
            style={[
              styles.chip,
              selectedItems.includes(item) && styles.selectedChip,
              {
                borderColor: selectedItems.includes(item) ? '#EF5350' : '#666666',
              }
            ]}
            textStyle={{
              color: selectedItems.includes(item) ? '#EF5350' : '#666666',
            }}
            mode="outlined"
          >
            {formatLabel ? formatLabel(item) : item}
          </Chip>
        ))}
      </View>
    </>
  );

  const renderSortingOption = (
    label: string,
    value: string,
    currentValue: string,
  ) => {
    const isSelected = value === currentValue;
    const backgroundColor = isSelected ? 'rgba(243, 79, 35, 0.1)' : 'transparent';
    
    return (
      <View style={[styles.radioItem, { backgroundColor }]}>
        <RadioButton.Item
          label={label}
          value={value}
          position="trailing"
          labelStyle={[
            styles.radioLabel,
            isSelected && styles.selectedRadioLabel,
            {
              color: isSelected ? '#EF5350' : '#666666',
            }
          ]}
          style={styles.radioButton}
        />
      </View>
    );
  };

  const renderSortingSection = () => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Sorting
      </Text>
      
      <View style={styles.sortingContainer}>
        <Text variant="bodyMedium" style={styles.sortingSubtitle}>
          Price
        </Text>
        <RadioButton.Group 
          onValueChange={value => setPriceSort(value as PriceSortType)} 
          value={priceSort}
        >
          {renderSortingOption(SORT_NAMES['none'], 'none', priceSort)}
          {renderSortingOption(SORT_NAMES['high-to-low'], 'high-to-low', priceSort)}
          {renderSortingOption(SORT_NAMES['low-to-high'], 'low-to-high', priceSort)}
        </RadioButton.Group>

        <Text variant="bodyMedium" style={[styles.sortingSubtitle, styles.sortingSpacing]}>
          Discount
        </Text>
        <RadioButton.Group 
          onValueChange={value => setDiscountSort(value as DiscountSortType)} 
          value={discountSort}
        >
          {renderSortingOption(SORT_NAMES['none'], 'none', discountSort)}
          {renderSortingOption(SORT_NAMES['highest-first'], 'highest-first', discountSort)}
        </RadioButton.Group>
      </View>
    </>
  );

  // Update the price range section renderer
  const renderPriceRangeSection = () => (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Price Range
      </Text>
      <View style={styles.priceInputContainer}>
        <View style={styles.priceInputWrapper}>
          <Controller
            control={control}
            name="minPrice"
            rules={{
              validate: value => !value || parseInt(value) <= 999999 || 'Max value is 999,999'
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Min Price"
                value={value}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  if (numericValue === '' || parseInt(numericValue) <= 999999) {
                    onChange(numericValue);
                    updatePriceFilter(numericValue, 'min');
                  }
                }}
                keyboardType="numeric"
                mode="outlined"
                style={styles.priceInput}
                left={<TextInput.Affix text="$" />}
                placeholder="0"
              />
            )}
          />
        </View>
        <Text style={styles.priceInputSeparator}>to</Text>
        <View style={styles.priceInputWrapper}>
          <Controller
            control={control}
            name="maxPrice"
            rules={{
              validate: value => !value || parseInt(value) <= 999999 || 'Max value is 999,999'
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Max Price"
                value={value}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  if (numericValue === '' || parseInt(numericValue) <= 999999) {
                    onChange(numericValue);
                    updatePriceFilter(numericValue, 'max');
                  }
                }}
                keyboardType="numeric"
                mode="outlined"
                style={styles.priceInput}
                left={<TextInput.Affix text="$" />}
                placeholder="999,999"
              />
            )}
          />
        </View>
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <BottomSheetView style={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
              {/* Header */}
              <View style={styles.header}>
                <Text variant="titleLarge" style={styles.title}>
                  Filters & Sorting
                </Text>
                {(hasActiveFilters() || priceSort !== 'none' || discountSort !== 'none' || minPrice !== null || maxPrice !== null) && (
                  <Button onPress={handleClearAll} textColor={theme.colors.error}>
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
                {/* Sorting Section */}
                {renderSortingSection()}
                
                <Divider style={styles.divider} />

                {/* Price Range Section */}
                {renderPriceRangeSection()}
                
                <Divider style={styles.divider} />

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
                  onPress={handleApply}
                  style={styles.applyButton}
                >
                  Apply
                </Button>
              </View>
            </BottomSheetView>
          </TouchableWithoutFeedback>
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
    color: '#666666',
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: 'rgba(243, 79, 35, 0.1)',
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
  sortingContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  sortingSubtitle: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '700',
  },
  sortingSpacing: {
    marginTop: 16,
  },
  radioItem: {
    marginVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  radioLabel: {
    fontSize: 14,
    marginLeft: -8,
  },
  selectedRadioLabel: {
    fontWeight: '500',
  },
  radioButton: {
    paddingVertical: 6,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceInput: {
    backgroundColor: 'white',
  },
  priceInputSeparator: {
    marginHorizontal: 12,
    color: '#666666',
  },
}); 