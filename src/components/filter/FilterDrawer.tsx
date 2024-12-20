import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Portal, Text, Button, List, useTheme, Divider, Chip } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useFilter } from '@/providers/FilterProvider';
import type { CategoryType } from '@/stores/useFilterStore';

// These would typically come from your backend or constants file
const CATEGORIES = {
  buy: [
    { name: 'Sofas', subcategories: ['Sectionals', 'Loveseats', 'Sleeper Sofas'] },
    { name: 'Tables', subcategories: ['Coffee Tables', 'Dining Tables', 'Side Tables'] },
    { name: 'Chairs', subcategories: ['Dining Chairs', 'Accent Chairs', 'Office Chairs'] },
    { name: 'Beds', subcategories: ['Platform Beds', 'Canopy Beds', 'Storage Beds'] },
  ],
  rent: [
    { name: 'Living Room Sets', subcategories: ['Modern', 'Traditional', 'Contemporary'] },
    { name: 'Dining Sets', subcategories: ['4-Piece', '6-Piece', '8-Piece'] },
    { name: 'Bedroom Sets', subcategories: ['Queen', 'King', 'Twin'] },
    { name: 'Office Sets', subcategories: ['Home Office', 'Executive', 'Student'] },
  ],
};

export function FilterDrawer() {
  const theme = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  const {
    isFilterDrawerOpen,
    closeFilterDrawer,
    categoryType,
    category,
    subcategory,
    setCategoryType,
    setCategory,
    setSubcategory,
    clearFilters,
    hasActiveFilters,
  } = useFilter();

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      closeFilterDrawer();
    }
  }, [closeFilterDrawer]);

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
  React.useEffect(() => {
    if (isFilterDrawerOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isFilterDrawerOpen]);

  const handleCategoryTypeSelect = (type: CategoryType) => {
    setCategoryType(type);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  const handleSubcategorySelect = (selectedSubcategory: string) => {
    setSubcategory(selectedSubcategory);
  };

  const currentCategories = categoryType ? CATEGORIES[categoryType] : [];
  const currentSubcategories = category 
    ? currentCategories.find(c => c.name === category)?.subcategories || []
    : [];

  return (
    <Portal>
      <GestureHandlerRootView style={styles.gestureRoot}>
        <BottomSheet
          ref={bottomSheetRef}
          index={isFilterDrawerOpen ? 0 : -1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={styles.handle}
          backgroundStyle={styles.drawerContent}
        >
          <BottomSheetView style={styles.content}>
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

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Type
              </Text>
              <View style={styles.chipContainer}>
                <Chip
                  selected={categoryType === 'buy'}
                  onPress={() => handleCategoryTypeSelect('buy')}
                  style={styles.chip}
                >
                  For Sale
                </Chip>
                <Chip
                  selected={categoryType === 'rent'}
                  onPress={() => handleCategoryTypeSelect('rent')}
                  style={styles.chip}
                >
                  For Rent
                </Chip>
              </View>

              {categoryType && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Category
                  </Text>
                  <View style={styles.chipContainer}>
                    {currentCategories.map((cat) => (
                      <Chip
                        key={cat.name}
                        selected={category === cat.name}
                        onPress={() => handleCategorySelect(cat.name)}
                        style={styles.chip}
                      >
                        {cat.name}
                      </Chip>
                    ))}
                  </View>
                </>
              )}

              {category && currentSubcategories.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Subcategory
                  </Text>
                  <View style={styles.chipContainer}>
                    {currentSubcategories.map((sub) => (
                      <Chip
                        key={sub}
                        selected={subcategory === sub}
                        onPress={() => handleSubcategorySelect(sub)}
                        style={styles.chip}
                      >
                        {sub}
                      </Chip>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={closeFilterDrawer}
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
    flex: 1,
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
    paddingBottom: 16,
  },
  title: {
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
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
  },
  applyButton: {
    marginBottom: 0,
  },
}); 