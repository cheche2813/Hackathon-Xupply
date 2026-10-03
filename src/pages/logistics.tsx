import { XpClock, XpMapPin, XpNavigation, XpStore, XpTruck } from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { RequireSession } from '@/components/shared/require-session'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deliveries, type DeliveryStatus } from '@/data/logistics'

const statusVariant: Record<DeliveryStatus, 'secondary' | 'outline'> = {
  'En camino': 'secondary',
  'En preparación': 'outline',
  Entregado: 'outline',
}

export function Logistics() {
  const active = deliveries.filter((delivery) => delivery.status !== 'Entregado')

  return (
    <section id="logistica" className="section" data-endpoint="/api/deliveries">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Rutero y domiciliario"
          title="Logística"
          description="Rutero asignado, hora estimada y ubicación en vivo del domiciliario hasta tu puerta."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-start gap-2 text-sm">
            <XpTruck size={16} />
            <span>
              {active.length} entregas activas · {deliveries.length} registradas
            </span>
          </div>
        </SectionHeading>

        <RequireSession
          endpoint="/api/deliveries"
          title="Tus entregas en vivo están en el panel"
          description="Inicia sesión para ver el domiciliario asignado, la hora estimada y el avance de cada orden."
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10">
            <div className="flex flex-col gap-4">
              {deliveries.map((delivery) => (
                <Card key={delivery.id} className="gap-0">
                  <CardHeader className="border-b">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <CardTitle className="flex items-center gap-2">
                        <XpTruck size={16} className="text-brand shrink-0" />
                        {delivery.id}
                      </CardTitle>
                      <Badge variant={statusVariant[delivery.status]}>{delivery.status}</Badge>
                    </div>
                    <p className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span className="flex items-center gap-1.5">
                        <XpStore size={13} className="text-brand shrink-0" />
                        {delivery.supplier}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <XpMapPin size={13} className="text-brand shrink-0" />
                        {delivery.destination}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <XpClock size={13} className="text-brand shrink-0" />
                        {delivery.eta}
                      </span>
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <p className="text-muted-foreground text-sm">
                      Domiciliario:{' '}
                      <span className="text-foreground font-medium">{delivery.driver}</span>
                    </p>
                    <div
                      className="bg-muted h-2 w-full overflow-hidden rounded-full"
                      role="progressbar"
                      aria-label={`Avance de la entrega ${delivery.id}`}
                      aria-valuenow={delivery.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="from-brand to-brand-strong h-full rounded-full bg-linear-to-r"
                        style={{ width: `${delivery.progress}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs tabular-nums">
                      {delivery.progress}% del recorrido completado
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <figure className="border-border/80 bg-muted/40 flex flex-col gap-3 rounded-3xl border border-dashed p-8 text-center">
              <span className="bg-brand-soft text-brand mx-auto flex size-14 items-center justify-center rounded-full">
                <XpNavigation size={24} />
              </span>
              <figcaption className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Ubicación en vivo</span>
                <span className="text-muted-foreground text-xs leading-relaxed">
                  El mapa se conecta al GPS del domiciliario cuando la API de entregas esté
                  activa. Por ahora mostramos el avance de cada ruta.
                </span>
              </figcaption>
            </figure>
          </div>
        </RequireSession>
      </div>
    </section>
  )
}
