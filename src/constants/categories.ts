interface CategoryItem {
  id: string;
  title: string;
  hasSubcategories?: boolean;
}

export type CategoryType = 'new' | 'deals' | 'type' | 'brand' | 'room';
export type RoomType = 'living-room' | 'bedroom' | 'dining-room' | 'office';

export const categories: Record<CategoryType, CategoryItem[]> = {
  new: [
    { id: 'all-new', title: 'All New Arrivals' },
    { id: 'new-furniture', title: 'New Furniture' },
    { id: 'new-decor', title: 'New Decor' },
  ],
  deals: [
    { id: 'all-deals', title: 'Shop All Deals' },
    { id: 'clearance', title: 'Clearance' },
    { id: 'open-box', title: 'Open Box Deals' },
  ],
  type: [
    { id: 'all-furniture', title: 'Shop All Furniture' },
    { id: 'seating', title: 'Seating', hasSubcategories: true },
    { id: 'tables', title: 'Tables', hasSubcategories: true },
    { id: 'storage', title: 'Storage', hasSubcategories: true },
    { id: 'beds', title: 'Beds', hasSubcategories: true },
  ],
  brand: [
    { id: 'west-elm', title: 'West Elm' },
    { id: 'cb2', title: 'CB2' },
    { id: 'crate-barrel', title: 'Crate & Barrel' },
    { id: 'pottery-barn', title: 'Pottery Barn' },
  ],
  room: [
    { id: 'all-rooms', title: 'Shop All Rooms' },
  ],
};

export const roomCategories: Record<RoomType, CategoryItem[]> = {
  'living-room': [
    { id: 'sofas', title: 'Sofas' },
    { id: 'chairs', title: 'Chairs' },
    { id: 'coffee-tables', title: 'Coffee Tables' },
    { id: 'tv-stands', title: 'TV Stands' },
  ],
  'bedroom': [
    { id: 'beds', title: 'Beds' },
    { id: 'headboards', title: 'Headboards' },
    { id: 'dressers', title: 'Dressers' },
    { id: 'nightstands', title: 'Nightstands' },
  ],
  'dining-room': [
    { id: 'dining-tables', title: 'Dining Tables' },
    { id: 'dining-chairs', title: 'Dining Chairs' },
    { id: 'buffets', title: 'Buffets & Sideboards' },
    { id: 'bar-stools', title: 'Bar & Counter Stools' },
  ],
  'office': [
    { id: 'desks', title: 'Desks' },
    { id: 'office-chairs', title: 'Office Chairs' },
    { id: 'bookcases', title: 'Bookcases' },
    { id: 'filing', title: 'Filing & Storage' },
  ],
};

export const subCategoryMap = {
  Tables: [
    'Coffee Tables',
    'Console Tables',
    'Dining Tables',
    'End and Side Tables',
  ],
  Seating: [
    'Sofas',
    'Chairs',
    'Ottomans',
    'Benches',
  ],
  Storage: [
    'Cabinets',
    'Bookcases',
    'TV Stands',
    'Dressers',
  ],
  Beds: [
    'Platform Beds',
    'Canopy Beds',
    'Daybeds',
    'Headboards',
  ],
} as const;