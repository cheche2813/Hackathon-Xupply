import { toast } from 'sonner'

import {
  XpArrowRight,
  XpCheck,
  XpMinus,
  XpPlus,
  XpShoppingCart,
  XpTruck,
  XpX,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MAX_QUANTITY_PER_ITEM, useCart, type CartItem } from '@/contexts/cart'
import { formatCurrency } from '@/lib/format'

function QuantityStepper({
  item,
  onChange,
}: {
  item: CartItem
  onChange: (quantity: number) => void
}) {
  return (
    <div className="border-border flex items-center gap-1 rounded-xl border p-1">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => onChange(item.quantity - 1)}
        aria-label={`Quitar un ${item.product.unit} de ${item.product.name}`}
      >
        <XpMinus size={14} />
      </Button>
      <span
        className="w-10 text-center text-sm font-semibold tabular-nums"
        aria-live="polite"
        aria-label={`Cantidad de ${item.product.name}`}
      >
        {item.quantity}
      </span>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => onChange(item.quantity + 1)}
        disabled={item.quantity >= MAX_QUANTITY_PER_ITEM}
        aria-label={`Añadir un ${item.product.unit} de ${item.product.name}`}
      >
        <XpPlus size={14} />
      </Button>
    </div>
  )
}

function CartLine({ item }: { item: CartItem }) {
  const { removeFromCart, updateQuantity } = useCart()
  const { product, quantity } = item

  const handleRemove = () => {
    removeFromCart(product.id)
    toast.info(`${product.name} salió del carrito`, {
      description: 'Puedes volver a agregarlo desde el catálogo.',
    })
  }

  return (
    <Card size="sm" className="gap-0">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="from-brand-soft to-muted flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-2xl"
          >
            {product.emoji}
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-sm leading-snug">{product.name}</CardTitle>
            <p className="text-muted-foreground text-xs">
              {product.supplier} · {formatCurrency(product.price)} por {product.unit}
            </p>
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <XpTruck size={13} className="text-brand shrink-0" />
              {product.delivery}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <QuantityStepper item={item} onChange={(next) => updateQuantity(product.id, next)} />
          <div className="flex w-28 flex-col items-end">
            <span className="font-heading text-lg font-semibold tracking-tight tabular-nums">
              {formatCurrency(product.price * quantity)}
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={handleRemove}
              data-icon="inline-start"
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Eliminar ${product.name} del carrito`}
            >
              <XpX size={13} />
              Quitar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Cart() {
  const { items, count, isEmpty, subtotal, clearCart } = useCart()

  const handleClear = () => {
    clearCart()
    toast.info('Carrito vacío', {
      description: 'Quitamos todos los productos de tu pedido.',
    })
  }

  if (isEmpty) {
    return (
      <section id="carrito" className="section">
        <div className="container-page flex flex-col items-center gap-8 py-10 text-center lg:py-20">
          <div className="bg-brand-soft text-brand flex size-20 items-center justify-center rounded-full">
            <XpShoppingCart size={32} />
          </div>
          <div className="flex max-w-lg flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Tu carrito está vacío
            </h2>
            <p className="text-muted-foreground text-lg">
              Todavía no has agregado productos. Explora el catálogo mayorista y arma tu pedido con
              los precios que manejan los restaurantes de Bucaramanga.
            </p>
          </div>
          <Button asChild variant="brand" size="xl" data-icon="inline-end">
            <a href="#catalogo">
              Ver catálogo
              <XpArrowRight size={18} />
            </a>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section id="carrito" className="section" data-endpoint="/api/orders">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Tu pedido"
          title="Carrito de compras"
          description="Revisa los productos, ajusta las cantidades y continúa al resumen del pedido."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-start gap-2 text-sm">
            <XpShoppingCart size={16} />
            <span>
              {count} {count === 1 ? 'producto' : 'productos'} en {items.length}{' '}
              {items.length === 1 ? 'referencia' : 'referencias'}
            </span>
          </div>
        </SectionHeading>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
          <div className="flex flex-col gap-4" id="lista-carrito">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase">
                Productos en el carrito
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                data-icon="inline-start"
                className="text-muted-foreground hover:text-destructive"
              >
                <XpX size={15} />
                Vaciar carrito
              </Button>
            </div>

            {items.map((item) => (
              <CartLine key={item.product.id} item={item} />
            ))}
          </div>

          <Card className="gap-0 lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Productos</span>
                <span className="font-medium tabular-nums">{count}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Entrega</span>
                <span className="text-muted-foreground">Se coordina con el proveedor</span>
              </div>
              <Separator />
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">Total estimado</span>
                <span
                  id="total-carrito"
                  className="font-heading text-2xl font-semibold tracking-tight tabular-nums"
                >
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Valor estimado para tu pedido. Xupply todavía no procesa pagos ni factura, por eso
                este monto es referencial.
              </p>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3">
              <Button asChild variant="brand" size="lg" data-icon="inline-end">
                <a href="#pedidos">
                  Ver resumen del pedido
                  <XpArrowRight size={18} />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#catalogo">Seguir comprando</a>
              </Button>
              <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
                <XpCheck size={13} className="text-fresh" />
                Sin pagos en esta versión
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
