import {
  XpBarChart3,
  XpBoxes,
  XpClipboardList,
  XpNavigation,
  XpPackage,
  XpReceipt,
  XpSearch,
  XpSettings,
  XpSparkles,
  XpStore,
  XpTruck,
} from '@/components/icons'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'

// Mockup estatico del panel: no consulta nada, solo muestra la forma que tiene
// el producto para que la portada se lea como una aplicacion y no como una
// pagina de marketing. Los numeros salen de data/orders.ts.
const kpis = [
  { label: 'Pedidos del mes', value: '184', delta: '+12%', icon: XpClipboardList, bars: true },
  { label: 'Valor despachado', value: '$48,2 M', delta: '+8%', icon: XpBarChart3, bars: false },
  { label: 'Tiempo de entrega', value: '3 h 12 m', delta: '-24 min', icon: XpTruck, bars: false },
] as const

const rows = [
  { id: 'XP-2051', supplier: 'Distribuidora El Palmar', items: 9, total: 1284600, status: 'En camino' },
  { id: 'XP-2050', supplier: 'Huerta La Candelaria', items: 6, total: 742300, status: 'Confirmada' },
  { id: 'XP-2049', supplier: 'Lácteos La Pradera', items: 4, total: 486900, status: 'En preparación' },
] as const

const statusStyles: Record<string, string> = {
  'En camino': 'bg-brand-soft text-brand border-brand/25',
  Confirmada: 'bg-muted text-muted-foreground border-border',
  'En preparación': 'bg-clay/12 text-clay border-clay/30',
}

const navIcons = [XpBoxes, XpClipboardList, XpPackage, XpTruck, XpReceipt, XpBarChart3, XpSettings] as const

export function ProductPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'border-border bg-card overflow-hidden rounded-xl border shadow-[0_28px_70px_-30px_oklch(0.35_0.14_246/0.45)]',
        className,
      )}
    >
      {/* Barra de la ventana: hace que el bloque se lea como una app abierta. */}
      <div className="border-border bg-muted/50 flex items-center gap-3 border-b px-4 py-3">
        <span className="flex items-center gap-1.5">
          <span className="bg-destructive/70 size-2.5 rounded-[3px]" />
          <span className="bg-clay/70 size-2.5 rounded-[3px]" />
          <span className="bg-fresh/70 size-2.5 rounded-[3px]" />
        </span>
        <span className="border-border bg-background text-muted-foreground hidden min-w-0 flex-1 items-center gap-2 rounded-md border px-3 py-1 text-[11px] sm:flex">
          <XpStore size={12} className="shrink-0" />
          <span className="truncate font-mono">app.xupply.co/panel/pedidos</span>
        </span>
        <span className="bg-brand-soft text-brand inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold">
          <span className="bg-brand animate-halo size-1.5 rounded-[2px]" />
          En vivo
        </span>
      </div>

      <div className="flex">
        {/* Barra lateral: solo en pantallas grandes, como un panel real. */}
        <aside className="border-border bg-muted/40 hidden w-14 shrink-0 flex-col items-center gap-1.5 border-r py-4 lg:flex">
          <span className="bg-brand mb-2 inline-flex size-8 items-center justify-center rounded-md text-white">
            <XpStore size={16} />
          </span>
          {navIcons.map((Icon, index) => (
            <span
              key={index}
              className={cn(
                'text-muted-foreground/70 inline-flex size-9 items-center justify-center rounded-md',
                index === 1 && 'bg-brand-soft text-brand',
              )}
            >
              <Icon size={17} />
            </span>
          ))}
        </aside>

        <div className="min-w-0 flex-1">
          {/* Encabezado del panel */}
          <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Pedidos de hoy</p>
                <p className="text-muted-foreground text-[11px]">Bucaramanga · 3 proveedores</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="border-border bg-background text-muted-foreground inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[11px]">
                <XpSearch size={12} />
                <span className="hidden sm:inline">Buscar</span>
              </span>
              <span className="bg-brand inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold text-white">
                <XpSparkles size={12} />
                Nuevo pedido
              </span>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-card relative overflow-hidden px-4 py-3.5">
                <div className="text-muted-foreground flex items-center gap-2 text-[11px] font-medium">
                  <kpi.icon size={13} className="text-brand" />
                  {kpi.label}
                </div>
                <div className="mt-1.5 flex items-end justify-between gap-2">
                  <span className="font-heading text-lg leading-none font-semibold tabular-nums">
                    {kpi.value}
                  </span>
                  <span className="text-fresh text-[11px] font-semibold tabular-nums">{kpi.delta}</span>
                </div>
                {kpi.bars ? (
                  <div className="mt-3 flex h-7 items-end gap-1" aria-hidden>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                      <span
                        key={index}
                        className={cn(
                          'bg-brand/35 w-full rounded-[2px]',
                          index % 3 === 0 && 'animate-bar-1',
                          index % 3 === 1 && 'animate-bar-2',
                          index % 3 === 2 && 'animate-bar-3',
                        )}
                        style={{ height: '46%' }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Tabla de pedidos */}
          <div className="border-border border-t">
            <div className="text-muted-foreground grid grid-cols-[1.6fr_1fr_auto] items-center gap-3 border-b px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase sm:grid-cols-[1.8fr_1fr_1fr_auto]">
              <span>Proveedor</span>
              <span className="hidden sm:inline">Pedido</span>
              <span className="hidden sm:inline">Total</span>
              <span>Estado</span>
            </div>
            <ul>
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="border-border/70 hover:bg-muted/40 grid grid-cols-[1.6fr_1fr_auto] items-center gap-3 border-b px-4 py-2.5 text-xs transition-colors last:border-b-0 sm:grid-cols-[1.8fr_1fr_1fr_auto]"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="bg-brand-soft text-brand inline-flex size-7 shrink-0 items-center justify-center rounded-md">
                      <XpStore size={13} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{row.supplier}</span>
                      <span className="text-muted-foreground block text-[11px]">{row.items} productos</span>
                    </span>
                  </span>
                  <span className="text-muted-foreground hidden font-mono text-[11px] sm:inline">
                    {row.id}
                  </span>
                  <span className="hidden font-medium tabular-nums sm:inline">
                    {formatCurrency(row.total)}
                  </span>
                  <span
                    className={cn(
                      'inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium whitespace-nowrap',
                      statusStyles[row.status],
                    )}
                  >
                    {row.status === 'En camino' ? (
                      <span className="bg-brand animate-halo size-1.5 rounded-[2px]" />
                    ) : null}
                    {row.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ruta activa */}
          <div className="border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
            <span className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium">
              <XpNavigation size={13} className="text-brand" />
              Ruta #R-118 · GPS en vivo
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-muted relative h-1.5 w-28 overflow-hidden rounded-[3px]">
                <span className="bg-fresh animate-sweep absolute inset-y-0 w-1/3 rounded-[3px]" />
              </span>
              <span className="text-muted-foreground text-[11px] tabular-nums">68%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
