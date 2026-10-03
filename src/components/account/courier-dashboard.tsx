import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  XpArrowRight,
  XpBarChart3,
  XpCircleCheck,
  XpClock,
  XpHistory,
  XpMapPin,
  XpNavigation,
  XpPackage,
  XpPhone,
  XpShieldCheck,
  XpStar,
  XpTruck,
  XpWallet,
  XpZap,
} from '@/components/icons'
import { CommandBar } from '@/components/interactions/command-bar'
import { Checklist } from '@/components/interactions/checklist'
import { InlineConfirm } from '@/components/interactions/inline-confirm'
import { ProgressTicks } from '@/components/interactions/progress-ticks'
import { PullToRefresh } from '@/components/interactions/pull-to-refresh'
import { SlideToConfirm } from '@/components/interactions/slide-to-confirm'
import { TiltCard } from '@/components/interactions/tilt-card'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/auth'
import {
  courierDailySeries,
  courierHistory,
  courierPeriods,
  courierProfile,
  courierTodayTasks,
  type CourierDeliveryStatus,
} from '@/data/courier'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

const periodMetrics = [
  { key: 'orders', label: 'Pedidos', hint: 'pedidos asignados' },
  { key: 'onTimeRate', label: 'Entregas a tiempo', hint: 'dentro de la ventana prometida' },
  { key: 'distanceKm', label: 'Kilómetros', hint: 'recorrido total' },
] as const

const statusVariants: Record<CourierDeliveryStatus, 'default' | 'secondary' | 'outline'> = {
  'En camino': 'default',
  Pendiente: 'secondary',
  Entregado: 'outline',
}

const historyFilters = [
  { id: 'todas', label: 'Todas' },
  { id: 'entregado', label: 'Entregados' },
  { id: 'activo', label: 'En ruta' },
] as const

const firstName = (name: string) => name.split(' ')[0]

// Panel del domiciliario: lo unico que ve de Xupply. Nada de productos,
// proveedores ni carrito, solo su operacion: resumen de pedidos por periodo,
// resumen operativo del dia e historial completo de entregas.
export function CourierDashboard() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<string>('todas')
  const [period, setPeriod] = useState(0)

  const activePeriod = courierPeriods[period] ?? courierPeriods[0]

  const filteredHistory = useMemo(() => {
    const term = query.trim().toLowerCase()

    return courierHistory.filter((delivery) => {
      const matchesFilter =
        filter === 'todas' ||
        (filter === 'entregado' && delivery.status === 'Entregado') ||
        (filter === 'activo' && delivery.status !== 'Entregado')

      if (!matchesFilter) return false
      if (!term) return true

      return [delivery.id, delivery.ref, delivery.pickup, delivery.dropoff, delivery.zone]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [filter, query])

  if (!user) return null

  const deliveredCount = courierHistory.filter((delivery) => delivery.status === 'Entregado').length
  const periodBase = activePeriod.base

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        align="left"
        eyebrow="Panel de domicilio"
        title={`Hola, ${firstName(user.name)}`}
        description="Tu día de entregas en un vistazo: pedidos de la quincena y del mes, lo que falta resolver hoy y el historial completo de lo que ya entregaste."
      >
        <div className="flex flex-wrap items-center justify-start gap-2">
          <Badge className="gap-1.5">
            <XpShieldCheck size={13} />
            {user.roleLabel}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <XpNavigation size={13} />
            {user.zone}
          </Badge>
        </div>
      </SectionHeading>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="brand" data-icon="inline-end">
          <a href="#rutas">
            <XpMapPin size={17} />
            Ver mapa y rutas
            <XpArrowRight size={17} />
          </a>
        </Button>
        <Button asChild variant="outline" data-icon="inline-start">
          <a href={`tel:${user.phone.replace(/\s/g, '')}`}>
            <XpPhone size={17} />
            Central de despacho
          </a>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase">
            Resumen de pedidos hechos
          </h2>
          <div className="bg-muted flex rounded-full p-1">
            {courierPeriods.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPeriod(index)}
                aria-pressed={index === period}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors',
                  index === period
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {periodMetrics.map((metric) => (
            <TiltCard key={metric.key}>
              <Card size="sm" className="h-full">
                <CardContent className="flex items-start gap-3">
                  <span className="bg-brand-soft text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
                    {metric.key === 'orders' ? (
                      <XpPackage size={18} />
                    ) : metric.key === 'onTimeRate' ? (
                      <XpCircleCheck size={18} />
                    ) : (
                      <XpTruck size={18} />
                    )}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-muted-foreground text-xs">{metric.label}</span>
                    <span className="font-heading text-2xl leading-none font-semibold tracking-tight tabular-nums">
                      {metric.key === 'onTimeRate'
                        ? `${activePeriod.onTimeRate}%`
                        : activePeriod[metric.key].toLocaleString('es-CO')}
                    </span>
                    <span className="text-muted-foreground text-xs">{metric.hint}</span>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          ))}

          <TiltCard>
            <Card size="sm" className="border-fresh/30 bg-fresh/10 h-full">
              <CardContent className="flex items-start gap-3">
                <span className="bg-fresh/20 text-fresh flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <XpWallet size={18} />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Base del periodo</span>
                  <span className="font-heading text-2xl leading-none font-semibold tracking-tight tabular-nums">
                    {formatCurrency(periodBase)}
                  </span>
                  <span className="text-fresh flex items-center gap-1 text-xs font-medium">
                    +{activePeriod.trend}% {activePeriod.comparison}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>
      </div>

      <Card className="gap-0">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <XpBarChart3 size={18} className="text-brand" />
                Entregas por día · {activePeriod.window}
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {courierDailySeries.reduce((total, day) => total + day.orders, 0)} pedidos en la
                quincena, con {activePeriod.delivered} entregados y {activePeriod.cancelled}{' '}
                cancelados.
              </p>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <XpStar size={13} />
              {activePeriod.rating} de 5 · {deliveredCount} entregas en el historial
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressTicks
            items={courierDailySeries.map((day) => ({
              label: day.date,
              value: day.orders,
              hint: `${day.weekday} ${day.date}: ${day.orders} entregas`,
            }))}
          />
        </CardContent>
        <CardFooter className="text-muted-foreground flex-wrap items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <XpClock size={13} />
            {activePeriod.hours} horas en ruta · {activePeriod.distanceKm} km recorridos
          </span>
          <span className="flex items-center gap-1.5">
            <XpZap size={13} />
            Propinas del periodo: {formatCurrency(activePeriod.tips)}
          </span>
        </CardFooter>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XpCircleCheck size={18} className="text-brand" />
              Resumen operativo de hoy
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Lo que tienes que resolver antes de que te asignen más paradas.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Checklist
              items={courierTodayTasks.map((task) => ({
                id: task.id,
                label: task.label,
                detail: task.detail,
                kind: task.kind,
                done: task.done,
              }))}
            />

            <Separator />

            <div className="flex flex-col gap-2.5">
              <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Ruta de la mañana
              </span>
              <SlideToConfirm
                label="Desliza para reportar salida"
                doneLabel="Salida reportada"
                onConfirm={() =>
                  toast.success('Salida reportada', {
                    description: 'La central ya sabe que arrancaste. Lleva la app a la mano.',
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XpTruck size={18} className="text-brand" />
              Tu equipo
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Datos de la cuenta con la que entras a Xupply.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <dl className="flex flex-col gap-3 text-sm">
              {[
                ['Nombre', user.name],
                ['Documento', user.document],
                ['Teléfono', user.phone],
                ['Vehículo', courierProfile.vehicle],
                ['Zona', user.zone],
                ['Antigüedad', courierProfile.since],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm">
                <XpStar size={16} className="text-clay" />
                <span className="font-heading text-lg font-semibold tabular-nums">
                  {courierProfile.rating}
                </span>
                <span className="text-muted-foreground text-xs">
                  / 5 · {courierProfile.reviews} reseñas
                </span>
              </span>
              <Badge variant="outline" className="gap-1.5">
                <XpCircleCheck size={13} />
                Verificado por Xupply
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="text-muted-foreground flex-wrap items-center justify-between gap-3 text-xs">
            <span>Tu cuenta no accede a productos ni proveedores.</span>
            <Button asChild variant="ghost" size="sm" data-icon="inline-end">
              <a href="#rutas">
                Mapa y rutas
                <XpArrowRight size={15} />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card id="historial-entregas" className="gap-0">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <XpHistory size={18} className="text-brand" />
                Historial de entregas
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Todo lo que has entregado, con día, hora, distancia y valor del pedido.
              </p>
            </div>
            <Badge variant="outline">{courierHistory.length} registros</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CommandBar
            value={query}
            onValueChange={setQuery}
            filters={historyFilters.map((item) => ({ id: item.id, label: item.label }))}
            activeFilter={filter}
            onFilterChange={setFilter}
            placeholder="Buscar por pedido, cliente o zona…"
            resultLabel={`${filteredHistory.length} de ${courierHistory.length}`}
          />

          <PullToRefresh
            onRefresh={async () => {
              await new Promise((resolve) => window.setTimeout(resolve, 700))
            }}
          >
            <ul className="flex flex-col gap-2.5">
              {filteredHistory.map((delivery) => (
                <li
                  key={delivery.id}
                  className="border-border/70 flex flex-col gap-3 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="bg-brand-soft text-brand grid size-10 shrink-0 place-items-center rounded-xl">
                      <XpPackage size={18} />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                        {delivery.id}
                        <Badge variant={statusVariants[delivery.status]}>{delivery.status}</Badge>
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {delivery.ref} · {delivery.dropoff} · {delivery.zone}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {delivery.deliveredAt} · {delivery.minutes} min · {delivery.distanceKm} km ·{' '}
                        {delivery.packages} paquetes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 lg:justify-end">
                    <div className="flex flex-col items-start gap-0.5 lg:items-end">
                      <span className="font-heading text-base font-semibold tabular-nums">
                        {formatCurrency(delivery.amount)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {delivery.rating ? (
                          <span className="flex items-center gap-1">
                            <XpStar size={12} className="text-clay" />
                            {delivery.rating}/5
                          </span>
                        ) : (
                          delivery.relativeDay
                        )}
                      </span>
                    </div>
                    {delivery.status === 'Pendiente' ? (
                      <InlineConfirm
                        label="Marcar entregado"
                        confirmLabel="Sí, entregado"
                        onConfirm={() =>
                          toast.success(`${delivery.id} marcado como entregado`, {
                            description: 'La central ve el cambio en la cola de despachos.',
                          })
                        }
                      />
                    ) : null}
                  </div>
                </li>
              ))}

              {filteredHistory.length === 0 ? (
                <li className="text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
                  No hay entregas que coincidan con esa búsqueda.
                </li>
              ) : null}
            </ul>
          </PullToRefresh>
        </CardContent>
      </Card>
    </div>
  )
}
