export const stats = [
  { value: '320+', label: 'restaurantes conectados' },
  { value: '1.450', label: 'productos en catálogo' },
  { value: '48', label: 'proveedores verificados' },
  { value: '24 h', label: 'entregas en el área metropolitana' },
] as const

export const modules = [
  {
    icon: 'XpBoxes',
    title: 'Inventario',
    href: '#inventario',
    description:
      'Entradas, salidas, mínimos y máximos por insumo. Alertas antes de quedarte sin producto.',
  },
  {
    icon: 'XpReceipt',
    title: 'Facturación DIAN',
    href: '#facturacion',
    description:
      'Factura electrónica por cada orden, con IVA e impoconsumo calculados y listos para enviar.',
  },
  {
    icon: 'XpBarChart3',
    title: 'Contabilidad',
    href: '#contabilidad',
    description:
      'Ingresos, egresos y flujo de caja del negocio en un reporte que tu contador entiende.',
  },
  {
    icon: 'XpNavigation',
    title: 'Logística GPS',
    href: '#logistica',
    description:
      'Rutero asignado, hora estimada y ubicación en vivo del domiciliario hasta tu puerta.',
  },
  {
    icon: 'XpBot',
    title: 'Xupply IA',
    href: '#xupply-ia',
    description:
      'Food cost, compras y clima del negocio explicados en lenguaje llano, todos los días.',
  },
  {
    icon: 'XpUsers',
    title: 'Equipo y roles',
    href: '#equipo',
    description:
      'Administradores, gerentes, empleados, proveedores y domiciliarios con permisos claros.',
  },
] as const
