import { toast } from 'sonner'

import { XpArrowRight, XpCheck, XpPackage, XpStore } from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { audiences } from '@/data/marketing'
import { cn } from '@/lib/utils'

const audienceIcons = { XpStore, XpPackage } as const

export function Audiences() {
  const notify = (title: string) =>
    toast.success(title, {
      description: 'Un asesor de Xupply te escribe hoy mismo para completar el registro.',
    })

  return (
    <section id="audiencias" className="border-border bg-muted/40 section border-y">
      <div className="container-page flex flex-col gap-14 lg:gap-16">
        <SectionHeading
          index="02"
          eyebrow="Dos lados, una sola plataforma"
          title="Restaurantes y proveedores trabajan mejor juntos"
          description="Si compras alimentos ahorras tiempo y dinero. Si los vendes, abres tu mercado a toda la ciudad."
        />

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {audiences.map((item, index) => {
            const Icon = audienceIcons[item.icon]

            return (
              <article
                key={item.id}
                id={item.id}
                className="border-border bg-card group flex flex-col overflow-hidden rounded-lg border transition-colors duration-300 hover:border-brand/45"
              >
                <header className="border-border flex items-center justify-between gap-3 border-b px-5 py-4">
                  <span className="flex items-center gap-3">
                    <span className="bg-brand inline-flex size-9 items-center justify-center rounded-md text-white">
                      <Icon size={17} />
                    </span>
                    <Badge variant="secondary" className="rounded-md">
                      {item.eyebrow}
                    </Badge>
                  </span>
                  <span className="text-muted-foreground/60 font-heading text-2xl leading-none font-semibold tabular-nums">
                    0{index + 1}
                  </span>
                </header>

                <div className="flex flex-1 flex-col gap-6 p-5 sm:p-6">
                  <h3 className="font-heading max-w-sm text-xl leading-snug font-semibold sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground max-w-lg leading-relaxed">{item.description}</p>

                  <ul className="border-border divide-border divide-y border-y">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 py-2.5">
                        <span className="bg-fresh/12 text-fresh mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-[5px]">
                          <XpCheck size={12} />
                        </span>
                        <span className="text-foreground/85 text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={index === 0 ? 'brand' : 'outline'}
                    size="lg"
                    data-icon="inline-end"
                    className={cn('w-full self-start sm:w-auto')}
                    onClick={() => notify(item.cta)}
                  >
                    {item.cta}
                    <XpArrowRight size={18} />
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
