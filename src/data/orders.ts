export type OrderStatus = 'Confirmada' | 'En preparación' | 'En camino' | 'Entregada' | 'Facturada'

type RecentOrder = {
  id: string
  supplier: string
  placedAt: string
  items: number
  total: number
  status: OrderStatus
}

export const recentOrders: RecentOrder[] = [
  {
    id: 'XP-2051',
    supplier: 'Distribuidora El Palmar',
    placedAt: 'Hoy, 07:42',
    items: 9,
    total: 1284600,
    status: 'En camino',
  },
  {
    id: 'XP-2050',
    supplier: 'Huerta La Candelaria',
    placedAt: 'Hoy, 06:58',
    items: 6,
    total: 742300,
    status: 'Confirmada',
  },
  {
    id: 'XP-2049',
    supplier: 'Lácteos La Pradera',
    placedAt: 'Ayer, 17:20',
    items: 4,
    total: 486900,
    status: 'En preparación',
  },
  {
    id: 'XP-2048',
    supplier: 'Aceites y Cereales del Oriente',
    placedAt: 'Ayer, 15:05',
    items: 7,
    total: 913600,
    status: 'Facturada',
  },
  {
    id: 'XP-2047',
    supplier: 'Sabores del Norte',
    placedAt: 'Ayer, 11:36',
    items: 11,
    total: 1742800,
    status: 'Entregada',
  },
  {
    id: 'XP-2046',
    supplier: 'Distribuidora El Palmar',
    placedAt: '12 mar, 09:12',
    items: 5,
    total: 634200,
    status: 'Facturada',
  },
]

export type PurchasedProduct = {
  productId: string
  times: number
  lastPurchase: string
  quantity: string
  lastUnitPrice: number
  totalSpent: number
}

export const purchasedProducts: PurchasedProduct[] = [
  {
    productId: 'p-01',
    times: 14,
    lastPurchase: '15 mar',
    quantity: '45 kg',
    lastUnitPrice: 19600,
    totalSpent: 1284600,
  },
  {
    productId: 'p-02',
    times: 11,
    lastPurchase: '14 mar',
    quantity: '30 kg',
    lastUnitPrice: 27400,
    totalSpent: 742300,
  },
  {
    productId: 'p-03',
    times: 9,
    lastPurchase: '12 mar',
    quantity: '60 kg',
    lastUnitPrice: 4650,
    totalSpent: 486900,
  },
  {
    productId: 'p-04',
    times: 7,
    lastPurchase: '12 mar',
    quantity: '12 arrobas',
    lastUnitPrice: 78500,
    totalSpent: 913600,
  },
  {
    productId: 'p-05',
    times: 12,
    lastPurchase: '11 mar',
    quantity: '18 libras',
    lastUnitPrice: 17400,
    totalSpent: 486900,
  },
  {
    productId: 'p-07',
    times: 5,
    lastPurchase: '06 mar',
    quantity: '4 bultos',
    lastUnitPrice: 271000,
    totalSpent: 1742800,
  },
  {
    productId: 'p-09',
    times: 8,
    lastPurchase: '04 mar',
    quantity: '20 paquetes',
    lastUnitPrice: 27900,
    totalSpent: 634200,
  },
]

export type MySupplier = {
  id: string
  orders: number
  lastOrder: string
  totalSpent: number
  paymentTerms: string
  contact: string
  phone: string
  topCategories: string[]
  bestSeller: string
}

export const mySuppliers: MySupplier[] = [
  {
    id: 's-01',
    orders: 14,
    lastOrder: 'Hoy, 07:42',
    totalSpent: 6120000,
    paymentTerms: 'Pago a 30 días',
    contact: 'Diana López',
    phone: '+57 315 220 4471',
    topCategories: ['Cárnicos', 'Bebidas'],
    bestSeller: 'Pecho de pollo broiler',
  },
  {
    id: 's-02',
    orders: 11,
    lastOrder: 'Ayer, 17:20',
    totalSpent: 4380000,
    paymentTerms: 'Pago a 15 días',
    contact: 'Hernán Ruiz',
    phone: '+57 316 884 1190',
    topCategories: ['Cárnicos', 'Lácteos'],
    bestSeller: 'Carne de res molida',
  },
  {
    id: 's-03',
    orders: 9,
    lastOrder: 'Hoy, 06:58',
    totalSpent: 3240000,
    paymentTerms: 'Contado contra entrega',
    contact: 'Marta Quintero',
    phone: '+57 313 507 6624',
    topCategories: ['Vegetales', 'Frutas'],
    bestSeller: 'Tomate perita',
  },
  {
    id: 's-04',
    orders: 8,
    lastOrder: 'Ayer, 15:05',
    totalSpent: 2510000,
    paymentTerms: 'Pago a 30 días',
    contact: 'Julián Ortega',
    phone: '+57 318 220 7734',
    topCategories: ['Lácteos'],
    bestSeller: 'Queso mozzarella porcionado',
  },
  {
    id: 's-06',
    orders: 6,
    lastOrder: '12 mar, 09:12',
    totalSpent: 1880000,
    paymentTerms: 'Pago a 45 días',
    contact: 'Silvia Rueda',
    phone: '+57 311 442 0098',
    topCategories: ['Abarrotes'],
    bestSeller: 'Arroz blanco extra',
  },
]
