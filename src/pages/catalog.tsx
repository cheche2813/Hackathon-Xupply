import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  XpClock,
  XpFilter,
  XpHistory,
  XpMapPin,
  XpSearch,
  XpShoppingCart,
  XpStar,
  XpTrendingDown,
  XpTrendingUp,
  XpTruck,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/auth'
import { canSeePurchases } from '@/data/permissions'
import { categories, products, type Category, type Product } from '@/data/catalog'
import { formatCurrency } from '@/lib/format'
import { purchasedProducts, type PurchasedProduct } from '@/data/orders'
import { useCart } from '@/contexts/cart'
import { cn } from '@/lib/utils'

const stockLabel: Record<Product['stock'], string> = {
  alta: 'Stock alto',
  media: 'Stock medio',
  baja: 'Últimas unidades',
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const discount = product.previousPrice
    ? Math.round((1 - product.price / product.previousPrice) * 100)
    : 0

  return (
    <Card className="group h-full gap-0 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <span
            aria-hidden
            className="from-brand-soft to-muted flex size-16 items-center justify-center rounded-2xl bg-linear-to-br text-3xl"
          >
            {product.emoji}
          </span>
          {discount > 0 ? (
            <Badge className="bg-fresh text-white">-{discount}%</Badge>
          ) : (
            <Badge variant="outline">{product.tags[0]}</Badge>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-base leading-snug">{product.name}</CardTitle>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <XpMapPin size={13} />
            {product.supplier}
          </p>
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <XpStar size={13} className="text-clay" fill="currentColor" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews} reseñas)</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-end gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-2xl font-semibold tracking-tight">
              {formatCurrency(product.price)}
            </span>
            <span className="text-muted-foreground text-xs">por {product.unit}</span>
          </div>
          {product.previousPrice ? (
            <span className="text-muted-foreground text-sm line-through">
              {formatCurrency(product.previousPrice)}
            </span>
          ) : null}
        </div>
        <p className="text-muted-foreground flex items-center gap-2 text-xs">
          <XpTruck size={14} className="text-brand shrink-0" />
          {product.delivery}
        </p>
      </CardContent>

      <CardFooter className="flex-row items-center justify-between gap-3 bg-transparent">
        <Badge
          variant="secondary"
          className={
            product.stock === 'baja' ? 'bg-clay/10 text-clay' : 'bg-muted text-foreground/70'
          }
        >
          {stockLabel[product.stock]}
        </Badge>
        <Button
          size="sm"
          data-icon="inline-start"
          onClick={() => onAdd(product)}
          aria-label={`Añadir ${product.name} al carrito`}
        >
          <XpShoppingCart size={16} />
          Añadir
        </Button>
      </CardFooter>
    </Card>
  )
}

function PurchasedCard({
  product,
  purchase,
  onAdd,
}: {
  product: Product
  purchase: PurchasedProduct
  onAdd: (product: Product) => void
}) {
  const diff = product.price - purchase.lastUnitPrice
  const percent = Math.round((diff / purchase.lastUnitPrice) * 100)
  const wentDown = diff < 0
  const Trend = wentDown ? XpTrendingDown : XpTrendingUp

  return (
    <Card className="gap-0">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <span
            aria-hidden
            className="from-brand-soft to-muted flex size-14 items-center justify-center rounded-2xl bg-linear-to-br text-2xl"
          >
            {product.emoji}
          </span>
          <Badge variant="secondary" className="gap-1.5">
            <XpHistory size={13} />
            {purchase.times} compras
          </Badge>
        </div>
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-base leading-snug">{product.name}</CardTitle>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <XpMapPin size={13} />
            {product.supplier}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-end gap-4">
        <div className="text-muted-foreground grid grid-cols-2 gap-3 text-xs">
          <span className="flex flex-col">
            <span className="text-muted-foreground/80">Última compra</span>
            <span className="text-foreground font-medium">
              {purchase.lastPurchase} · {purchase.quantity}
            </span>
          </span>
          <span className="flex flex-col">
            <span className="text-muted-foreground/80">Total histórico</span>
            <span className="text-foreground font-medium tabular-nums">
              {formatCurrency(purchase.totalSpent)}
            </span>
          </span>
        </div>
        <div className="bg-brand-soft/40 flex flex-wrap items-center justify-between gap-2 rounded-xl p-3">
          <span className="flex flex-col">
            <span className="text-muted-foreground text-xs">Precio actual</span>
            <span className="font-heading text-lg font-semibold tabular-nums">
              {formatCurrency(product.price)}
              <span className="text-muted-foreground ml-1 text-xs font-normal">
                /{product.unit}
              </span>
            </span>
          </span>
          <span
            className={
              'flex items-center gap-1 text-xs font-medium ' +
              (wentDown ? 'text-fresh' : 'text-clay')
            }
          >
            <Trend size={14} />
            {wentDown ? `${Math.abs(percent)}% más barato` : `${percent}% más caro`} que tu
            última compra
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex-row items-center justify-between gap-3 bg-transparent">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <XpClock size={13} />
          Última: {purchase.lastPurchase}
        </span>
        <Button size="sm" data-icon="inline-start" onClick={() => onAdd(product)}>
          <XpShoppingCart size={16} />
          Volver a comprar
        </Button>
      </CardFooter>
    </Card>
  )
}

export function Catalog() {
  const { user } = useAuth()
  const [tab, setTab] = useState<'catalogo' | 'comprados'>('catalogo')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('todas')
  const { addToCart, count } = useCart()
  const showPurchases = canSeePurchases(user?.role)

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = category === 'todas' || product.category === category
      const matchesQuery =
        term.length === 0 ||
        product.name.toLowerCase().includes(term) ||
        product.supplier.toLowerCase().includes(term)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const purchases = useMemo(() => {
    const term = query.trim().toLowerCase()
    const entries: { purchase: PurchasedProduct; product: Product }[] = []
    for (const purchase of purchasedProducts) {
      const product = products.find((item) => item.id === purchase.productId)
      if (!product) continue
      const matchesCategory = category === 'todas' || product.category === category
      const matchesQuery =
        term.length === 0 ||
        product.name.toLowerCase().includes(term) ||
        product.supplier.toLowerCase().includes(term)
      if (matchesCategory && matchesQuery) entries.push({ purchase, product })
    }
    return entries
  }, [category, query])

  const totalSpent = purchasedProducts.reduce((sum, item) => sum + item.totalSpent, 0)

  const handleAdd = (product: Product) => {
    addToCart(product)
    toast.success(`${product.name} en el carrito`, {
      description: `${formatCurrency(product.price)} por ${product.unit} · ${product.supplier}`,
    })
  }

  return (
    <section id="catalogo" className="section" data-endpoint="/api/products">
      <div className="container-page flex flex-col gap-16 lg:gap-20">
        <SectionHeading
          eyebrow="Catálogo mayorista"
          title="Precios de verdad, sin llamadas de por medio"
          description="Una muestra del catálogo que usan los restaurantes de Bucaramanga. Filtra, compara y arma tu pedido."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-2 text-sm">
            <XpShoppingCart size={16} />
            <span aria-live="polite">
              {count === 0
                ? 'Tu carrito está vacío'
                : `${count} ${count === 1 ? 'producto en el carrito' : 'productos en el carrito'}`}
            </span>
            {count > 0 ? (
              <a
                href="#carrito"
                className="text-brand font-medium underline underline-offset-4 transition-colors hover:text-brand-strong"
              >
                Ver carrito
              </a>
            ) : null}
          </div>
        </SectionHeading>

        {showPurchases ? (
          <div
            role="tablist"
            aria-label="Vistas de productos"
            className="border-border bg-muted/60 inline-flex w-full gap-1 rounded-2xl border p-1 sm:w-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'catalogo'}
              onClick={() => setTab('catalogo')}
              className={cn(
                'flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:flex-none',
                tab === 'catalogo'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Catálogo
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'comprados'}
              onClick={() => setTab('comprados')}
              className={cn(
                'flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:flex-none',
                tab === 'comprados'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Comprados
            </button>
          </div>
        ) : null}

        {tab === 'catalogo' || !showPurchases ? (
          <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <XpSearch
                  size={18}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Producto, SKU o proveedor"
                  aria-label="Buscar en el catálogo"
                  className="h-11 pl-11"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <XpFilter size={18} className="text-muted-foreground hidden sm:block" />
                <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                  <SelectTrigger className="h-11 w-full sm:w-64" aria-label="Filtrar por categoría">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {visible.length > 0 ? (
              <div
                id="lista-productos"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4"
              >
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={handleAdd} />
                ))}
              </div>
            ) : (
              <div className="border-border/80 text-muted-foreground flex flex-col items-center gap-4 rounded-3xl border border-dashed py-20 text-center">
                <XpSearch size={28} className="opacity-50" />
                <p className="max-w-sm leading-relaxed">
                  No encontramos productos con ese filtro. Prueba con otra categoría o escríbenos:
                  lo conseguimos con nuestros proveedores.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setCategory('todas')
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}

            <p className="text-muted-foreground text-center text-sm">
              Mostrando {visible.length} de {products.length} productos del catálogo demo
            </p>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card size="sm">
                <CardContent className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Productos comprados</span>
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {purchasedProducts.length}
                  </span>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Órdenes a proveedores</span>
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {purchasedProducts.reduce((sum, item) => sum + item.times, 0)}
                  </span>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs">Inversión histórica</span>
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {formatCurrency(totalSpent)}
                  </span>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <XpSearch
                  size={18}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar entre los que ya compraste"
                  aria-label="Buscar en productos comprados"
                  className="h-11 pl-11"
                />
              </div>
              <Badge variant="outline" className="w-fit gap-1.5">
                <XpHistory size={13} />
                Historial de compras del restaurante
              </Badge>
            </div>

            {purchases.length > 0 ? (
              <div
                id="lista-comprados"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              >
                {purchases.map(({ product, purchase }) => (
                  <PurchasedCard
                    key={product.id}
                    product={product}
                    purchase={purchase}
                    onAdd={handleAdd}
                  />
                ))}
              </div>
            ) : (
              <div className="border-border/80 text-muted-foreground flex flex-col items-center gap-4 rounded-3xl border border-dashed py-20 text-center">
                <XpHistory size={28} className="opacity-50" />
                <p className="max-w-sm leading-relaxed">
                  Todavía no has comprado productos que coincidan con ese filtro.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setCategory('todas')
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
