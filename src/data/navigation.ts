import type { DemoRole } from './users'
import { can } from './permissions'

// El resumen del pedido (#pedidos) vive dentro del carrito, asi que no lo
// listamos como apartado propio del menu.
const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#catalogo' },
  { label: 'Proveedores', href: '#proveedores' },
  { label: 'Cuenta', href: '#panel' },
] as const

// El administrador entra directo a su panel: no ve la landing comercial.
const adminNavLinks = [
  { label: 'Cuenta', href: '#panel' },
  { label: 'Administración', href: '#administracion' },
  { label: 'Productos', href: '#catalogo' },
  { label: 'Proveedores', href: '#proveedores' },
] as const

// El domiciliario no compra ni vende: su menu es su cuenta y su mapa de ruta.
const courierNavLinks = [
  { label: 'Mi cuenta', href: '#panel' },
  { label: 'Mapa GPS y rutas', href: '#rutas' },
] as const

const menuSections = [
  { label: 'Panel', href: '#panel', capability: 'panel' },
  { label: 'Mapa GPS y rutas', href: '#rutas', capability: 'rutas' },
  { label: 'Catálogo', href: '#catalogo', capability: 'catalogo' },
  { label: 'Inventario', href: '#inventario', capability: 'inventario' },
  { label: 'Facturación', href: '#facturacion', capability: 'facturacion' },
  { label: 'Contabilidad', href: '#contabilidad', capability: 'contabilidad' },
  { label: 'Proveedores', href: '#proveedores', capability: 'proveedores' },
  { label: 'Logística', href: '#logistica', capability: 'logistica' },
  { label: 'Xupply IA', href: '#xupply-ia', capability: 'xupply-ia' },
  { label: 'Equipo', href: '#equipo', capability: 'equipo' },
  { label: 'Planes', href: '#planes', capability: 'planes' },
] as const

// Un solo lugar decide que menu ve cada rol. Sin sesion se muestra el menu
// comercial, igual que antes.
export const navLinksByRole = (role: DemoRole | undefined) => {
  if (role === 'admin') return adminNavLinks
  if (role === 'domiciliario') return courierNavLinks
  return navLinks
}

// "Todas las secciones" tambien se filtra por permisos: el domiciliario no
// debe encontrar productos ni proveedores listados ahi.
export const menuSectionsByRole = (role: DemoRole | undefined) =>
  menuSections.filter((section) => can(role, section.capability))
