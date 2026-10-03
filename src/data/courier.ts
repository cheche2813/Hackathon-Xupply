// Operacion de un domiciliario: periodos de resumen, registro de entregas,
// tareas del dia y rutas con sus paradas. Las coordenadas x/y son porcentajes
// dentro del mapa ilustrativo: el mapa es decorativo hasta que exista el
// servicio de ubicacion en tiempo real.

export type CourierPeriodId = 'p15' | 'p30'

export type CourierPeriod = {
  id: CourierPeriodId
  label: string
  window: string
  orders: number
  delivered: number
  cancelled: number
  onTimeRate: number
  rating: number
  distanceKm: number
  hours: number
  tips: number
  base: number
  trend: number
  comparison: string
}

// Los dos periodos que pide el panel: la quincena cerrada y el mes completo.
export const courierPeriods: CourierPeriod[] = [
  {
    id: 'p15',
    label: 'Últimos 15 días',
    window: '1 – 15 de marzo',
    orders: 96,
    delivered: 94,
    cancelled: 2,
    onTimeRate: 96,
    rating: 4.8,
    distanceKm: 412,
    hours: 118,
    tips: 94000,
    base: 1_225_000,
    trend: 12.4,
    comparison: 'frente a los 15 días anteriores',
  },
  {
    id: 'p30',
    label: 'Último mes',
    window: '16 de febrero – 15 de marzo',
    orders: 187,
    delivered: 183,
    cancelled: 4,
    onTimeRate: 94,
    rating: 4.7,
    distanceKm: 806,
    hours: 226,
    tips: 184500,
    base: 2_450_000,
    trend: 8.1,
    comparison: 'frente al mes anterior',
  },
]

export type CourierDayPoint = {
  date: string
  weekday: string
  orders: number
}

// Serie diaria de la quincena: alimenta el bloque de barras del resumen.
export const courierDailySeries: CourierDayPoint[] = [
  { date: '1', weekday: 'Do', orders: 5 },
  { date: '2', weekday: 'Lu', orders: 7 },
  { date: '3', weekday: 'Ma', orders: 6 },
  { date: '4', weekday: 'Mi', orders: 8 },
  { date: '5', weekday: 'Ju', orders: 6 },
  { date: '6', weekday: 'Vi', orders: 9 },
  { date: '7', weekday: 'Sá', orders: 4 },
  { date: '8', weekday: 'Do', orders: 3 },
  { date: '9', weekday: 'Lu', orders: 7 },
  { date: '10', weekday: 'Ma', orders: 6 },
  { date: '11', weekday: 'Mi', orders: 8 },
  { date: '12', weekday: 'Ju', orders: 7 },
  { date: '13', weekday: 'Vi', orders: 9 },
  { date: '14', weekday: 'Sá', orders: 5 },
  { date: '15', weekday: 'Do', orders: 6 },
]

export type CourierTaskKind = 'ruta' | 'pedido' | 'equipo'

export type CourierTask = {
  id: string
  label: string
  detail: string
  kind: CourierTaskKind
  done: boolean
}

// Resumen operativo del dia: lo unico que el domiciliario tiene que resolver
// antes de que se le asignen mas paradas.
export const courierTodayTasks: CourierTask[] = [
  {
    id: 'tk-01',
    label: 'Abrir turno y revisar ruta',
    detail: 'Ruta Norte · 4 paradas · 38 km',
    kind: 'ruta',
    done: true,
  },
  {
    id: 'tk-02',
    label: 'Entregar XP-2062 en Cafetería El Grano',
    detail: 'Recibido a las 08:12 · 2 paquetes',
    kind: 'pedido',
    done: true,
  },
  {
    id: 'tk-03',
    label: 'Confirmar recogida de XP-2066',
    detail: 'Lácteos Sabaneta · ventana 11:30 – 12:00',
    kind: 'pedido',
    done: false,
  },
  {
    id: 'tk-04',
    label: 'Reportar incidencia de tráfico',
    detail: 'Cra 33 congestionada en sentido sur',
    kind: 'ruta',
    done: false,
  },
  {
    id: 'tk-05',
    label: 'Renovar carnet de conductor',
    detail: 'Vence el 30 de abril · documentos en Mi cuenta',
    kind: 'equipo',
    done: false,
  },
  {
    id: 'tk-06',
    label: 'Revisar equipo de la moto',
    detail: 'Checklist de 4 puntos antes de salir',
    kind: 'equipo',
    done: true,
  },
]

export type CourierDeliveryStatus = 'Entregado' | 'En camino' | 'Pendiente'

export type CourierDelivery = {
  id: string
  ref: string
  pickup: string
  dropoff: string
  zone: string
  packages: number
  amount: number
  distanceKm: number
  minutes: number
  status: CourierDeliveryStatus
  relativeDay: string
  deliveredAt: string
  rating: number | null
}

// Historial completo: la cuenta del domiciliario nunca se limita al mes en
// curso, aqui queda el registro completo de lo que ha entregado.
export const courierHistory: CourierDelivery[] = [
  {
    id: 'XP-2062',
    ref: 'Lácteos Sabaneta · #4417',
    pickup: 'Lácteos Sabaneta',
    dropoff: 'Cafetería El Grano',
    zone: 'Provenza',
    packages: 2,
    amount: 184000,
    distanceKm: 6.4,
    minutes: 18,
    status: 'Entregado',
    relativeDay: 'Hoy',
    deliveredAt: '15 mar · 08:12',
    rating: 5,
  },
  {
    id: 'XP-2066',
    ref: 'Lácteos Sabaneta · #4421',
    pickup: 'Lácteos Sabaneta',
    dropoff: 'Hotel Bucaramanga Centro',
    zone: 'Centro',
    packages: 4,
    amount: 396000,
    distanceKm: 9.1,
    minutes: 27,
    status: 'En camino',
    relativeDay: 'Hoy',
    deliveredAt: '15 mar · en ruta',
    rating: null,
  },
  {
    id: 'XP-2068',
    ref: 'Lácteos Sabaneta · #4424',
    pickup: 'Lácteos Sabaneta',
    dropoff: 'Restaurante La Esquina',
    zone: 'Cabecera',
    packages: 3,
    amount: 268000,
    distanceKm: 7.8,
    minutes: 24,
    status: 'Pendiente',
    relativeDay: 'Hoy',
    deliveredAt: '15 mar · 12:40',
    rating: null,
  },
  {
    id: 'XP-2054',
    ref: 'Distribuidora El Palmar · #4392',
    pickup: 'Distribuidora El Palmar',
    dropoff: 'Restaurante Sabor Criollo',
    zone: 'Kennedy',
    packages: 5,
    amount: 512000,
    distanceKm: 12.3,
    minutes: 38,
    status: 'Entregado',
    relativeDay: 'Ayer',
    deliveredAt: '14 mar · 17:02',
    rating: 4,
  },
  {
    id: 'XP-2049',
    ref: 'Huerta La Candelaria · #4381',
    pickup: 'Huerta La Candelaria',
    dropoff: 'Café Aromático',
    zone: 'Kennedy',
    packages: 2,
    amount: 96000,
    distanceKm: 5.2,
    minutes: 15,
    status: 'Entregado',
    relativeDay: 'Ayer',
    deliveredAt: '14 mar · 11:36',
    rating: 5,
  },
  {
    id: 'XP-2041',
    ref: 'Distribuidora El Palmar · #4364',
    pickup: 'Distribuidora El Palmar',
    dropoff: 'Restaurante La Esquina',
    zone: 'Cabecera',
    packages: 6,
    amount: 604000,
    distanceKm: 11.7,
    minutes: 34,
    status: 'Entregado',
    relativeDay: '13 mar',
    deliveredAt: '13 mar · 15:48',
    rating: 5,
  },
  {
    id: 'XP-2033',
    ref: 'Huerta La Candelaria · #4347',
    pickup: 'Huerta La Candelaria',
    dropoff: 'Restaurante Sabores del Valle',
    zone: 'Provenza',
    packages: 1,
    amount: 74000,
    distanceKm: 4.6,
    minutes: 13,
    status: 'Entregado',
    relativeDay: '12 mar',
    deliveredAt: '12 mar · 09:20',
    rating: 4,
  },
  {
    id: 'XP-2027',
    ref: 'Comercial Andina · #4329',
    pickup: 'Comercial Andina',
    dropoff: 'Hotel Bucaramanga Centro',
    zone: 'Centro',
    packages: 7,
    amount: 728000,
    distanceKm: 14.2,
    minutes: 41,
    status: 'Entregado',
    relativeDay: '11 mar',
    deliveredAt: '11 mar · 18:05',
    rating: 5,
  },
  {
    id: 'XP-2018',
    ref: 'Distribuidora El Palmar · #4305',
    pickup: 'Distribuidora El Palmar',
    dropoff: 'Cafetería El Grano',
    zone: 'Provenza',
    packages: 3,
    amount: 214000,
    distanceKm: 6.9,
    minutes: 21,
    status: 'Entregado',
    relativeDay: '10 mar',
    deliveredAt: '10 mar · 10:14',
    rating: 5,
  },
  {
    id: 'XP-2002',
    ref: 'Lácteos Sabaneta · #4281',
    pickup: 'Lácteos Sabaneta',
    dropoff: 'Restaurante La Esquina',
    zone: 'Cabecera',
    packages: 2,
    amount: 158000,
    distanceKm: 7.4,
    minutes: 22,
    status: 'Entregado',
    relativeDay: '8 mar',
    deliveredAt: '8 mar · 12:30',
    rating: 4,
  },
]

export type CourierStopStatus = 'Recogido' | 'En camino' | 'Entregado' | 'Pendiente'

export type CourierStop = {
  id: string
  ref: string
  label: string
  address: string
  window: string
  packages: number
  status: CourierStopStatus
  x: number
  y: number
}

export type CourierRoute = {
  id: string
  name: string
  day: string
  shift: string
  distanceKm: number
  stops: CourierStop[]
}

export const courierRoutes: CourierRoute[] = [
  {
    id: 'r-01',
    name: 'Ruta Norte',
    day: 'Lunes 17 de marzo',
    shift: '07:30 – 13:00',
    distanceKm: 38,
    stops: [
      {
        id: 'st-01',
        ref: 'XP-2061',
        label: 'Lácteos Sabaneta',
        address: 'Cra 33 #104-20 · Sabaneta',
        window: '07:30',
        packages: 8,
        status: 'Recogido',
        x: 24,
        y: 76,
      },
      {
        id: 'st-02',
        ref: 'XP-2062',
        label: 'Cafetería El Grano',
        address: 'Cll 60 #12-45 · Provenza',
        window: '08:00 – 08:30',
        packages: 2,
        status: 'Entregado',
        x: 31,
        y: 55,
      },
      {
        id: 'st-03',
        ref: 'XP-2066',
        label: 'Hotel Bucaramanga Centro',
        address: 'Cra 15 #32-10 · Centro',
        window: '11:30 – 12:00',
        packages: 4,
        status: 'En camino',
        x: 45,
        y: 37,
      },
      {
        id: 'st-04',
        ref: 'XP-2068',
        label: 'Restaurante La Esquina',
        address: 'Cll 48 #33-18 · Cabecera',
        window: '12:30 – 13:00',
        packages: 3,
        status: 'Pendiente',
        x: 39,
        y: 20,
      },
    ],
  },
  {
    id: 'r-02',
    name: 'Ruta Centro',
    day: 'Lunes 17 de marzo · Tarde',
    shift: '14:00 – 19:00',
    distanceKm: 52,
    stops: [
      {
        id: 'st-05',
        ref: 'XP-2065',
        label: 'Distribuidora El Palmar',
        address: 'Cra 19 #45-12 · Centro',
        window: '14:00',
        packages: 10,
        status: 'Recogido',
        x: 52,
        y: 44,
      },
      {
        id: 'st-06',
        ref: 'XP-2070',
        label: 'Café Aromático',
        address: 'Cll 45 #18-09 · Kennedy',
        window: '15:30 – 16:00',
        packages: 3,
        status: 'Pendiente',
        x: 14,
        y: 30,
      },
      {
        id: 'st-07',
        ref: 'XP-2074',
        label: 'Restaurante Sabores del Valle',
        address: 'Cll 70 #22-41 · Provenza',
        window: '17:00 – 17:30',
        packages: 5,
        status: 'Pendiente',
        x: 63,
        y: 62,
      },
      {
        id: 'st-08',
        ref: 'XP-2079',
        label: 'Hotel Boutique Saya',
        address: 'Cll 33 #12-88 · Cabecera',
        window: '18:00 – 18:30',
        packages: 2,
        status: 'Pendiente',
        x: 78,
        y: 24,
      },
    ],
  },
]

// Datos operativos de la cuenta: lo que no vive en el registro del usuario.
// La identidad (nombre, documento, telefono y zona) sale siempre de la sesion,
// asi que cualquier cuenta con rol domiciliario ve su propio panel.
export const courierProfile = {
  vehicle: 'Moto modelo 2022 · placa WDK-482',
  rating: 4.8,
  reviews: 412,
  since: 'En Xupply desde enero de 2024',
} as const
