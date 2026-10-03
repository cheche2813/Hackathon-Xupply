import {
  XpAward,
  XpBarChart3,
  XpClock,
  XpHeadset,
  XpLayers,
  XpMapPin,
  XpPackage,
  XpPhone,
  XpShieldCheck,
  XpShoppingCart,
  XpSparkles,
  XpStore,
  XpTruck,
  XpUsers,
} from '@/components/icons'
import { Brand } from '@/components/shared/brand'

const assurances = [
  { icon: XpShieldCheck, label: 'Proveedores verificados' },
  { icon: XpTruck, label: 'Entregas en 24 h' },
  { icon: XpClock, label: 'Soporte 7 días' },
]

const columns = [
  {
    title: 'Producto',
    links: [
      { label: 'Catálogo mayorista', icon: XpLayers, href: '#catalogo' },
      { label: 'Carrito', icon: XpShoppingCart, href: '#carrito' },
      { label: 'Inventario', icon: XpPackage, href: '#inventario' },
      { label: 'Facturación', icon: XpAward, href: '#facturacion' },
      { label: 'Contabilidad', icon: XpBarChart3, href: '#contabilidad' },
      { label: 'Logística GPS', icon: XpMapPin, href: '#logistica' },
      { label: 'Xupply IA', icon: XpSparkles, href: '#xupply-ia' },
    ],
  },
  {
    title: 'Negocios',
    links: [
      { label: 'Restaurantes', icon: XpStore, href: '#inicio' },
      { label: 'Proveedores', icon: XpPackage, href: '#proveedores' },
      { label: 'Equipo y roles', icon: XpUsers, href: '#equipo' },
      { label: 'Planes y precios', icon: XpAward, href: '#planes' },
      { label: 'Soporte', icon: XpHeadset, href: '#inicio' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer id="pie" className="border-border bg-card border-t">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="flex flex-col gap-5">
          <Brand />
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            La plataforma que conecta restaurantes y proveedores de alimentos en Bucaramanga.
            Catálogo, pedidos, logística y facturación en un solo lugar.
          </p>
          <ul className="border-border divide-border divide-y border-y">
            {assurances.map((item) => (
              <li
                key={item.label}
                className="text-muted-foreground flex items-center gap-2.5 py-2.5 text-sm"
              >
                <item.icon size={16} className="text-fresh shrink-0" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-4">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
              {column.title}
            </h3>
            <ul className="flex flex-col gap-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                  >
                    <link.icon size={15} className="opacity-60" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col gap-4">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
            Contacto
          </h3>
          <address className="text-muted-foreground flex flex-col gap-1 text-sm not-italic">
            <a
              href="mailto:contacto@xupply.co"
              className="hover:bg-muted hover:text-foreground rounded-md px-2 py-1.5 transition-colors"
            >
              contacto@xupply.co
            </a>
            <span className="inline-flex items-center gap-2 px-2 py-1.5">
              <XpMapPin size={15} className="opacity-60" />
              Calle 36 # 27-14, Bucaramanga
            </span>
            <span className="inline-flex items-center gap-2 px-2 py-1.5">
              <XpPhone size={15} className="opacity-60" />
              +57 607 123 4567
            </span>
          </address>
        </div>
      </div>

      <div className="border-border bg-muted/40">
        <div className="container-page text-muted-foreground flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Xupply. Todos los derechos reservados.</p>
          <p>Términos · Privacidad · Datos DIAN</p>
        </div>
      </div>
    </footer>
  )
}
