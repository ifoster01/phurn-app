interface CategoryItem {
  id: string;
  title: string;
  hasSubcategories?: boolean;
}

export type CategoryType = 'new' | 'deals' | 'type' | 'brand' | 'room';
export type RoomType = 'bedroom' | 'dining-room' | 'living-room' | 'office' | 'outdoor';
export const CategoryEnum = ['new', 'deals', 'type', 'brand', 'room'] as const;
export const RoomEnum = ['living-room', 'bedroom', 'dining-room', 'office', 'outdoor'] as const;

export const categories: Record<CategoryType, CategoryItem[]> = {
  new: [
    { id: 'all-new', title: 'All New Arrivals' },
    { id: 'new-furniture', title: 'New Furniture' },
    { id: 'new-decor', title: 'New Decor' },
  ],
  deals: [
    { id: 'all-deals', title: 'Shop All Deals' },
    { id: 'deals', title: 'Best Deals' },
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
    { id: 'arhaus', title: 'ARHAUS' },
    { id: 'cb2', title: 'CB2' },
    { id: 'crate-barrel', title: 'Crate & Barrel' },
    { id: 'ikea', title: 'IKEA' },
    { id: 'restoration-hardware', title: 'Restoration Hardware' },
    { id: 'pottery-barn', title: 'Pottery Barn' },
    { id: 'article', title: 'Article' },
    { id: 'all-modern', title: 'All Modern' },
    { id: 'room-board', title: 'Room & Board' },
    { id: 'anthropologie', title: 'Anthropologie' },
    { id: 'urban', title: 'Urban Outfitters' },
    { id: 'serena', title: 'Serena & Lily' },
    { id: 'design-within', title: 'Design Within Reach' },
    { id: 'castlery', title: 'Castlery' },
    { id: 'burrow', title: 'Burrow' },
  ],
  room: [
    { id: 'all-rooms', title: 'Shop All Rooms' },
  ],
};

export const roomCategories: Record<RoomType, CategoryItem[]> = {
  'bedroom': [
    { id: 'all-furniture', title: 'All Furniture' },
    { id: 'beds', title: 'Beds' },
    { id: 'dressers', title: 'Dressers' },
    { id: 'headboards', title: 'Headboards' },
    { id: 'nightstands', title: 'Nightstands' },
  ],
  'dining-room': [
    { id: 'all-furniture', title: 'All Furniture' },
    { id: 'bar-stools', title: 'Bar & Counter Stools' },
    { id: 'buffets', title: 'Buffets & Sideboards' },
    { id: 'dining-tables', title: 'Dining Tables' },
    { id: 'dining-chairs', title: 'Dining Chairs' },
  ],
  'living-room': [
    { id: 'all-furniture', title: 'All Furniture' },
    { id: 'chairs', title: 'Chairs' },
    { id: 'coffee-tables', title: 'Coffee Tables' },
    { id: 'sofas', title: 'Sofas' },
    { id: 'tv-stands', title: 'TV Stands' },
  ],
  'office': [
    { id: 'all-furniture', title: 'All Furniture' },
    { id: 'bookcases', title: 'Bookcases' },
    { id: 'desks', title: 'Desks' },
    { id: 'filing', title: 'Filing & Storage' },
    { id: 'office-chairs', title: 'Office Chairs' },
  ],
  'outdoor': [
    { id: 'all-furniture', title: 'All Furniture' },
    { id: 'outdoor-chairs', title: 'Outdoor Chairs' },
    { id: 'outdoor-sofas', title: 'Outdoor Sofas' },
    { id: 'outdoor-tables', title: 'Outdoor Tables' },
  ],
};

export const subCategoryMap = {
  Tables: [
    'All Tables',
    'Coffee Tables',
    'Console Tables',
    'Dining Tables',
    'End and Side Tables',
  ],
  Seating: [
    'All Seating',
    'Benches',
    'Chairs',
    'Ottomans',
    'Sofas',
  ],
  Storage: [
    'All Storage',
    'Bookcases',
    'Cabinets',
    'Credenzas',
    'Dressers',
    'TV Stands',
  ],
  Beds: [
    'All Beds',
    'Canopy Beds',
    'Daybeds',
    'Headboards',
    'Platform Beds',
  ],
} as const;

export const subcategory_map = {
  'sectionals': 'sectional',
  'daybeds': 'daybed',
  'accent chairs': 'accent chair',
  'swivel chairs': 'swivel chair',
  'coffee tables': 'coffee table',
  'console tables': 'console table',
  'side tables': 'side table',
  'media consoles': 'media console',
  'ottomans': 'ottoman',
  'dining tables': 'dining table',
  'dining chairs': 'dining chair',
  'counter stools': 'counter stool',
  'bar stools': 'bar stool',
  'credenzas': 'credenza',
  'bar cabinets': 'bar cabinet',
  'nightstands': 'nightstand',
  'bedroom benches': 'bedroom bench',
  'mattresses': 'mattress',
  'bookcases': 'bookcase',
  'storage cabinets': 'storage cabinet',
  'desks': 'desk',
  'desk chairs': 'desk chair',
  'office chairs': 'office chair',
  'entryway cabinets': 'entryway cabinet',
  'lounge chairs': 'lounge chair',
  'loveseats': 'loveseat',
  'outdoor chairs': 'outdoor chair',
  'outdoor sofas': 'outdoor sofa',
  'armchairs': 'armchair',
  'sofa beds': 'sofa bed',
  'end and side tables': 'side table',
  'bar & counter stools': 'stool',
  'outdoor tables': 'outdoor table',
  'dressers': 'dresser',
  'chairs': 'chair',
  'sofas': 'sofa',
  'benches': 'bench',
  'stools': 'stool',
  'cabinets': 'cabinet',
  'platform beds': 'bed',
  'headboards': 'headboard',
  'beds': 'bed',
  'seating': 'seating',
  'tables': 'tables',
  'storage': 'storage',
} as const;

export const room_map = {
  'living-room': 'living',
  'bedroom': 'bedroom',
  'dining-room': 'dining',
  'office': 'office',
  'outdoor': 'outdoor',
} as const;