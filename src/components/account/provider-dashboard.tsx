import {
  XpArrowRight,
  XpBuilding2,
  XpCheck,
  XpCircleDollarSign,
  XpPackage,
  XpShieldCheck,
  XpTruck,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth'
import { dispatchBusiness, dispatchByStatus, dispatchKpis } from '@/data/dispatch'
import { formatCurrency } from '@/lib/format'

import { DispatchCenter } from './dispatch-center'

const firstName = (name: string) => name.split(' ')[0]

// Panel del proveedor: su resumen de despacho y, debajo, el centro de
// solicitudes de domicilio con la cola de pedidos que necesita reparto.
export function ProviderDashboard() {
  const { user } = useAuth()

  if (!user) return null

  const pending = dispatchByStatus('Pendiente de recoger').length
  const onRoute = dispatchByStatus('En entrega').length
  const delivered = dispatchByStatus('Entregado').length

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading
        align="left"
        eyebrow="Panel de proveedor"
        title={`Hola, ${firstName(user.name)}`}
        description={`Aquí ordenas los pedidos de ${dispatchBusiness.name}: lo que entra, lo que ya va en camino y qué domicilio tienes disponible para cada entrega.`}
      >
        <div className="flex flex-wrap items-center justify-start gap-2">
          <Badge className="gap-1.5">
            <XpShieldCheck size={13} />
            {user.roleLabel}
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <XpBuilding2 size={13} />
            {dispatchBusiness.name}
          </Badge>
        </div>
      </SectionHeading>

      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="brand" data-icon="inline-end">
          <a href="#centro-despachos">
            <XpTruck size={17} />
            Ver cola de despachos
            <XpArrowRight size={17} />
          </a>
        </Button>
        <Button asChild variant="outline" data-icon="inline-start">
          <a href="#proveedores">
            <XpPackage size={17} />
            Mi ficha de proveedor
          </a>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Pendientes de recoger',
            value: `${pending}`,
            hint: `${dispatchKpis.avgWaitMinutes} min de espera promedio`,
            icon: <XpPackage size={18} />,
          },
          {
            label: 'En entrega',
            value: `${onRoute}`,
            hint: `${dispatchKpis.couriersOnRoute} domiciliarios en ruta`,
            icon: <XpTruck size={18} />,
          },
          {
            label: 'Entregados',
            value: `${delivered}`,
            hint: `${dispatchKpis.onTimeRate}% dentro de la ventana`,
            icon: <XpCheck size={18} />,
          },
          {
            label: 'Facturado en la cola',
            value: formatCurrency(
              dispatchByStatus('Pendiente de recoger').reduce(
                (total, request) => total + request.amount,
                0,
              ),
            ),
            hint: 'pendiente de entregar',
            icon: <XpCircleDollarSign size={18} />,
          },
        ].map((kpi) => (
          <Card key={kpi.label} size="sm">
            <CardContent className="flex items-start gap-3">
              <span className="bg-brand-soft text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
                {kpi.icon}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-muted-foreground text-xs">{kpi.label}</span>
                <span className="font-heading truncate text-2xl leading-none font-semibold tracking-tight tabular-nums">
                  {kpi.value}
                </span>
                <span className="text-muted-foreground text-xs">{kpi.hint}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DispatchCenter />
    </div>
  )
}
