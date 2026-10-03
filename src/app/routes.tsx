import type { ComponentType } from 'react'

import { MyAccount } from '@/pages/account'
import { Accounting } from '@/pages/accounting'
import { Administration } from '@/pages/administration'
import { Cart } from '@/pages/cart'
import { Catalog } from '@/pages/catalog'
import { CourierRoutes } from '@/pages/courier-routes'
import { Home } from '@/pages/home'
import { Inventory } from '@/pages/inventory'
import { Invoices } from '@/pages/invoices'
import { Logistics } from '@/pages/logistics'
import { OrderSummary } from '@/pages/order-summary'
import { Plans } from '@/pages/plans'
import { SignIn } from '@/pages/sign-in'
import { Stores } from '@/pages/stores'
import { Team } from '@/pages/team'
import { XupplyIa } from '@/pages/xupply-ia'
import type { Capability } from '@/data/permissions'

// El index original declara un id por seccion, y algunas son hijas de otra
// (#registro vive dentro de #acceso). Aqui cada hash se resuelve a la ruta que
// corresponde para que ningun enlace quede en pantalla en blanco.
export const DEFAULT_ROUTE = '#inicio'

const ROUTES: Record<string, string> = {
  '': DEFAULT_ROUTE,
  '#inicio': DEFAULT_ROUTE,
  '#panel': '#panel',
  '#rutas': '#rutas',
  '#administracion': '#administracion',
  '#catalogo': '#catalogo',
  '#pedidos': '#pedidos',
  '#inventario': '#inventario',
  '#facturacion': '#facturacion',
  '#contabilidad': '#contabilidad',
  '#proveedores': '#proveedores',
  '#logistica': '#logistica',
  '#xupply-ia': '#xupply-ia',
  '#equipo': '#equipo',
  '#planes': '#planes',
  '#carrito': '#carrito',
  '#acceso': '#acceso',
  '#registro': '#acceso',
}

export const resolveHash = (hash: string) => ROUTES[hash.toLowerCase()] ?? DEFAULT_ROUTE

// Cada hash resoluelto tiene exactamente una pantalla. La tabla y el mapa estan
// separados a proposito: la tabla decide a donde navega un enlace y el mapa que
// se pinta, asi ninguna ruta puede quedar sin componente.
export const ROUTE_COMPONENTS: Record<string, ComponentType> = {
  '#inicio': Home,
  '#panel': MyAccount,
  '#rutas': CourierRoutes,
  '#administracion': Administration,
  '#catalogo': Catalog,
  '#pedidos': OrderSummary,
  '#inventario': Inventory,
  '#facturacion': Invoices,
  '#contabilidad': Accounting,
  '#proveedores': Stores,
  '#logistica': Logistics,
  '#xupply-ia': XupplyIa,
  '#equipo': Team,
  '#planes': Plans,
  '#carrito': Cart,
  '#acceso': SignIn,
}

// Que capacidad exige cada ruta. El guard de la app revisa esta tabla antes de
// pintar la pantalla, asi escribir un hash a mano no abre una seccion que el
// rol no tiene. #inicio y #acceso son publicas y no aparece aqui.
export const ROUTE_CAPABILITIES: Record<string, Capability> = {
  '#panel': 'panel',
  '#rutas': 'rutas',
  '#administracion': 'equipo',
  '#catalogo': 'catalogo',
  '#pedidos': 'pedidos',
  '#inventario': 'inventario',
  '#facturacion': 'facturacion',
  '#contabilidad': 'contabilidad',
  '#proveedores': 'proveedores',
  '#logistica': 'logistica',
  '#xupply-ia': 'xupply-ia',
  '#equipo': 'equipo',
  '#planes': 'planes',
  '#carrito': 'carrito',
}

export const routeCapability = (route: string) => ROUTE_CAPABILITIES[route]
