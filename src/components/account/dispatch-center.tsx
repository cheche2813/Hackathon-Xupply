import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  XpCheck,
  XpClock,
  XpMapPin,
  XpPackage,
  XpPhone,
  XpTruck,
  XpUserPlus,
  XpUsers,
  XpZap,
} from '@/components/icons'
import { RadialMenu, type RadialAction } from '@/components/interactions/radial-menu'
import { ReorderList } from '@/components/interactions/reorder-list'
import { RouteMap, type MapPin } from '@/components/shared/route-map'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  dispatchByStatus,
  dispatchCouriers,
  dispatchKpis,
  dispatchRequests,
  type DispatchRequest,
  type DispatchStatus,
} from '@/data/dispatch'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

const queue: { id: DispatchStatus; label: string }[] = [
  { id: 'Pendiente de recoger', label: 'Pendientes de recoger' },
  { id: 'En entrega', label: 'En entrega' },
  { id: 'Entregado', label: 'Entregados' },
]

const statusVariant: Record<DispatchStatus, 'default' | 'secondary' | 'outline'> = {
  'En entrega': 'default',
  'Pendiente de recoger': 'secondary',
  Entregado: 'outline',
}

const statusTone: Record<DispatchStatus, 'clay' | 'brand' | 'fresh'> = {
  'Pendiente de recoger': 'clay',
  'En entrega': 'brand',
  Entregado: 'fresh',
}

const priorityVariant: Record<DispatchRequest['priority'], 'default' | 'outline' | 'ghost'> = {
  Alta: 'default',
  Media: 'outline',
  Normal: 'ghost',
}

// Centro de solicitudes de domicilio del proveedor: la cola de pedidos que
// necesita moto, con el mapa de la zona y las acciones rapidas por pedido.
export function DispatchCenter() {
  const [status, setStatus] = useState<DispatchStatus>('Pendiente de recoger')
  const [order, setOrder] = useState<DispatchRequest[]>(dispatchRequests)
  const [activeId, setActiveId] = useState<string | undefined>(undefined)

  const visible = useMemo(
    () => order.filter((request) => request.status === status),
    [order, status],
  )

  const pins: MapPin[] = useMemo(
    () =>
      order.map((request) => ({
        id: request.id,
        label: `${request.id} · ${request.buyer}`,
        x: request.x,
        y: request.y,
        tone: statusTone[request.status],
        badge: request.id,
      })),
    [order],
  )

  const trail = useMemo(
    () =>
      order
        .filter((request) => request.status !== 'Entregado')
        .map((request) => ({ x: request.x, y: request.y })),
    [order],
  )

  const actionsFor = (request: DispatchRequest): RadialAction[] => {
    const call = {
      id: 'call',
      label: `Llamar a ${request.buyer}`,
      icon: <XpPhone size={16} />,
      onSelect: () =>
        toast.info(`Llamando a ${request.buyer}`, {
          description: request.courier
            ? `También contacta a ${request.courier} por la entrega en curso.`
            : 'Todavía no tiene domiciliario asignado.',
        }),
    }

    if (request.status === 'Entregado') {
      return [
        {
          id: 'receipt',
          label: 'Reenviar soporte de entrega',
          icon: <XpCheck size={16} />,
          tone: 'fresh',
          onSelect: () =>
            toast.success('Soporte enviado', {
              description: `${request.buyer} ya tiene el comprobante de ${request.id}.`,
            }),
        },
        call,
      ]
    }

    return [
      {
        id: 'assign',
        label: request.courier ? 'Reasignar domiciliario' : 'Asignar domiciliario',
        icon: <XpUserPlus size={16} />,
        tone: 'brand',
        onSelect: () =>
          toast.success(request.courier ? 'Reasignación abierta' : 'Asignación abierta', {
            description: request.courier
              ? `${request.id} vuelve a la cola de ${dispatchCouriers.length} domiciliarios.`
              : `Elige entre ${dispatchCouriers.filter((item) => item.active).length} domiciliarios activos.`,
          }),
      },
      {
        id: 'route',
        label: 'Ver en el mapa',
        icon: <XpMapPin size={16} />,
        tone: 'clay',
        onSelect: () => setActiveId(request.id),
      },
      {
        id: 'priority',
        label: 'Marcar como prioritario',
        icon: <XpZap size={16} />,
        onSelect: () =>
          toast.success(`${request.id} sube de prioridad`, {
            description: 'Queda de primero en la cola de despacho.',
          }),
      },
      call,
    ]
  }

  return (
    <div className="flex flex-col gap-6" id="centro-despachos">
      <Card id="cola-despachos" className="gap-0">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <XpTruck size={18} className="text-brand" />
                Centro de solicitudes de domicilio
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tus pedidos que necesitan reparto. Ordena la cola como quieras: el domiciliario ve
                las paradas en el mismo orden.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <XpClock size={13} />
                {dispatchKpis.avgWaitMinutes} min de espera promedio
              </Badge>
              <Badge className="gap-1.5">
                <XpCheck size={13} />
                {dispatchKpis.onTimeRate}% a tiempo
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {queue.map((item) => {
              const count = dispatchByStatus(item.id).length
              const Icon = item.id === 'Entregado' ? XpCheck : item.id === 'En entrega' ? XpTruck : XpPackage

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id)}
                  aria-pressed={status === item.id}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors',
                    status === item.id
                      ? 'border-brand bg-brand-soft/40'
                      : 'border-border hover:bg-muted/50',
                  )}
                >
                  <span className="bg-brand-soft text-brand grid size-10 shrink-0 place-items-center rounded-xl">
                    <Icon size={18} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-heading text-2xl leading-none font-semibold tabular-nums">
                      {count}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">{item.label}</span>
                  </span>
                </button>
              )
            })}

            <div className="border-border/70 flex items-center gap-3 rounded-2xl border border-dashed p-4">
              <span className="bg-muted text-muted-foreground grid size-10 shrink-0 place-items-center rounded-xl">
                <XpUsers size={18} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-heading text-2xl leading-none font-semibold tabular-nums">
                  {dispatchKpis.couriersOnRoute}
                  <span className="text-muted-foreground text-base font-normal">
                    /{dispatchKpis.fleetTotal}
                  </span>
                </span>
                <span className="text-muted-foreground truncate text-xs">Domiciliarios en ruta</span>
              </span>
            </div>
          </div>

          <RouteMap pins={pins} trail={trail} activeId={activeId} onSelect={setActiveId} />

          <div className="flex flex-wrap items-center gap-2">
            {queue.map((item) => {
              const active = item.id === status

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id)}
                  aria-pressed={active}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'bg-brand text-primary-foreground border-brand'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground border-border',
                  )}
                >
                  {item.label}
                  <span className="tabular-nums">{dispatchByStatus(item.id).length}</span>
                </button>
              )
            })}
          </div>

          {status === 'Pendiente de recoger' ? (
            <ReorderList
              items={visible}
              onReorder={(next) =>
                // La lista reordenable solo mueve los pedidos sin asignar: el
                // resto de la cola se conserva al final, en su orden.
                setOrder((current) => [
                  ...next,
                  ...current.filter((request) => request.status !== 'Pendiente de recoger'),
                ])
              }
              moveUpLabel="Subir pedido"
              moveDownLabel="Bajar pedido"
              renderItem={(request) => (
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    {request.id}
                    <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                    <Badge variant={priorityVariant[request.priority]}>
                      {request.priority}
                    </Badge>
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {request.buyer} · {request.destination}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {request.window} · {request.packages} paquetes ·{' '}
                    {formatCurrency(request.amount)} · pedido {request.placedAt}
                  </span>
                </div>
              )}
            />
          ) : (
            <ul className="flex flex-col gap-2.5">
              {visible.map((request) => (
                <li
                  key={request.id}
                  className="border-border/70 flex flex-col gap-3 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={cn(
                        'grid size-10 shrink-0 place-items-center rounded-xl',
                        request.status === 'Entregado'
                          ? 'bg-fresh/15 text-fresh'
                          : 'bg-brand-soft text-brand',
                      )}
                    >
                      {request.status === 'Entregado' ? <XpCheck size={18} /> : <XpTruck size={18} />}
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                        {request.id}
                        <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                        <Badge variant={priorityVariant[request.priority]}>
                          {request.priority}
                        </Badge>
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {request.buyer} · {request.destination} · {request.zone}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {request.courier
                          ? `${request.courier} · ${request.courierPhone}`
                          : 'Sin domiciliario asignado'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 lg:justify-end">
                    <div className="flex flex-col items-start gap-0.5 lg:items-end">
                      <span className="font-heading text-base font-semibold tabular-nums">
                        {formatCurrency(request.amount)}
                      </span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {request.status === 'Entregado' ? 'Cerrado' : `${request.progress}% del recorrido`}
                      </span>
                    </div>
                    <RadialMenu actions={actionsFor(request)} />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {visible.length === 0 ? (
            <p className="text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
              No hay pedidos en este estado.
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="text-muted-foreground flex-wrap items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <XpMapPin size={13} />
            El mapa es ilustrativo por ahora
          </span>
          <span className="flex items-center gap-1.5">
            <XpUsers size={13} />
            {dispatchCouriers.filter((courier) => courier.active).length} domiciliarios
            disponibles
          </span>
        </CardFooter>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XpUsers size={18} className="text-brand" />
              Domiciliarios disponibles
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A quién puedes asignarle el siguiente pedido.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3">
              {dispatchCouriers.map((courier) => (
                <li
                  key={courier.name}
                  className="border-border/70 flex items-center justify-between gap-3 rounded-xl border p-3"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold">{courier.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {courier.zone} · {courier.phone}
                    </span>
                  </div>
                  <Badge variant={courier.active ? 'default' : 'outline'}>
                    {courier.active ? 'En ruta' : 'Descansando'}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-3">
            <Separator />
            <Button
              variant="outline"
              data-icon="inline-start"
              onClick={() =>
                toast.success('Solicitud enviada', {
                  description: `${dispatchKpis.fleetTotal} domiciliarios reciben el aviso de nueva ruta.`,
                })
              }
            >
              <XpUserPlus size={16} />
              Pedir más domiciliarios
            </Button>
          </CardFooter>
        </Card>

        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XpClock size={18} className="text-brand" />
              Hoy en el despacho
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Cómo viene caminando el día en la operación de reparto.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            {[
              ['Pedidos por repartir', `${dispatchByStatus('Pendiente de recoger').length}`],
              ['En camino ahora', `${dispatchByStatus('En entrega').length}`],
              ['Entregados hoy', `${dispatchByStatus('Entregado').length}`],
              ['Sin asignar', `${dispatchKpis.unassigned}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-heading text-lg font-semibold tabular-nums">{value}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="text-muted-foreground flex-wrap items-center justify-between gap-3 text-xs">
            <span>Ventanas prometidas entre 11:30 y 18:30</span>
            <Badge variant="outline" className="gap-1.5">
              <XpZap size={13} />
              {dispatchKpis.onTimeRate}% cumplimiento
            </Badge>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
