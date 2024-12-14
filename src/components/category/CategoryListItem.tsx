import React from 'react';
import { StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { subCategoryMap } from '@/constants/categories';

interface Props {
  title: string;
  onPress: () => void;
  hasSubcategories?: boolean;
}

type CategoryType = keyof typeof subCategoryMap;

export function CategoryListItem({ title, onPress, hasSubcategories = false }: Props) {
  const theme = useTheme();
  const categoryKey = title.replace(/\s+/g, '') as CategoryType;
  const subCategories = hasSubcategories ? subCategoryMap[categoryKey] || [] : [];

  if (hasSubcategories) {
    return (
      <List.Accordion
        title={title}
        style={styles.accordion}
        titleStyle={styles.title}
        theme={{
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#E85D3F',
          },
        }}
      >
        {subCategories.map((subCategory) => (
          <List.Item
            key={subCategory}
            title={subCategory}
            onPress={() => onPress()}
            style={styles.subItem}
            titleStyle={styles.subItemTitle}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        ))}
      </List.Accordion>
    );
  }

  return (
    <List.Item
      title={title}
      onPress={onPress}
      style={styles.item}
      titleStyle={styles.title}
      right={props => <List.Icon {...props} icon="chevron-right" />}
    />
  );
}

const styles = StyleSheet.create({
  accordion: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  subItem: {
    paddingLeft: 32,
    backgroundColor: '#F8F8F8',
  },
  subItemTitle: {
    fontSize: 14,
    color: '#666666',
  },
});