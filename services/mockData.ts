
import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Neon Tetra',
    price: 45,
    stockCount: 150,
    weightGrams: 5,
    imageUrl: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80',
    description: 'Vibrant blue and red stripes. Peaceful community fish.',
    category: 'Tetras',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    name: 'Betta Splendens (Male)',
    price: 250,
    stockCount: 8,
    weightGrams: 20,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
    description: 'Show quality male Betta with flowing fins. Best kept alone.',
    category: 'Betta',
    difficulty: 'Beginner'
  },
  {
    id: '3',
    name: 'Guppy Pair (Fancy)',
    price: 120,
    stockCount: 0,
    weightGrams: 10,
    imageUrl: 'https://images.unsplash.com/photo-1541434960305-64906f9d372c?auto=format&fit=crop&w=400&q=80',
    description: 'Colorful fancy guppy breeding pair. Very active.',
    category: 'Livebearers',
    difficulty: 'Beginner'
  },
  {
    id: '4',
    name: 'Angel Fish (Marble)',
    price: 180,
    stockCount: 5,
    weightGrams: 40,
    imageUrl: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=400&q=80',
    description: 'Classic marble pattern angelfish. Needs space.',
    category: 'Cichlids',
    difficulty: 'Intermediate'
  },
  {
    id: '5',
    name: 'Discus (Turquoise)',
    price: 1500,
    stockCount: 12,
    weightGrams: 150,
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=400&q=80',
    description: 'High grade Turquoise Discus. Needs pristine water quality.',
    category: 'Cichlids',
    difficulty: 'Advanced'
  },
  {
    id: '6',
    name: 'Goldfish (Oranda)',
    price: 350,
    stockCount: 25,
    weightGrams: 100,
    imageUrl: 'https://images.unsplash.com/photo-1544634149-a3b043c7b8c6?auto=format&fit=crop&w=400&q=80',
    description: 'Red cap Oranda goldfish. Loves cold water.',
    category: 'Goldfish',
    difficulty: 'Intermediate'
  },
];
