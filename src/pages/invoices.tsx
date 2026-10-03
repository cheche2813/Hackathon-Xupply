import { useMemo, useState } from 'react'

import { XpCircleAlert, XpReceipt, XpStore } from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { RequireSession } from '@/components/shared/require-session'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/format'
import { invoices, type InvoiceStatus } from '@/data/billing'

const statusVariant: Record<InvoiceStatus, 'secondary' | 'outline' | 'destructive'> = {
  Pagada: 'secondary',
  Pendiente: 'outline',
  Anulada: 'destructive',
}

export function Invoices() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'todas' | InvoiceStatus>('todas')

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()

    return invoices.filter((invoice) => {
      const matchesTerm =
        term.length === 0 ||
        invoice.id.toLowerCase().includes(term) ||
        invoice.order.toLowerCase().includes(term) ||
        invoice.client.toLowerCase().includes(term)
      const matchesStatus = status === 'todas' || invoice.status === status
      return matchesTerm && matchesStatus
    })
  }, [query, status])

  return (
    <section id="facturacion" className="section" data-endpoint="/api/invoices">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Facturación electrónica"
          title="Facturación"
          description="Cada orden puede generar su factura electrónica DIAN. Aquí está el histórico en modo demo."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-start gap-2 text-sm">
            <XpReceipt size={16} />
            <span>{invoices.length} facturas registradas</span>
          </div>
        </SectionHeading>

        <RequireSession
          endpoint="/api/invoices"
          title="Tu facturación aparece aquí"
          description="Inicia sesión para consultar facturas, estados y detalles de cada orden."
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar factura, orden o cliente"
                  aria-label="Buscar en facturación"
                  className="h-11"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(['todas', 'Pendiente', 'Pagada', 'Anulada'] as const).map((item) => (
                  <Button
                    key={item}
                    variant={status === item ? 'brand' : 'outline'}
                    size="sm"
                    onClick={() => setStatus(item)}
                  >
                    {item === 'todas' ? 'Todas' : item}
                  </Button>
                ))}
              </div>
            </div>

            <Card className="gap-0 overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-3xl border-collapse text-left text-sm">
                    <caption className="sr-only">Listado de facturas electrónicas</caption>
                    <thead>
                      <tr className="border-b">
                        <th scope="col" className="p-4 font-medium">
                          Factura
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Orden
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Cliente
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Fecha
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Total
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody id="filas-facturas" className="divide-y">
                      {rows.map((invoice) => (
                        <tr key={invoice.id} id={invoice.id}>
                          <th scope="row" className="p-4 font-medium">
                            {invoice.id}
                          </th>
                          <td className="text-muted-foreground p-4">{invoice.order}</td>
                          <td className="text-muted-foreground p-4">
                            <span className="flex items-center gap-1.5">
                              <XpStore size={13} />
                              {invoice.client}
                            </span>
                          </td>
                          <td className="text-muted-foreground p-4 tabular-nums">
                            {invoice.date}
                          </td>
                          <td className="p-4 font-semibold tabular-nums">
                            {formatCurrency(invoice.total)}
                          </td>
                          <td className="p-4">
                            <Badge variant={statusVariant[invoice.status]}>
                              {invoice.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {rows.length === 0 ? (
              <div className="border-border/80 text-muted-foreground flex flex-col items-center gap-4 rounded-3xl border border-dashed py-16 text-center">
                <XpCircleAlert size={26} className="opacity-50" />
                <p className="max-w-sm leading-relaxed">
                  No encontramos facturas con ese criterio de búsqueda.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setStatus('todas')
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            ) : null}
          </div>
        </RequireSession>
      </div>
    </section>
  )
}
