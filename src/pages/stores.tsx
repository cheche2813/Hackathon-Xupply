import { useMemo, useState } from 'react'

import {
  XpArrowRight,
  XpClock,
  XpHandCoins,
  XpHistory,
  XpMapPin,
  XpPackage,
  XpSearch,
  XpShieldCheck,
  XpStar,
  XpStore,
  XpTruck,
  XpUsers,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth'
import { canSeePurchases } from '@/data/permissions'
import { categories, products, suppliers, type Category, type Product, type Supplier } from '@/data/catalog'
import { formatCurrency } from '@/lib/format'
import { mySuppliers, type MySupplier } from '@/data/orders'
import { cn } from '@/lib/utils'

const categoryLabel = (value: string) =>
  categories.find((item) => item.value === value)?.label ?? value

export function Stores() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'directorio' | 'mis-proveedores'>('directorio')
  const [query, setQuery] = useState('')
  const showPurchases = canSeePurchases(user?.role)

  const stores = useMemo(() => {
    const term = query.trim().toLowerCase()

    return suppliers
      .map((supplier) => {
        const items = products.filter((product) => product.supplier === supplier.name)
        const usedCategories = Array.from(new Set(items.map((item) => item.category)))
        return { ...supplier, items, usedCategories }
      })
      .filter(
        (supplier) =>
          term.length === 0 ||
          supplier.name.toLowerCase().includes(term) ||
          supplier.zone.toLowerCase().includes(term),
      )
  }, [query])

  const purchased = useMemo(() => {
    const term = query.trim().toLowerCase()
    const entries: (Supplier & {
      relation: MySupplier
      items: Product[]
      usedCategories: Category[]
    })[] = []

    for (const relation of mySuppliers) {
      const supplier = suppliers.find((item) => item.id === relation.id)
      if (!supplier) continue
      const items = products.filter((product) => product.supplier === supplier.name)
      const usedCategories = Array.from(new Set(items.map((item) => item.category)))
      const entry = { ...supplier, relation, items, usedCategories }
      const matches =
        term.length === 0 ||
        entry.name.toLowerCase().includes(term) ||
        entry.zone.toLowerCase().includes(term) ||
        entry.relation.contact.toLowerCase().includes(term)
      if (matches) entries.push(entry)
    }

    return entries
  }, [query])

  const totalProducts = products.length
  const totalSpent = mySuppliers.reduce((sum, item) => sum + item.totalSpent, 0)

  return (
    <section id="proveedores" className="section" data-endpoint="/api/suppliers">
      <div className="container-page flex flex-col gap-16 lg:gap-20">
        <SectionHeading
          align="left"
          eyebrow="Proveedores"
          title="Proveedores verificados de Bucaramanga"
          description="Cada tienda tiene su propio inventario, sus tiempos de despacho y su pedido mínimo. Revisa cuáles te quedan más cerca."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-start gap-2 text-sm">
            <XpStore size={16} />
            <span>
              {suppliers.length} tiendas · {totalProducts} productos en el catálogo demo
            </span>
          </div>
        </SectionHeading>

        {showPurchases ? (
          <div
            role="tablist"
            aria-label="Vistas de proveedores"
            className="border-border bg-muted/60 inline-flex w-full gap-1 rounded-2xl border p-1 sm:w-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'directorio'}
              onClick={() => setTab('directorio')}
              className={cn(
                'flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:flex-none',
                tab === 'directorio'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Directorio
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'mis-proveedores'}
              onClick={() => setTab('mis-proveedores')}
              className={cn(
                'flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:flex-none',
                tab === 'mis-proveedores'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Mis proveedores
            </button>
          </div>
        ) : null}

        {tab === 'mis-proveedores' && showPurchases ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card size="sm">
                <CardContent className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Proveedores con los que compro</span>
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {mySuppliers.length}
                  </span>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Órdenes enviadas</span>
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {mySuppliers.reduce((sum, item) => sum + item.orders, 0)}
                  </span>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Inversión con proveedores</span>
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {formatCurrency(totalSpent)}
                  </span>
                </CardContent>
              </Card>
            </div>

            {purchased.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {purchased.map((store) => (
                  <Card
                    key={store.id}
                    className="h-full gap-0 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10"
                  >
                    <CardHeader className="gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          aria-hidden
                          className="from-brand-soft to-muted flex size-16 items-center justify-center rounded-2xl bg-linear-to-br text-3xl"
                        >
                          {store.emoji}
                        </span>
                        <Badge className="gap-1.5">
                          <XpHistory size={13} />
                          {store.relation.orders} órdenes
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <XpMapPin size={13} />
                          {store.zone}
                        </p>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <XpUsers size={13} className="text-brand shrink-0" />
                        {store.relation.contact} · {store.relation.phone}
                      </p>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col justify-end gap-3 text-sm">
                      <div className="bg-brand-soft/40 grid grid-cols-2 gap-3 rounded-xl p-3 text-xs">
                        <span className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground/80">Última orden</span>
                          <span className="text-foreground font-medium">
                            {store.relation.lastOrder}
                          </span>
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-muted-foreground/80">Total histórico</span>
                          <span className="text-foreground font-medium tabular-nums">
                            {formatCurrency(store.relation.totalSpent)}
                          </span>
                        </span>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-2 text-xs">
                        <XpHandCoins size={14} className="text-brand shrink-0" />
                        {store.relation.paymentTerms}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-2 text-xs">
                        <XpClock size={14} className="text-brand shrink-0" />
                        Más pedido: {store.relation.bestSeller}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {store.usedCategories.map((category) => (
                          <Badge key={category} variant="outline">
                            {categoryLabel(category)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex-row items-center justify-between gap-3 bg-transparent">
                      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <XpTruck size={13} />
                        {store.delivery}
                      </span>
                      <Button asChild size="sm" data-icon="inline-end">
                        <a href="#catalogo">
                          Ver productos
                          <XpArrowRight size={16} />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="border-border/80 text-muted-foreground flex flex-col items-center gap-4 rounded-3xl border border-dashed py-20 text-center">
                <XpSearch size={28} className="opacity-50" />
                <p className="max-w-sm leading-relaxed">
                  No encontramos proveedores con los que hayas comprado que coincidan con esa
                  búsqueda.
                </p>
                <Button variant="outline" onClick={() => setQuery('')}>
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="relative w-full lg:max-w-sm">
              <XpSearch
                size={18}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tienda o zona de cobertura"
                aria-label="Buscar tienda"
                className="h-11 pl-11"
              />
            </div>

            {stores.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {stores.map((store) => (
                  <Card
                    key={store.id}
                    className="h-full gap-0 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10"
                  >
                    <CardHeader className="gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          aria-hidden
                          className="from-brand-soft to-muted flex size-16 items-center justify-center rounded-2xl bg-linear-to-br text-3xl"
                        >
                          {store.emoji}
                        </span>
                        {store.verified ? (
                          <Badge variant="secondary" className="gap-1.5">
                            <XpShieldCheck size={13} className="text-fresh" />
                            Verificada
                          </Badge>
                        ) : (
                          <Badge variant="outline">En verificación</Badge>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <XpMapPin size={13} />
                          {store.zone}
                        </p>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <XpStar size={13} className="text-clay" fill="currentColor" />
                        <span className="font-medium text-foreground">{store.rating}</span>
                        <span>({store.reviews} reseñas)</span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col justify-end gap-3 text-sm">
                      <p className="text-muted-foreground flex items-center gap-2 text-xs">
                        <XpTruck size={14} className="text-brand shrink-0" />
                        {store.delivery}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-2 text-xs">
                        <XpPackage size={14} className="text-brand shrink-0" />
                        Pedido mínimo {formatCurrency(store.minOrder)}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {store.usedCategories.map((category) => (
                          <Badge key={category} variant="outline">
                            {categoryLabel(category)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex-row items-center justify-between gap-3 bg-transparent">
                      <span className="text-muted-foreground text-xs">
                        {store.items.length}{' '}
                        {store.items.length === 1 ? 'producto' : 'productos'}
                      </span>
                      <Button asChild size="sm" data-icon="inline-end">
                        <a href="#catalogo">
                          Ver productos
                          <XpArrowRight size={16} />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="border-border/80 text-muted-foreground flex flex-col items-center gap-4 rounded-3xl border border-dashed py-20 text-center">
                <XpSearch size={28} className="opacity-50" />
                <p className="max-w-sm leading-relaxed">
                  No encontramos tiendas con ese nombre. Prueba con otra zona de cobertura.
                </p>
                <Button variant="outline" onClick={() => setQuery('')}>
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
