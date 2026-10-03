export type DeliveryStatus = 'En camino' | 'En preparación' | 'Entregado'

type Delivery = {
  id: string
  supplier: string
  destination: string
  driver: string
  eta: string
  progress: number
  status: DeliveryStatus
}

export const deliveries: Delivery[] = [
  {
    id: 'XP-2041',
    supplier: 'Distribuidora El Palmar',
    destination: 'Restaurante La Esquina · Cabecera',
    driver: 'Julián Castaño',
    eta: '12 min',
    progress: 78,
    status: 'En camino',
  },
  {
    id: 'XP-2038',
    supplier: 'Huerta La Candelaria',
    destination: 'Hotel Bucaramanga Centro · Centro',
    driver: 'Julián Castaño',
    eta: '38 min',
    progress: 45,
    status: 'En camino',
  },
  {
    id: 'XP-2035',
    supplier: 'Lácteos Sabaneta',
    destination: 'Cafetería El Grano · Sabaneta',
    driver: 'Sara Oñate',
    eta: '1 h 05 min',
    progress: 18,
    status: 'En preparación',
  },
  {
    id: 'XP-2027',
    supplier: 'Comercial Andina',
    destination: 'Restaurante Sabor Criollo · Kennedy',
    driver: 'Sara Oñate',
    eta: 'entregado',
    progress: 100,
    status: 'Entregado',
  },
]
