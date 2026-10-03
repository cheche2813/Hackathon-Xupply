import { useMemo, useState } from 'react'

import { XpBoxes, XpCircleAlert, XpFilter, XpPackage, XpStore } from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { RequireSession } from '@/components/shared/require-session'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { inventory, stockState, type StockState } from '@/data/inventory'

const stateVariant: Record<StockState, 'secondary' | 'outline' | 'destructive'> = {
  Óptimo: 'secondary',
  'Por agotar': 'outline',
  Crítico: 'destructive',
}

export function Inventory() {
  const [query, setQuery] = useState('')
  const [onlyAlerts, setOnlyAlerts] = useState(false)

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()

    return inventory.filter((item) => {
      const matchesTerm =
        term.length === 0 ||
        item.input.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.supplier.toLowerCase().includes(term)
      const matchesAlert = !onlyAlerts || stockState(item) !== 'Óptimo'
      return matchesTerm && matchesAlert
    })
  }, [onlyAlerts, query])

  const alerts = inventory.filter((item) => stockState(item) !== 'Óptimo').length

  return (
    <section id="inventario" className="section" data-endpoint="/api/inventory">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Control de insumos"
          title="Inventario"
          description="Entradas, salidas y mínimos por insumo. Te avisamos antes de quedarte sin producto."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-start gap-2 text-sm">
            <XpBoxes size={16} />
            <span>
              {inventory.length} insumos · {alerts} necesitan atención
            </span>
          </div>
        </SectionHeading>

        <RequireSession
          endpoint="/api/inventory"
          title="Tu inventario está en el panel"
          description="Inicia sesión para ver el stock de tus insumos, los mínimos y las alertas de reposición."
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar insumo, categoría o proveedor"
                  aria-label="Buscar en el inventario"
                  className="h-11"
                />
              </div>
              <Button
                variant={onlyAlerts ? 'brand' : 'outline'}
                onClick={() => setOnlyAlerts((value) => !value)}
                data-icon="inline-start"
              >
                <XpFilter size={16} />
                Solo alertas
              </Button>
            </div>

            <Card className="gap-0 overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-3xl border-collapse text-left text-sm">
                    <caption className="sr-only">Inventario de insumos del restaurante</caption>
                    <thead>
                      <tr className="border-b">
                        <th scope="col" className="p-4 font-medium">
                          Insumo
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Categoría
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Stock
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Mínimo
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Proveedor
                        </th>
                        <th scope="col" className="p-4 font-medium">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody id="filas-inventario" className="divide-y">
                      {rows.map((item) => {
                        const state = stockState(item)

                        return (
                          <tr key={item.id} id={item.id}>
                            <th scope="row" className="p-4 font-medium">
                              <span className="flex items-center gap-2.5">
                                <XpPackage size={15} className="text-brand shrink-0" />
                                {item.input}
                              </span>
                            </th>
                            <td className="text-muted-foreground p-4">{item.category}</td>
                            <td className="p-4 tabular-nums">
                              {item.stock} {item.unit}
                            </td>
                            <td className="text-muted-foreground p-4 tabular-nums">
                              {item.minimum} {item.unit}
                            </td>
                            <td className="text-muted-foreground p-4">
                              <span className="flex items-center gap-1.5">
                                <XpStore size={13} />
                                {item.supplier}
                              </span>
                            </td>
                            <td className="p-4">
                              <Badge variant={stateVariant[state]}>{state}</Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {rows.length === 0 ? (
              <div className="border-border/80 text-muted-foreground flex flex-col items-center gap-4 rounded-3xl border border-dashed py-16 text-center">
                <XpCircleAlert size={26} className="opacity-50" />
                <p className="max-w-sm leading-relaxed">
                  No hay insumos que coincidan con ese filtro.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setOnlyAlerts(false)
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
