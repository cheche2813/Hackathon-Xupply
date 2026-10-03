import { toast } from 'sonner'

import {
  XpArrowRight,
  XpBoxes,
  XpBuilding2,
  XpCircleAlert,
  XpCircleCheck,
  XpCircleDollarSign,
  XpDownload,
  XpPackage,
  XpPercent,
  XpReceipt,
  XpShieldCheck,
  XpShoppingCart,
  XpStore,
  XpTrendingDown,
  XpTrendingUp,
  XpTruck,
  XpUsers,
  XpWallet,
  XpZap,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/auth'
import { useCart } from '@/contexts/cart'
import { criticalStock, monthInvestment, operationalKpis } from '@/data/inventory'
import { formatCurrency } from '@/lib/format'
import { recentOrders, type OrderStatus } from '@/data/orders'

const kpiIcons = {
  XpShoppingCart,
  XpCircleDollarSign,
  XpPercent,
  XpTruck,
  XpWallet,
  XpBoxes,
} as const

const orderStatusVariants: Record<OrderStatus, 'default' | 'secondary' | 'outline'> = {
  Confirmada: 'secondary',
  'En preparación': 'secondary',
  'En camino': 'default',
  Entregada: 'outline',
  Facturada: 'outline',
}

const firstName = (name: string) => name.split(' ')[0]

export function AdminDashboard() {
  const { user } = useAuth()
  const { count } = useCart()

  if (!user) return null

  const suggestedTotal = criticalStock.reduce(
    (total, item) => total + item.suggestedQty * item.unitCost,
    0,
  )
  const investmentDelta =
    ((monthInvestment.total - monthInvestment.previous) / monthInvestment.previous) * 100
  const budgetUsage = (monthInvestment.total / monthInvestment.budget) * 100

  const handleExport = () => {
    toast.success('Reporte en preparación', {
      description: 'Te enviamos el resumen del mes a tu correo en unos minutos.',
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        align="left"
        eyebrow="Panel de administración"
        title={`Hola, ${firstName(user.name)}`}
        description={`Aquí tienes el pulso de ${user.businessName ?? 'tu restaurante'}: ventas, insumos por reponer, inversión y el equipo que sostiene la operación.`}
      >
        <div className="flex flex-wrap items-center justify-start gap-2">
          <Badge className="gap-1.5">
            <XpShieldCheck size={13} />
            {user.roleLabel}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <XpBuilding2 size={13} />
            {user.businessName ?? 'Cuenta personal'}
          </Badge>
        </div>
      </SectionHeading>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="brand" data-icon="inline-end">
          <a href="#catalogo">
            <XpShoppingCart size={17} />
            Armar pedido
            <XpArrowRight size={17} />
          </a>
        </Button>
        <Button asChild variant="outline" data-icon="inline-start">
          <a href="#inventario">
            <XpBoxes size={17} />
            Ver inventario
          </a>
        </Button>
        <Button variant="outline" onClick={handleExport} data-icon="inline-start">
          <XpDownload size={17} />
          Exportar reporte
        </Button>
        <Button asChild variant="ghost" data-icon="inline-start">
          <a href="#administracion">
            <XpUsers size={17} />
            Administración
          </a>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase">Resumen operativo</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {operationalKpis.map((kpi) => {
            const Icon = kpiIcons[kpi.icon as keyof typeof kpiIcons] ?? XpZap
            const Trend = kpi.trend === 'down' ? XpTrendingDown : XpTrendingUp

            return (
              <Card key={kpi.label} size="sm">
                <CardContent className="flex items-start gap-3">
                  <span className="bg-brand-soft text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <Icon size={18} />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-muted-foreground text-xs">{kpi.label}</span>
                    <span className="font-heading text-2xl leading-none font-semibold tracking-tight">
                      {kpi.value}
                    </span>
                    <span className="text-muted-foreground text-xs">{kpi.hint}</span>
                    <span
                      className={
                        'flex items-center gap-1 text-xs font-medium ' +
                        (kpi.trend === 'down' ? 'text-fresh' : 'text-muted-foreground')
                      }
                    >
                      {kpi.trend === 'flat' ? null : (
                        <Trend size={13} className={kpi.trend === 'down' ? 'text-fresh' : 'text-brand'} />
                      )}
                      {kpi.delta}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Card id="stock-critico" className="gap-0 border-clay/40">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="flex items-center gap-2">
                  <XpCircleAlert size={18} className="text-clay" />
                  Stock crítico (ROP)
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {criticalStock.length} insumos quedaron por debajo de su punto de pedido. Requieren
                  orden de compra pronto.
                </p>
              </div>
              <Badge className="gap-1.5">
                <XpZap size={13} />
                Acción hoy
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul id="lista-stock-critico" className="flex flex-col gap-4">
              {criticalStock.map((item) => (
                <li
                  key={item.id}
                  className="border-border/70 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="from-brand-soft to-muted flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-xl"
                    >
                      {item.emoji}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold">{item.input}</span>
                      <span className="text-muted-foreground text-xs">
                        {item.supplier} · {item.category}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Consume {item.dailyUsage} {item.unit}/día · lead time {item.leadTimeDays}{' '}
                        días · ROP {item.reorderPoint} {item.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 sm:flex-col sm:items-end sm:gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-destructive text-sm font-semibold tabular-nums">
                          {item.stock} {item.unit}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {item.coverDays} días de cobertura
                        </span>
                      </div>
                      <div className="bg-muted flex h-10 w-24 items-end overflow-hidden rounded-lg">
                        <div
                          className="bg-clay h-full rounded-lg"
                          style={{ width: `${Math.min(100, (item.stock / item.reorderPoint) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-icon="inline-start">
                      <XpShoppingCart size={14} />
                      Pedir {item.suggestedQty} {item.unit}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-3">
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Orden sugerida completa</span>
              <span className="font-heading text-lg font-semibold tabular-nums">
                {formatCurrency(suggestedTotal)}
              </span>
            </div>
            <Button asChild variant="brand" data-icon="inline-end">
              <a href="#catalogo">
                Generar orden de compra de los {criticalStock.length} insumos
                <XpArrowRight size={17} />
              </a>
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XpWallet size={18} className="text-brand" />
                Inversión del mes
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Compras de insumos contra el presupuesto del trimestre.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
                    {formatCurrency(monthInvestment.total)}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <XpTrendingUp size={13} className="text-brand" />
                    +{investmentDelta.toFixed(1)}% frente al mes anterior
                  </span>
                </div>
                <Badge variant="secondary">{budgetUsage.toFixed(0)}% del presupuesto</Badge>
              </div>

              <div className="flex flex-col gap-3">
                {monthInvestment.byCategory.map((category) => (
                  <div key={category.label} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium">{category.label}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {formatCurrency(category.amount)} · {category.share}%
                      </span>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${category.share * 2.4}%`, backgroundColor: category.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex flex-col gap-2.5">
                <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Proveedores con más compra
                </span>
                {monthInvestment.bySupplier.map((supplier) => (
                  <div
                    key={supplier.label}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <XpStore size={14} className="text-brand shrink-0" />
                      <span className="truncate">{supplier.label}</span>
                    </span>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                      {supplier.orders} órdenes · {formatCurrency(supplier.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card id="ordenes-recientes" className="gap-0">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <XpReceipt size={18} className="text-brand" />
                Órdenes recientes
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Últimas compras enviadas a proveedores, con su estado de entrega.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" data-icon="inline-end">
              <a href="#pedidos">
                Ver resumen del carrito
                <XpArrowRight size={15} />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-3xl border-collapse text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border text-left text-xs tracking-wide uppercase">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Orden
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Proveedor
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Hecha
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Ítems
                  </th>
                  <th scope="col" className="py-3 pr-4 text-right font-semibold">
                    Total
                  </th>
                  <th scope="col" className="py-3 text-right font-semibold">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3.5 pr-4 font-medium">{order.id}</td>
                    <td className="text-muted-foreground py-3.5 pr-4">{order.supplier}</td>
                    <td className="text-muted-foreground py-3.5 pr-4">{order.placedAt}</td>
                    <td className="text-muted-foreground py-3.5 pr-4 tabular-nums">
                      {order.items}
                    </td>
                    <td className="py-3.5 pr-4 text-right font-medium tabular-nums">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3.5 text-right">
                      <Badge variant={orderStatusVariants[order.status]}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground flex-wrap items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <XpTruck size={13} />
            2 órdenes en camino y 1 en preparación
          </span>
          <span className="flex items-center gap-1.5">
            <XpPackage size={13} />
            {count} {count === 1 ? 'producto' : 'productos'} en el carrito
          </span>
        </CardFooter>
      </Card>

      <Card size="sm" className="border-brand/20 bg-brand-soft/30">
        <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <XpCircleCheck size={18} className="text-brand mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed">
              Todo lo que ves es una demostración con datos de ejemplo. Cuando la API esté activa,
              estas mismas pantallas consumen <span className="font-medium">/api/dashboard</span> y{' '}
              <span className="font-medium">/api/orders</span>. Los usuarios y roles viven en{' '}
              <a href="#administracion" className="text-brand font-medium underline underline-offset-4">
                Administración
              </a>
              .
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0" data-icon="inline-end">
            <a href="#administracion">
              Ir a Administración
              <XpArrowRight size={15} />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
