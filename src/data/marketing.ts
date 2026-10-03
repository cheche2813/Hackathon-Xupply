// El icono de cada paso no vive aqui: how-it-works.tsx resuelve el pictograma
// por indice desde un array propio para no acoplar los datos a components/.
export const steps = [
  {
    title: 'Publica o busca',
    description:
      'El restaurante publica lo que necesita y los proveedores suben su catálogo mayorista con precios, mínimos y tiempos de entrega.',
  },
  {
    title: 'Acuerda en un solo lugar',
    description:
      'Pedidos, cotizaciones y estados de inventario viven en el mismo panel. Sin llamadas sueltas ni archivos perdidos.',
  },
  {
    title: 'Recibe con seguimiento',
    description:
      'Rutero asignado y GPS en vivo. La factura electrónica se emite apenas se confirma la entrega.',
  },
] as const

export const audiences = [
  {
    id: 'restaurantes',
    eyebrow: 'Para restaurantes',
    icon: 'XpStore',
    title: 'Abastece tu cocina sin perder el día',
    description:
      'Compara precios reales, arma el pedido por lotes y recibe en la puerta de tu restaurante. Xupply te avisa qué se está agotando antes de que te falte.',
    points: [
      'Catálogo mayorista con precio por kilo, caja o unidad',
      'Alertas de stock crítico y sugerencias de compra',
      'Pedidos agrupados por proveedor en un solo pago',
      'Facturación electrónica DIAN sin salir de la plataforma',
    ],
    cta: 'Crear cuenta de restaurante',
  },
  {
    id: 'proveedores',
    eyebrow: 'Para proveedores',
    icon: 'XpPackage',
    title: 'Vende a toda la ciudad, no solo a un cliente',
    description:
      'Publica tu inventario una vez y llega a cientos de restaurantes que compran cada semana. Tú defines mínimos, zonas de cobertura y ventanas de despacho.',
    points: [
      'Tienda en línea lista para recibir pedidos 24/7',
      'Reglas de pedido mínimo y zonas de cobertura',
      'Panel de ventas, rutas y tiempos de despacho',
      'Reseñas verificadas de restaurantes que ya te compran',
      'Cobros, comisiones y liquidaciones automáticas',
    ],
    cta: 'Publicar mi catálogo',
  },
] as const

type Plan = {
  id: 'lite' | 'pro' | 'max'
  name: string
  tagline: string
  price: number
  period: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export const plans: Plan[] = [
  {
    id: 'lite',
    name: 'Xupply Lite',
    tagline: 'Para el restaurante que recién ordena su cocina',
    price: 89000,
    period: 'al mes',
    features: [
      'Catálogo mayorista de proveedores verificados',
      'Pedidos, carrito y facturas básicas',
      'Hasta 3 usuarios del equipo',
      'Soporte por correo en 48 horas',
    ],
    cta: 'Empezar gratis',
  },
  {
    id: 'pro',
    name: 'Xupply Pro',
    tagline: 'El plan que usa la mayoría de restaurantes',
    price: 179000,
    period: 'al mes',
    features: [
      'Todo lo de Lite, sin límite de pedidos',
      'Inventario, contabilidad y control de compras',
      'Seguimiento GPS en vivo de cada entrega',
      'Facturación electrónica DIAN ilimitada',
      'Soporte prioritario por WhatsApp',
    ],
    cta: 'Probar 14 días',
    highlighted: true,
  },
  {
    id: 'max',
    name: 'Xupply Max',
    tagline: 'Para proveedores con operación multi-bodega',
    price: 349000,
    period: 'al mes',
    features: [
      'Todo lo de Pro',
      'Tienda en línea y catálogo ilimitado',
      'Xupply IA sin límites y reportes automáticos',
      'Zonas de cobertura y reglas de pedido mínimo',
      'Ejecutivo de cuenta dedicado',
    ],
    cta: 'Hablar con un asesor',
  },
]
