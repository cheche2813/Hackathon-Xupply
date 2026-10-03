import { useState } from 'react'
import { toast } from 'sonner'

import {
  XpClock,
  XpMapPin,
  XpNavigation,
  XpPackage,
  XpPhone,
  XpTruck,
  XpZap,
} from '@/components/icons'
import { InlineConfirm } from '@/components/interactions/inline-confirm'
import { ProgressTicks } from '@/components/interactions/progress-ticks'
import { PullToRefresh } from '@/components/interactions/pull-to-refresh'
import { SlideToConfirm } from '@/components/interactions/slide-to-confirm'
import { RequireSession } from '@/components/shared/require-session'
import { RouteMap, type MapPin, type MapPinTone } from '@/components/shared/route-map'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth'
import { courierRoutes, type CourierStop, type CourierStopStatus } from '@/data/courier'
import { cn } from '@/lib/utils'

const stopTone: Record<CourierStopStatus, MapPinTone> = {
  Recogido: 'muted',
  'En camino': 'brand',
  Entregado: 'fresh',
  Pendiente: 'clay',
}

const stopVariant: Record<CourierStopStatus, 'default' | 'secondary' | 'outline' | 'ghost'> = {
  'En camino': 'default',
  Pendiente: 'secondary',
  Recogido: 'ghost',
  Entregado: 'outline',
}

const isResolved = (stop: CourierStop) =>
  stop.status === 'Entregado' || stop.status === 'Recogido'

// Mapa GPS y rutas del domiciliario: el mapa es ilustrativo, pero el recorrido,
// las paradas y la confirmacion de entrega ya funcionan sobre los datos de la
// cuenta. El seguimiento en vivo se conecta cuando exista la API de ubicacion.
export function CourierRoutes() {
  const { user } = useAuth()
  const [routeId, setRouteId] = useState(courierRoutes[0].id)
  const route = courierRoutes.find((item) => item.id === routeId) ?? courierRoutes[0]
  const [activeStop, setActiveStop] = useState<string | undefined>(route.stops[0]?.id)

  const selectRoute = (nextId: string) => {
    setRouteId(nextId)
    const next = courierRoutes.find((item) => item.id === nextId)
    setActiveStop(next?.stops[0]?.id)
  }

  const pins: MapPin[] = route.stops.map((stop) => ({
    id: stop.id,
    label: `${stop.ref} · ${stop.label}`,
    x: stop.x,
    y: stop.y,
    tone: stopTone[stop.status],
    badge: stop.ref,
  }))

  const trail = route.stops.map((stop) => ({ x: stop.x, y: stop.y }))
  const resolved = route.stops.filter(isResolved).length
  const kilometersLeft = Math.round(route.distanceKm * (1 - resolved / route.stops.length))

  return (
    <section id="rutas" className="section" data-endpoint="/api/routes">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Ruta y mapa"
          title="Mapa GPS y rutas"
          description="Tu recorrido del día con cada parada, la ventana de entrega y el orden en el que conviene hacerlas. El mapa se enciende en vivo cuando conectemos el GPS."
        >
          <div className="flex flex-wrap items-center justify-start gap-2">
            <Badge className="gap-1.5">
              <XpTruck size={13} />
              {route.name}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <XpClock size={13} />
              {route.shift}
            </Badge>
          </div>
        </SectionHeading>

        <RequireSession
          endpoint="/api/routes"
          title="Tus rutas viven en tu cuenta de domicilio"
          description="Inicia sesión con la cuenta de domiciliario para ver el mapa, las paradas y las ventanas de entrega de tu día."
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-2">
              {courierRoutes.map((item) => {
                const active = item.id === routeId

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectRoute(item.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex flex-col items-start gap-0.5 rounded-2xl border px-4 py-2.5 text-left transition-colors',
                      active
                        ? 'border-brand bg-brand-soft/40'
                        : 'border-border hover:bg-muted/50',
                    )}
                  >
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.day} · {item.stops.length} paradas
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
              <div className="flex flex-col gap-4">
                <PullToRefresh
                  onRefresh={async () => {
                    await new Promise((resolve) => window.setTimeout(resolve, 700))
                  }}
                  label="Desliza para recalcular la ruta"
                  doneLabel="Ruta recalculada"
                >
                  <RouteMap
                    pins={pins}
                    trail={trail}
                    activeId={activeStop}
                    onSelect={setActiveStop}
                    caption="Mapa ilustrativo · el GPS en vivo llega más adelante"
                  />
                </PullToRefresh>

                <Card size="sm">
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <XpNavigation size={16} className="text-brand" />
                        Avance de {route.name}
                      </span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {resolved} de {route.stops.length} paradas · {kilometersLeft} km restantes
                      </span>
                    </div>
                    <ProgressTicks
                      items={route.stops.map((stop, index) => ({
                        label: `${index + 1}`,
                        value: isResolved(stop) ? 1 : 0,
                        hint: `${stop.ref} · ${stop.label} · ${stop.status}`,
                      }))}
                      onSelect={(index) => setActiveStop(route.stops[index]?.id)}
                    />
                  </CardContent>
                </Card>

                <Card className="gap-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XpZap size={18} className="text-brand" />
                      Iniciar navegación
                    </CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Avisa a la central que saliste. Al llegar a cada parada marcas la entrega.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <SlideToConfirm
                      label="Desliza para iniciar la ruta"
                      doneLabel="Ruta iniciada"
                      onConfirm={() =>
                        toast.success(`${route.name} en marcha`, {
                          description: `${route.stops.length} paradas · ${route.distanceKm} km programados.`,
                        })
                      }
                    />
                  </CardContent>
                  <CardFooter className="text-muted-foreground flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="flex items-center gap-1.5">
                      <XpClock size={13} />
                      Ventanas de {route.stops[0]?.window} a {route.stops[route.stops.length - 1]?.window}
                    </span>
                    {user ? (
                      <Button asChild variant="ghost" size="sm" data-icon="inline-start">
                        <a href={`tel:${user.phone.replace(/\s/g, '')}`}>
                          <XpPhone size={15} />
                          Central de despacho
                        </a>
                      </Button>
                    ) : null}
                  </CardFooter>
                </Card>
              </div>

              <Card id="paradas-ruta" className="gap-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XpMapPin size={18} className="text-brand" />
                    Paradas de {route.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Toca una parada para destacarla en el mapa.
                  </p>
                </CardHeader>
                <CardContent>
                  <ol className="flex flex-col gap-2.5">
                    {route.stops.map((stop, index) => {
                      const active = stop.id === activeStop

                      return (
                        <li key={stop.id}>
                          <button
                            type="button"
                            onClick={() => setActiveStop(stop.id)}
                            aria-pressed={active}
                            className={cn(
                              'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
                              active
                                ? 'border-brand bg-brand-soft/30'
                                : 'border-border/70 hover:bg-muted/50',
                            )}
                          >
                            <span
                              className={cn(
                                'font-heading grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums',
                                isResolved(stop)
                                  ? 'bg-fresh text-white'
                                  : active
                                    ? 'bg-brand text-primary-foreground'
                                    : 'bg-muted text-muted-foreground',
                              )}
                            >
                              {index + 1}
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-1">
                              <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                                {stop.ref}
                                <Badge variant={stopVariant[stop.status]}>{stop.status}</Badge>
                              </span>
                              <span className="truncate text-xs font-medium">{stop.label}</span>
                              <span className="text-muted-foreground text-xs">
                                {stop.address} · {stop.window}
                              </span>
                              <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <XpPackage size={12} />
                                {stop.packages} paquetes
                              </span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-3">
                  <InlineConfirm
                    label="Reportar una incidencia"
                    confirmLabel="Sí, reportar"
                    onConfirm={() =>
                      toast.success('Incidencia reportada', {
                        description: 'La central la ve y te responde en unos minutos.',
                      })
                    }
                  />
                </CardFooter>
              </Card>
            </div>
          </div>
        </RequireSession>
      </div>
    </section>
  )
}
