export const gastronomicTypes = [
  { value: 'colombiana', label: 'Colombiana' },
  { value: 'mexicana', label: 'Mexicana' },
  { value: 'italiana', label: 'Italiana' },
  { value: 'asiatica', label: 'Asiática' },
  { value: 'arabe', label: 'Árabe' },
  { value: 'parrilla', label: 'Parrilla y asados' },
  { value: 'mariscos', label: 'Mariscos y pescado' },
  { value: 'fast-food', label: 'Fast food' },
  { value: 'cafeteria', label: 'Cafetería y panadería' },
  { value: 'vegetariana', label: 'Vegetariana y vegana' },
] as const

export type RegisterAccountType = 'restaurante' | 'proveedor'

export const registerAccountTypes = [
  {
    value: 'restaurante' as const,
    label: 'Restaurante',
    icon: 'XpStore',
    description:
      'Compara precios, arma pedidos por lotes y recibe en la puerta de tu cocina.',
  },
  {
    value: 'proveedor' as const,
    label: 'Proveedor',
    icon: 'XpPackage',
    description:
      'Publica tu catálogo mayorista y llega a los restaurantes de Bucaramanga que compran cada semana.',
  },
] as const

export const registerBenefits: Record<RegisterAccountType, string[]> = {
  restaurante: [
    'Catálogo mayorista con precios reales por kilo, caja o unidad',
    'Pedidos agrupados por proveedor y seguimiento de cada entrega',
    'Inventario, facturación y contabilidad dentro de tu panel',
    'Xupply IA para revisar tu food cost y armedar compras',
  ],
  proveedor: [
    'Publica tu catálogo una vez y actualiza el stock cuando quieras',
    'Define mínimos, zonas de cobertura y ventanas de despacho',
    'Recibe pedidos de restaurantes de Bucaramanga y el área metropolitana',
    'Comisiones y liquidaciones claras por cada venta',
  ],
}
