import type { DemoRole } from './users'

export type AdminRole = 'admin' | 'gerente' | 'empleado'

export const adminRoleLabels: Record<AdminRole, string> = {
  admin: 'Administrador',
  gerente: 'Gerente',
  empleado: 'Empleado',
}

type RolePermissionRow = {
  label: string
  hint: string
  admin: boolean
  gerente: boolean
  empleado: boolean
}

export const rolePermissions: RolePermissionRow[] = [
  {
    label: 'Ver precios mayoristas',
    hint: 'Catálogo con el precio de cada proveedor',
    admin: true,
    gerente: true,
    empleado: true,
  },
  {
    label: 'Crear y enviar pedidos',
    hint: 'Arma el pedido y lo confirma al proveedor',
    admin: true,
    gerente: true,
    empleado: true,
  },
  {
    label: 'Editar inventario y ROP',
    hint: 'Ajusta existencias, mínimos y punto de pedido',
    admin: true,
    gerente: true,
    empleado: false,
  },
  {
    label: 'Ver facturación y contabilidad',
    hint: 'Facturas, IVA, ingresos y egresos',
    admin: true,
    gerente: true,
    empleado: false,
  },
  {
    label: 'Gestionar equipo y usuarios',
    hint: 'Invita, edita, cambia roles y despide',
    admin: true,
    gerente: false,
    empleado: false,
  },
  {
    label: 'Configurar el restaurante',
    hint: 'Datos del negocio, horarios y clasificación',
    admin: true,
    gerente: false,
    empleado: false,
  },
]

// Solo los roles que manejan las compras ven el historial de productos
// comprados y la lista de proveedores con los que ya se ha pedido.
const purchaseRoles: DemoRole[] = ['admin', 'gerente']

export const canSeePurchases = (role: DemoRole | undefined) =>
  role !== undefined && purchaseRoles.includes(role)

// Cada seccion de la aplicacion es una capacidad. El menu, el carrito y el
// guard de rutas consultan esta tabla, asi un rol nunca ve un enlace que no
// puede abrir.
export type Capability =
  | 'panel'
  | 'rutas'
  | 'carrito'
  | 'pedidos'
  | 'catalogo'
  | 'proveedores'
  | 'inventario'
  | 'facturacion'
  | 'contabilidad'
  | 'logistica'
  | 'xupply-ia'
  | 'equipo'
  | 'planes'

const ACCOUNT_CAPABILITIES: Capability[] = [
  'panel',
  'carrito',
  'pedidos',
  'catalogo',
  'proveedores',
  'inventario',
  'facturacion',
  'contabilidad',
  'logistica',
  'xupply-ia',
  'equipo',
  'planes',
]

// El domiciliario solo trabaja su ruta: ni productos, ni proveedores, ni
// carrito. 'rutas' es suya, y por eso ningun otro rol la lista en su menu.
const COURIER_CAPABILITIES: Capability[] = ['panel', 'rutas']

const roleCapabilities: Record<DemoRole, Capability[]> = {
  admin: ACCOUNT_CAPABILITIES,
  // Los paneles de gerente y empleado llegan en su propia iteracion, asi que
  // por ahora conservan exactamente la navegacion que ya tenian.
  gerente: ACCOUNT_CAPABILITIES,
  empleado: ACCOUNT_CAPABILITIES,
  // El proveedor suma el centro de solicitudes de domicilio a su seccion de
  // proveedores; el resto de su menu no cambia todavia.
  proveedor: ACCOUNT_CAPABILITIES,
  domiciliario: COURIER_CAPABILITIES,
}

// Los roles que ya tienen panel propio entran por el, no por la landing.
export const panelRoles: DemoRole[] = ['admin', 'proveedor', 'domiciliario']

export const can = (role: DemoRole | undefined, capability: Capability) =>
  role !== undefined && roleCapabilities[role].includes(capability)
