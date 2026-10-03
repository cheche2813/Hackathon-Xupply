export type InvoiceStatus = 'Pagada' | 'Pendiente' | 'Anulada'

type Invoice = {
  id: string
  order: string
  client: string
  total: number
  status: InvoiceStatus
  date: string
}

export const invoices: Invoice[] = [
  {
    id: 'FV-2041',
    order: 'XP-2041',
    client: 'Restaurante La Esquina',
    total: 4382000,
    status: 'Pagada',
    date: '2026-09-18',
  },
  {
    id: 'FV-2038',
    order: 'XP-2038',
    client: 'Restaurante La Esquina',
    total: 2765000,
    status: 'Pendiente',
    date: '2026-09-16',
  },
  {
    id: 'FV-2035',
    order: 'XP-2035',
    client: 'Hotel Bucaramanga Centro',
    total: 8910000,
    status: 'Pagada',
    date: '2026-09-12',
  },
  {
    id: 'FV-2030',
    order: 'XP-2030',
    client: 'Restaurante Sabor Criollo',
    total: 1540000,
    status: 'Anulada',
    date: '2026-09-09',
  },
  {
    id: 'FV-2027',
    order: 'XP-2027',
    client: 'Cafetería El Grano',
    total: 968000,
    status: 'Pagada',
    date: '2026-09-05',
  },
]

type MovementType = 'Ingreso' | 'Egreso'

type AccountingMovement = {
  id: string
  date: string
  type: MovementType
  concept: string
  category: string
  amount: number
}

export const accountingMovements: AccountingMovement[] = [
  {
    id: 'MC-031',
    date: '2026-09-18',
    type: 'Egreso',
    concept: 'Compra de insumos críticos',
    category: 'Compras',
    amount: -4382000,
  },
  {
    id: 'MC-030',
    date: '2026-09-17',
    type: 'Ingreso',
    concept: 'Ventas del día',
    category: 'Ventas',
    amount: 6240000,
  },
  {
    id: 'MC-029',
    date: '2026-09-16',
    type: 'Egreso',
    concept: 'Pago a domicilio del turno noche',
    category: 'Logística',
    amount: -186000,
  },
  {
    id: 'MC-028',
    date: '2026-09-15',
    type: 'Ingreso',
    concept: 'Ventas del día',
    category: 'Ventas',
    amount: 5870000,
  },
  {
    id: 'MC-027',
    date: '2026-09-14',
    type: 'Egreso',
    concept: 'Servicios y energía',
    category: 'Gastos fijos',
    amount: -742000,
  },
  {
    id: 'MC-026',
    date: '2026-09-13',
    type: 'Ingreso',
    concept: 'Ventas del día',
    category: 'Ventas',
    amount: 5910000,
  },
]
