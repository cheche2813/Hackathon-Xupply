import { useMemo } from 'react'

import { XpBarChart3, XpCircleCheck, XpTrendingDown, XpTrendingUp } from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { RequireSession } from '@/components/shared/require-session'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { accountingMovements } from '@/data/billing'
import { formatCurrency } from '@/lib/format'

export function Accounting() {
  const { income, expenses, balance } = useMemo(() => {
    let totalIncome = 0
    let totalExpenses = 0

    for (const movement of accountingMovements) {
      if (movement.type === 'Ingreso') {
        totalIncome += movement.amount
      } else {
        totalExpenses += Math.abs(movement.amount)
      }
    }

    return { income: totalIncome, expenses: totalExpenses, balance: totalIncome - totalExpenses }
  }, [])

  return (
    <section id="contabilidad" className="section" data-endpoint="/api/accounting">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Flujo de caja"
          title="Contabilidad"
          description="Ingresos, egresos y balance del negocio en un reporte que tu contador entiende sin traducciones."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-start gap-2 text-sm">
            <XpBarChart3 size={16} />
            <span>{accountingMovements.length} movimientos registrados</span>
          </div>
        </SectionHeading>

        <RequireSession
          endpoint="/api/accounting"
          title="Tu contabilidad vive en el panel"
          description="Inicia sesión para ver el flujo de caja, los ingresos y los egresos de tu negocio."
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
              <Card className="gap-0">
                <CardContent className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Ingresos
                  </span>
                  <span className="font-heading flex items-center gap-2 text-2xl font-semibold tabular-nums">
                    <XpTrendingUp size={18} className="text-fresh shrink-0" />
                    {formatCurrency(income)}
                  </span>
                </CardContent>
              </Card>
              <Card className="gap-0">
                <CardContent className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Egresos
                  </span>
                  <span className="font-heading flex items-center gap-2 text-2xl font-semibold tabular-nums">
                    <XpTrendingDown size={18} className="text-destructive shrink-0" />
                    {formatCurrency(expenses)}
                  </span>
                </CardContent>
              </Card>
              <Card className="border-brand/25 bg-brand-soft/40 gap-0">
                <CardContent className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Balance
                  </span>
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {formatCurrency(balance)}
                  </span>
                </CardContent>
              </Card>
            </div>

            <Card className="gap-0 overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-3xl border-collapse text-left text-sm">
                    <caption className="sr-only">Movimientos contables del periodo</caption>
                    <thead>
                      <tr className="border-b">
                        <th scope="col" className="p-4 font-medium">
                          Fecha
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Concepto
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Categoría
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Tipo
                        </th>
                        <th scope="col" className="p-4 text-right font-medium">
                          Monto
                        </th>
                      </tr>
                    </thead>
                    <tbody id="filas-contabilidad" className="divide-y">
                      {accountingMovements.map((movement) => (
                        <tr key={movement.id} id={movement.id}>
                          <td className="text-muted-foreground p-4 tabular-nums">
                            {movement.date}
                          </td>
                          <th scope="row" className="p-4 font-medium">
                            {movement.concept}
                          </th>
                          <td className="text-muted-foreground p-4">
                            {movement.category}
                          </td>
                          <td className="p-4">
                            {movement.type === 'Ingreso' ? (
                              <span className="text-fresh flex items-center gap-1.5 text-sm">
                                <XpCircleCheck size={15} />
                                Ingreso
                              </span>
                            ) : (
                              <span className="text-destructive flex items-center gap-1.5 text-sm">
                                <XpTrendingDown size={15} />
                                Egreso
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right font-semibold tabular-nums">
                            {formatCurrency(movement.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="p-4 font-medium">
                          <Separator className="mb-3" />
                          Resultado del periodo
                        </td>
                        <td className="p-4 text-right font-heading text-lg font-semibold tabular-nums">
                          {formatCurrency(balance)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </RequireSession>
      </div>
    </section>
  )
}
