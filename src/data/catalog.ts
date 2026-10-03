export const categories = [
  { value: 'todas', label: 'Todas las categorías' },
  { value: 'carnes', label: 'Carnes y embutidos' },
  { value: 'vegetales', label: 'Vegetales y frutas' },
  { value: 'lacteos', label: 'Lácteos y huevos' },
  { value: 'abarrotes', label: 'Abarrotes y granos' },
  { value: 'bebidas', label: 'Bebidas y licores' },
  { value: 'aseo', label: 'Aseo y papelería' },
] as const

export type Category = (typeof categories)[number]['value']

export type Supplier = {
  id: string
  name: string
  emoji: string
  zone: string
  rating: number
  reviews: number
  delivery: string
  minOrder: number
  verified: boolean
}

export const suppliers: Supplier[] = [
  {
    id: 's-01',
    name: 'Distribuidora El Palmar',
    emoji: '🌴',
    zone: 'Bucaramanga · Centro',
    rating: 4.8,
    reviews: 412,
    delivery: 'Mañana antes de las 9:00 a.',
    minOrder: 120000,
    verified: true,
  },
  {
    id: 's-02',
    name: 'Fríos del Oriente',
    emoji: '❄️',
    zone: 'Bucaramanga · Girardot',
    rating: 4.7,
    reviews: 268,
    delivery: 'Hoy antes de las 4:00 p. m.',
    minOrder: 95000,
    verified: true,
  },
  {
    id: 's-03',
    name: 'Huerta La Candelaria',
    emoji: '🥬',
    zone: 'Bucaramanga · Provenza',
    rating: 4.9,
    reviews: 531,
    delivery: 'Mañana antes de las 7:00 a.',
    minOrder: 60000,
    verified: true,
  },
  {
    id: 's-04',
    name: 'Lácteos Sabaneta',
    emoji: '🧀',
    zone: 'Bucaramanga · Sabaneta',
    rating: 4.6,
    reviews: 197,
    delivery: 'Hoy antes de las 11:00 a.',
    minOrder: 75000,
    verified: true,
  },
  {
    id: 's-05',
    name: 'Granja El Roble',
    emoji: '🥚',
    zone: 'Piedecuesta',
    rating: 4.8,
    reviews: 143,
    delivery: 'Mañana antes de las 6:00 a.',
    minOrder: 50000,
    verified: true,
  },
  {
    id: 's-06',
    name: 'Comercial Andina',
    emoji: '🏪',
    zone: 'Bucaramanga · San Francisco',
    rating: 4.5,
    reviews: 226,
    delivery: 'Hoy antes de las 5:00 p. m.',
    minOrder: 40000,
    verified: true,
  },
  {
    id: 's-07',
    name: 'Limpieza Total',
    emoji: '🧼',
    zone: 'Bucaramanga · Cabecera',
    rating: 4.4,
    reviews: 98,
    delivery: 'Hoy antes de las 6:00 p. m.',
    minOrder: 35000,
    verified: false,
  },
]

export type Product = {
  id: string
  name: string
  supplier: string
  category: Exclude<Category, 'todas'>
  unit: string
  price: number
  previousPrice?: number
  rating: number
  reviews: number
  stock: 'alta' | 'media' | 'baja'
  delivery: string
  emoji: string
  tags: string[]
}

export const products: Product[] = [
  {
    id: 'p-01',
    name: 'Pecho de pollo broiler',
    supplier: 'Distribuidora El Palmar',
    category: 'carnes',
    unit: 'kilo',
    price: 18900,
    previousPrice: 20500,
    rating: 4.9,
    reviews: 128,
    stock: 'alta',
    delivery: 'Mañana antes de las 9:00 a.',
    emoji: '🍗',
    tags: ['Fresco', 'Origen definido'],
  },
  {
    id: 'p-02',
    name: 'Carne de res molida',
    supplier: 'Fríos del Oriente',
    category: 'carnes',
    unit: 'kilo',
    price: 24500,
    rating: 4.7,
    reviews: 96,
    stock: 'media',
    delivery: 'Mañana después de las 2:00 p. m.',
    emoji: '🥩',
    tags: ['Refrigerado'],
  },
  {
    id: 'p-03',
    name: 'Tomate perita',
    supplier: 'Huerta La Candelaria',
    category: 'vegetales',
    unit: 'kilo',
    price: 4200,
    previousPrice: 4800,
    rating: 4.8,
    reviews: 211,
    stock: 'alta',
    delivery: 'Hoy antes de las 4:00 p. m.',
    emoji: '🍅',
    tags: ['Agrícola'],
  },
  {
    id: 'p-04',
    name: 'Papa criolla',
    supplier: 'Huerta La Candelaria',
    category: 'vegetales',
    unit: 'arroba',
    price: 78000,
    rating: 4.6,
    reviews: 74,
    stock: 'alta',
    delivery: 'Hoy antes de las 4:00 p. m.',
    emoji: '🥔',
    tags: ['Agrícola'],
  },
  {
    id: 'p-05',
    name: 'Queso mozzarella porcionado',
    supplier: 'Lácteos Sabaneta',
    category: 'lacteos',
    unit: 'libra',
    price: 16900,
    rating: 4.9,
    reviews: 143,
    stock: 'media',
    delivery: 'Mañana antes de las 9:00 a.',
    emoji: '🧀',
    tags: ['Refrigerado'],
  },
  {
    id: 'p-06',
    name: 'Huevos rojos AA',
    supplier: 'Granja El Roble',
    category: 'lacteos',
    unit: 'cartón x 30',
    price: 21500,
    rating: 4.8,
    reviews: 187,
    stock: 'baja',
    delivery: 'Solo 6 unidades disponibles',
    emoji: '🥚',
    tags: ['Últimas unidades'],
  },
  {
    id: 'p-07',
    name: 'Arroz blanco extra',
    supplier: 'Comercial Andina',
    category: 'abarrotes',
    unit: 'bulto x 50 kg',
    price: 268000,
    rating: 4.7,
    reviews: 65,
    stock: 'alta',
    delivery: 'En 48 horas',
    emoji: '🌾',
    tags: ['Mayorista'],
  },
  {
    id: 'p-08',
    name: 'Aceite vegetal 5 gal',
    supplier: 'Comercial Andina',
    category: 'abarrotes',
    unit: 'caneca',
    price: 142000,
    rating: 4.6,
    reviews: 58,
    stock: 'media',
    delivery: 'En 48 horas',
    emoji: '🫗',
    tags: ['Importado'],
  },
  {
    id: 'p-09',
    name: 'Gaseosa 1.5 L',
    supplier: 'Distribuidora El Palmar',
    category: 'bebidas',
    unit: 'paquete x 6',
    price: 27500,
    rating: 4.8,
    reviews: 302,
    stock: 'alta',
    delivery: 'Hoy antes de las 6:00 p. m.',
    emoji: '🥤',
    tags: ['Más vendido'],
  },
  {
    id: 'p-10',
    name: 'Papel higiénico institucional',
    supplier: 'Limpieza Total',
    category: 'aseo',
    unit: 'paquete x 20 rollos',
    price: 38900,
    previousPrice: 42000,
    rating: 4.5,
    reviews: 89,
    stock: 'media',
    delivery: 'Mañana después de las 2:00 p. m.',
    emoji: '🧻',
    tags: ['Uso intensivo'],
  },
]
