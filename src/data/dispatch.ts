// Centro de solicitudes de domicilio del proveedor: los pedidos que su
// negocio recibe y que necesitan un domiciliario para llegar al cliente.
// El proveedor organiza la cola; el domiciliario ejecuta la ruta.

export type DispatchStatus = 'Pendiente de recoger' | 'En entrega' | 'Entregado'

export type DispatchPriority = 'Alta' | 'Media' | 'Normal'

export type DispatchRequest = {
  id: string
  buyer: string
  destination: string
  zone: string
  courier: string | null
  courierPhone: string | null
  packages: number
  amount: number
  window: string
  placedAt: string
  status: DispatchStatus
  progress: number
  priority: DispatchPriority
  x: number
  y: number
}

export const dispatchBusiness = {
  name: 'Lácteos Sabaneta',
  contact: 'Sofía Villamizar',
  phone: '+57 311 905 4412',
  zone: 'Bucaramanga · Sabaneta',
} as const

export const dispatchRequests: DispatchRequest[] = [
  {
    id: 'XP-2066',
    buyer: 'Hotel Bucaramanga Centro',
    destination: 'Cra 15 #32-10 · Centro',
    zone: 'Centro',
    courier: 'Julián Castaño',
    courierPhone: '+57 318 774 2205',
    packages: 4,
    amount: 396000,
    window: '11:30 – 12:00',
    placedAt: '15 mar · 07:10',
    status: 'En entrega',
    progress: 62,
    priority: 'Alta',
    x: 45,
    y: 37,
  },
  {
    id: 'XP-2068',
    buyer: 'Restaurante La Esquina',
    destination: 'Cll 48 #33-18 · Cabecera',
    zone: 'Cabecera',
    courier: 'Julián Castaño',
    courierPhone: '+57 318 774 2205',
    packages: 3,
    amount: 268000,
    window: '12:30 – 13:00',
    placedAt: '15 mar · 07:22',
    status: 'En entrega',
    progress: 18,
    priority: 'Alta',
    x: 39,
    y: 20,
  },
  {
    id: 'XP-2070',
    buyer: 'Café Aromático',
    destination: 'Cll 45 #18-09 · Kennedy',
    zone: 'Kennedy',
    courier: null,
    courierPhone: null,
    packages: 3,
    amount: 172000,
    window: '15:30 – 16:00',
    placedAt: '15 mar · 09:48',
    status: 'Pendiente de recoger',
    progress: 0,
    priority: 'Media',
    x: 14,
    y: 30,
  },
  {
    id: 'XP-2074',
    buyer: 'Restaurante Sabores del Valle',
    destination: 'Cll 70 #22-41 · Provenza',
    zone: 'Provenza',
    courier: null,
    courierPhone: null,
    packages: 5,
    amount: 344000,
    window: '17:00 – 17:30',
    placedAt: '15 mar · 10:05',
    status: 'Pendiente de recoger',
    progress: 0,
    priority: 'Normal',
    x: 63,
    y: 62,
  },
  {
    id: 'XP-2079',
    buyer: 'Hotel Boutique Saya',
    destination: 'Cll 33 #12-88 · Cabecera',
    zone: 'Cabecera',
    courier: null,
    courierPhone: null,
    packages: 2,
    amount: 148000,
    window: '18:00 – 18:30',
    placedAt: '15 mar · 10:31',
    status: 'Pendiente de recoger',
    progress: 0,
    priority: 'Normal',
    x: 78,
    y: 24,
  },
  {
    id: 'XP-2054',
    buyer: 'Restaurante Sabor Criollo',
    destination: 'Cll 70 #12-30 · Kennedy',
    zone: 'Kennedy',
    courier: 'Sara Oñate',
    courierPhone: '+57 315 660 7741',
    packages: 5,
    amount: 512000,
    window: '16:00 – 16:30',
    placedAt: '14 mar · 13:12',
    status: 'Entregado',
    progress: 100,
    priority: 'Media',
    x: 16,
    y: 38,
  },
  {
    id: 'XP-2049',
    buyer: 'Cafetería El Grano',
    destination: 'Cll 60 #12-45 · Provenza',
    zone: 'Provenza',
    courier: 'Julián Castaño',
    courierPhone: '+57 318 774 2205',
    packages: 2,
    amount: 96000,
    window: '11:00 – 11:30',
    placedAt: '14 mar · 08:40',
    status: 'Entregado',
    progress: 100,
    priority: 'Normal',
    x: 31,
    y: 55,
  },
  {
    id: 'XP-2041',
    buyer: 'Restaurante La Esquina',
    destination: 'Cll 48 #33-18 · Cabecera',
    zone: 'Cabecera',
    courier: 'Julián Castaño',
    courierPhone: '+57 318 774 2205',
    packages: 6,
    amount: 604000,
    window: '15:00 – 15:30',
    placedAt: '13 mar · 09:02',
    status: 'Entregado',
    progress: 100,
    priority: 'Alta',
    x: 40,
    y: 22,
  },
]

export const dispatchByStatus = (status: DispatchStatus) =>
  dispatchRequests.filter((request) => request.status === status)

// Metricas que no se derivan de la lista: tiempos de espera, cumplimiento y
// cobertura de la flota.
export const dispatchKpis = {
  avgWaitMinutes: 18,
  onTimeRate: 95,
  couriersOnRoute: 4,
  fleetTotal: 6,
  unassigned: 1,
} as const

export const dispatchCouriers = [
  { name: 'Julián Castaño', zone: 'Ruta norte', phone: '+57 318 774 2205', active: true },
  { name: 'Sara Oñate', zone: 'Kennedy y centro', phone: '+57 315 660 7741', active: true },
  { name: 'Yeimy Pardo', zone: 'Girardot', phone: '+57 300 448 9927', active: true },
  { name: 'Óscar Villamizar', zone: 'Cabcera', phone: '+57 301 992 3364', active: false },
] as const
