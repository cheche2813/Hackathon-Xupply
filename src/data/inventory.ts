export type StockState = 'Óptimo' | 'Por agotar' | 'Crítico'

export type InventoryItem = {
  id: string
  input: string
  category: string
  stock: number
  minimum: number
  unit: string
  supplier: string
}

export const inventory: InventoryItem[] = [
  {
    id: 'INV-001',
    input: 'Papa pastusa',
    category: 'Tubérculos',
    stock: 320,
    minimum: 120,
    unit: 'kg',
    supplier: 'Huerta La Candelaria',
  },
  {
    id: 'INV-002',
    input: 'Pollo broiler',
    category: 'Cárnicos',
    stock: 48,
    minimum: 60,
    unit: 'kg',
    supplier: 'Distribuidora El Palmar',
  },
  {
    id: 'INV-003',
    input: 'Leche entera',
    category: 'Lácteos',
    stock: 18,
    minimum: 40,
    unit: 'litros',
    supplier: 'Lácteos Sabaneta',
  },
  {
    id: 'INV-004',
    input: 'Aceite de girasol',
    category: 'Abarrotes',
    stock: 96,
    minimum: 30,
    unit: 'litros',
    supplier: 'Comercial Andina',
  },
  {
    id: 'INV-005',
    input: 'Queso mozzarella',
    category: 'Lácteos',
    stock: 9,
    minimum: 25,
    unit: 'kg',
    supplier: 'Lácteos Sabaneta',
  },
  {
    id: 'INV-006',
    input: 'Detergente industrial',
    category: 'Aseo',
    stock: 64,
    minimum: 20,
    unit: 'galones',
    supplier: 'Limpieza Total',
  },
  {
    id: 'INV-007',
    input: 'Tomate pera',
    category: 'Frutas y verduras',
    stock: 12,
    minimum: 35,
    unit: 'kg',
    supplier: 'Huerta La Candelaria',
  },
  {
    id: 'INV-008',
    input: 'Harina de trigo',
    category: 'Abarrotes',
    stock: 140,
    minimum: 50,
    unit: 'kg',
    supplier: 'Comercial Andina',
  },
]

export const stockState = (item: InventoryItem): StockState => {
  if (item.stock <= item.minimum * 0.5) return 'Crítico'
  if (item.stock <= item.minimum) return 'Por agotar'
  return 'Óptimo'
}

type OperationalKpi = {
  label: string
  value: string
  hint: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  icon: string
}

export const operationalKpis: OperationalKpi[] = [
  {
    label: 'Órdenes de hoy',
    value: '18',
    hint: '12 confirmadas, 6 en preparación',
    delta: '+3 vs. ayer',
    trend: 'up',
    icon: 'XpShoppingCart',
  },
  {
    label: 'Ventas del día',
    value: '$4.382.000',
    hint: 'Ticket promedio $243.444',
    delta: '+9,4%',
    trend: 'up',
    icon: 'XpCircleDollarSign',
  },
  {
    label: 'Food cost',
    value: '28,4%',
    hint: 'Meta del mes: 30%',
    delta: '-1,2 pts',
    trend: 'down',
    icon: 'XpPercent',
  },
  {
    label: 'Entregas a tiempo',
    value: '96%',
    hint: '1 pedido con retraso hoy',
    delta: '+2 pts',
    trend: 'up',
    icon: 'XpTruck',
  },
  {
    label: 'Presupuesto disponible',
    value: '$10.360.000',
    hint: 'De $29.000.000 del trimestre',
    delta: '64%comprometido',
    trend: 'flat',
    icon: 'XpWallet',
  },
  {
    label: 'Rotación de cocina',
    value: '4,1 días',
    hint: 'Promedio de días de cobertura',
    delta: 'estable',
    trend: 'flat',
    icon: 'XpBoxes',
  },
]

// Punto de pedido (ROP) = consumo diario x dias de lead time + stock de
// seguridad. Si el inventario actual queda por debajo, hay que pedir ya.
type CriticalStockItem = {
  id: string
  input: string
  emoji: string
  category: string
  supplier: string
  unit: string
  stock: number
  dailyUsage: number
  leadTimeDays: number
  safetyStock: number
  reorderPoint: number
  coverDays: number
  suggestedQty: number
  unitCost: number
}

export const criticalStock: CriticalStockItem[] = [
  {
    id: 'ROP-001',
    input: 'Pollo broiler',
    emoji: '🍗',
    category: 'Cárnicos',
    supplier: 'Distribuidora El Palmar',
    unit: 'kg',
    stock: 8,
    dailyUsage: 14,
    leadTimeDays: 2,
    safetyStock: 7,
    reorderPoint: 35,
    coverDays: 0.6,
    suggestedQty: 45,
    unitCost: 18900,
  },
  {
    id: 'ROP-002',
    input: 'Papa pastusa',
    emoji: '🥔',
    category: 'Tubérculos',
    supplier: 'Huerta La Candelaria',
    unit: 'kg',
    stock: 12,
    dailyUsage: 8,
    leadTimeDays: 3,
    safetyStock: 10,
    reorderPoint: 34,
    coverDays: 1.5,
    suggestedQty: 60,
    unitCost: 4200,
  },
  {
    id: 'ROP-003',
    input: 'Aceite de girasol',
    emoji: '🫗',
    category: 'Despensa',
    supplier: 'Aceites y Cereales del Oriente',
    unit: 'L',
    stock: 9,
    dailyUsage: 6,
    leadTimeDays: 4,
    safetyStock: 8,
    reorderPoint: 32,
    coverDays: 1.5,
    suggestedQty: 48,
    unitCost: 9800,
  },
  {
    id: 'ROP-004',
    input: 'Queso mozzarella',
    emoji: '🧀',
    category: 'Lácteos',
    supplier: 'Lácteos La Pradera',
    unit: 'kg',
    stock: 6,
    dailyUsage: 5,
    leadTimeDays: 2,
    safetyStock: 5,
    reorderPoint: 15,
    coverDays: 1.2,
    suggestedQty: 25,
    unitCost: 24500,
  },
]

type InvestmentCategory = {
  label: string
  amount: number
  share: number
  color: string
}

type MonthInvestment = {
  total: number
  previous: number
  budget: number
  byCategory: InvestmentCategory[]
  bySupplier: { label: string; amount: number; orders: number }[]
}

export const monthInvestment: MonthInvestment = {
  total: 18640000,
  previous: 16980000,
  budget: 29000000,
  byCategory: [
    { label: 'Proteínas', amount: 6337600, share: 34, color: 'var(--brand)' },
    { label: 'Granos y harinas', amount: 4100800, share: 22, color: 'var(--clay)' },
    { label: 'Lácteos', amount: 3355200, share: 18, color: 'var(--fresh)' },
    { label: 'Vegetales y frutas', amount: 2609600, share: 14, color: 'var(--chart-3)' },
    { label: 'Aseo y descarte', amount: 2236800, share: 12, color: 'var(--chart-5)' },
  ],
  bySupplier: [
    { label: 'Distribuidora El Palmar', amount: 6120000, orders: 14 },
    { label: 'Sabores del Norte', amount: 4380000, orders: 11 },
    { label: 'Huerta La Candelaria', amount: 3240000, orders: 9 },
    { label: 'Lácteos La Pradera', amount: 2510000, orders: 8 },
  ],
}
