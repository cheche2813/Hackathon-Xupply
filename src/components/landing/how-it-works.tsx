import { SectionHeading } from '@/components/shared/section-heading'
import { XpSearch, XpSparkles, XpTruck } from '@/components/icons'
import { steps } from '@/data/marketing'

const stepIcons = [XpSearch, XpSparkles, XpTruck] as const

// Piezas que hacen tangible cada paso, para que la fila se lea como un panel
// de producto y no como tres parrafos sueltos.
const stepDetails = [
  { bullets: ['Catálogo con precio por kilo o caja', 'Mínimos de compra visibles', 'Adjuntos y fichas técnicas'] },
  { bullets: ['Cotización y pedido en el mismo lugar', 'Historial por proveedor', 'Estados de inventario sincronizados'] },
  { bullets: ['Rutero asignado automáticamente', 'Hora estimada de llegada', 'Factura DIAN al confirmar entrega'] },
] as const

export function HowItWorks() {
  return (
    <section id="producto" className="section">
      <div className="container-page flex flex-col gap-14 lg:gap-16">
        <SectionHeading
          index="01"
          eyebrow="Cómo funciona"
          title="Del pedido a la puerta de tu cocina, en tres pasos"
          description="Xupply es el puente entre lo que tu restaurante necesita y lo que el proveedor tiene disponible hoy."
        />

        <ol className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {steps.map((step, index) => {
            const Icon = stepIcons[index]

            return (
              <li key={step.title} className="group relative">
                <article className="border-border bg-card hover:border-brand/45 flex h-full flex-col rounded-lg border transition-colors duration-300">
                  <header className="border-border flex items-center justify-between border-b px-5 py-4">
                    <span className="bg-brand text-white inline-flex size-9 items-center justify-center rounded-md">
                      <Icon size={17} />
                    </span>
                    <span className="text-muted-foreground/60 font-heading text-2xl leading-none font-semibold tabular-nums">
                      0{index + 1}
                    </span>
                  </header>

                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <h3 className="font-heading text-lg leading-snug font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>

                    <ul className="mt-auto flex flex-col gap-2 pt-2">
                      {stepDetails[index].bullets.map((bullet) => (
                        <li key={bullet} className="text-muted-foreground flex items-start gap-2 text-sm">
                          <span className="bg-brand/70 mt-2 size-1 shrink-0 rounded-[1px]" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>

                {/* Conector de flujo entre pasos, solo cuando hay paso siguiente */}
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden
                    className="bg-border absolute top-1/2 -right-2.5 hidden h-px w-1 md:block lg:-right-3 lg:w-1.5"
                  />
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
