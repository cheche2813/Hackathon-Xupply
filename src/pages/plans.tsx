import { XpCheck, XpSparkles, XpZap } from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { plans } from '@/data/marketing'

export function Plans() {
  return (
    <section id="planes" className="section">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Planes"
          title="Elige el plan que va con tu negocio"
          description="Empieza con lo básico y sube de plan cuando tu operación lo pida. Sin permanencia."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-start gap-2 text-sm">
            <XpZap size={16} />
            <span>Precios demo en pesos colombianos</span>
          </div>
        </SectionHeading>

        <div id="lista-planes" className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              id={`plan-${plan.id}`}
              className={
                plan.highlighted
                  ? 'border-brand/40 relative gap-0 shadow-xl shadow-brand/10'
                  : 'h-full gap-0'
              }
            >
              {plan.highlighted ? (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1.5">
                  <XpSparkles size={13} />
                  El más elegido
                </Badge>
              ) : null}

              <CardHeader className="gap-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {plan.tagline}
                </p>
                <p className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-heading text-3xl font-semibold tracking-tight">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm leading-relaxed">
                      <XpCheck size={15} className="text-fresh mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  asChild
                  variant={plan.highlighted ? 'brand' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  <a href="#registro">{plan.cta}</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
