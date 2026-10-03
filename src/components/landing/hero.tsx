import {
  XpArrowRight,
  XpBarChart3,
  XpCircleCheck,
  XpPackage,
  XpShieldCheck,
  XpStore,
  XpTruck,
  XpUsers,
} from '@/components/icons'
import { HowItWorksDemo } from '@/components/landing/how-it-works-demo'
import { ProductPreview } from '@/components/landing/product-preview'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const metrics = [
  { value: '+1.200', label: 'Productos mayoristas' },
  { value: '340+', label: 'Proveedores verificados' },
  { value: '24 h', label: 'Entrega promedio' },
  { value: '4,8/5', label: 'Valoración restaurants' },
] as const

const modules = [
  { icon: XpStore, label: 'Catálogo' },
  { icon: XpPackage, label: 'Inventario' },
  { icon: XpTruck, label: 'Logística GPS' },
  { icon: XpBarChart3, label: 'Contabilidad' },
  { icon: XpUsers, label: 'Equipo y roles' },
  { icon: XpShieldCheck, label: 'Facturación DIAN' },
] as const

// Duplicada para que la marquesina pueda translational -50% sin salto visible.
const marqueeItems = [...modules, ...modules]

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div
        aria-hidden
        className="from-brand/16 via-brand-soft/35 pointer-events-none absolute inset-0 -z-10 bg-linear-to-b to-transparent"
      />
      <div
        aria-hidden
        className="grid-surface pointer-events-none absolute inset-0 -z-10 opacity-70 [-webkit-mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="container-page relative pt-10 pb-16 sm:pt-14 lg:pt-20 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Columna de copy */}
          <div className="flex flex-col items-start gap-7 lg:col-span-5">
            <Badge
              variant="outline"
              className="border-brand/30 bg-brand-soft/70 text-brand h-8 gap-2 rounded-md px-3"
            >
              <span className="bg-brand animate-halo size-1.5 rounded-[2px]" />
              Plataforma para restaurantes y proveedores
            </Badge>

            <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
              El sistema operativo de tu{' '}
              <span className="text-gradient">abastecimiento</span>
            </h1>

            <p className="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg">
              Catálogo mayorista, pedidos, inventario, facturación electrónica y logística con GPS
              en un solo panel. Sin pedidos por WhatsApp y sin el Excel que nadie actualiza.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button asChild variant="brand" size="xl" data-icon="inline-end" className="w-full sm:w-auto">
                <a href="#registro">
                  Crear cuenta gratis
                  <XpArrowRight size={18} />
                </a>
              </Button>
              <HowItWorksDemo />
            </div>

            <ul className="text-muted-foreground grid w-full grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
              {['Sin tarjeta de crédito', '14 días de prueba', 'Soporte en Bucaramanga', 'Migración de catálogo'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 font-medium">
                    <XpCircleCheck size={17} className="text-fresh shrink-0" />
                    {item}
                  </li>
                ),
              )}
            </ul>

            {/* Cifras en grilla, no en tarjetas sueltas */}
            <dl className="border-border grid w-full grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="bg-card flex flex-col gap-1 p-4">
                  <dt className="text-muted-foreground order-2 text-xs leading-snug font-medium">
                    {metric.label}
                  </dt>
                  <dd className="font-heading order-1 text-xl leading-none font-semibold tabular-nums">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Columna de producto */}
          <div className="lg:col-span-7">
            <div className="relative">
              <div
                aria-hidden
                className="bg-brand/20 pointer-events-none absolute -inset-x-4 -top-6 bottom-4 -z-10 rounded-2xl blur-2xl"
              />
              <ProductPreview className="animate-rise" />
            </div>
          </div>
        </div>
      </div>

      {/* Marquesina de módulos: el producto completo en una sola tira */}
      <div className="border-border bg-card/70 relative border-y py-4 backdrop-blur-sm">
        <div className="marquee-mask flex overflow-hidden">
          <ul className="animate-marquee flex shrink-0 items-center gap-3 pr-3">
            {marqueeItems.map((module, index) => (
              <li
                key={`${module.label}-${index}`}
                className="border-border bg-background text-muted-foreground inline-flex shrink-0 items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium whitespace-nowrap"
              >
                <module.icon size={15} className="text-brand" />
                {module.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
