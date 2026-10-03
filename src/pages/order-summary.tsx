import { useState, type FormEvent } from 'react'

import {
  XpArrowRight,
  XpCircleAlert,
  XpMapPin,
  XpReceipt,
  XpShieldCheck,
  XpShoppingCart,
  XpStore,
  XpTruck,
  XpWallet,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useCart, type CartItem } from '@/contexts/cart'
import { formatCurrency } from '@/lib/format'
import { toast } from 'sonner'

const groupBySupplier = (items: CartItem[]) => {
  const groups = new Map<string, { supplier: string; items: CartItem[]; subtotal: number }>()

  for (const item of items) {
    const existing = groups.get(item.product.supplier)
    if (existing) {
      existing.items.push(item)
      existing.subtotal += item.product.price * item.quantity
      continue
    }
    groups.set(item.product.supplier, {
      supplier: item.product.supplier,
      items: [item],
      subtotal: item.product.price * item.quantity,
    })
  }

  return Array.from(groups.values())
}

export function OrderSummary() {
  const { items, count, isEmpty, subtotal } = useCart()
  const groups = groupBySupplier(items)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (address.trim().length === 0) {
      toast.error('Escribe la dirección de entrega para continuar.')
      return
    }

    toast.success('Pedido registrado en modo demo', {
      description:
        'Tu pedido quedó en la lista, pero el pago y la factura se habilitan cuando conectemos la API.',
    })
  }

  if (isEmpty) {
    return (
      <section id="pedidos" className="section" data-endpoint="/api/orders">
        <div className="container-page flex flex-col items-center gap-8 py-10 text-center lg:py-20">
          <div className="bg-brand-soft text-brand flex size-20 items-center justify-center rounded-full">
            <XpReceipt size={32} />
          </div>
          <div className="flex max-w-lg flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              No hay nada que resumir
            </h2>
            <p className="text-muted-foreground text-lg">
              Tu carrito está vacío, así que todavía no podemos mostrar el resumen de tu pedido.
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
    <section id="pedidos" className="section" data-endpoint="/api/orders">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground -ml-3 w-fit"
        >
          <a href="#carrito">
            <XpArrowRight size={15} className="rotate-180" />
            Volver al carrito
          </a>
        </Button>

        <SectionHeading
          align="left"
          eyebrow="Paso 2 de 2"
          title="Resumen del pedido"
          description="Revisa los productos de tu pedido. Por ahora solo mostramos el resumen: el pago y la facturación todavía no están disponibles."
        >
          <Badge variant="secondary" className="gap-1.5">
            <XpShieldCheck size={13} />
            Sin pagos en esta versión
          </Badge>
        </SectionHeading>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
          <div className="flex flex-col gap-6" id="lineas-pedido">
            {groups.map((group) => (
              <Card key={group.supplier} className="gap-0">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <XpStore size={16} className="text-brand shrink-0" />
                    {group.supplier}
                  </CardTitle>
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <XpTruck size={13} className="text-brand shrink-0" />
                    Entrega coordinada con este proveedor
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col divide-y">
                  {group.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="from-brand-soft to-muted flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-xl"
                        >
                          {item.product.emoji}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">{item.product.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {formatCurrency(item.product.price)} por {item.product.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <Badge variant="secondary" className="tabular-nums">
                          ×{item.quantity}
                        </Badge>
                        <span className="font-heading text-base font-semibold tabular-nums">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="justify-between gap-4">
                  <span className="text-muted-foreground text-sm">
                    Subtotal {group.supplier}
                  </span>
                  <span className="font-heading text-lg font-semibold tabular-nums">
                    {formatCurrency(group.subtotal)}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="gap-0 lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Totales</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Productos</span>
                <span className="font-medium tabular-nums">{count}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Proveedores</span>
                <span className="font-medium tabular-nums">{groups.length}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-muted-foreground">Por definir</span>
              </div>
              <Separator />
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">Total estimado</span>
                <span className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3">
              <Button size="lg" disabled data-icon="inline-start" className="w-full">
                <XpWallet size={18} />
                Pagar pedido
              </Button>
              <p className="text-muted-foreground flex items-start gap-2 text-xs leading-relaxed">
                <XpCircleAlert size={14} className="text-brand mt-0.5 shrink-0" />
                El pago en línea y la facturación electrónica todavía no están disponibles en Xupply.
                Te avisaremos por correo cuando estén listos.
              </p>
              <Button asChild variant="outline" size="lg">
                <a href="#carrito">Volver al carrito</a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="border-brand/20 bg-brand-soft/40 gap-0">
          <CardContent className="flex flex-col items-start gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <XpMapPin size={20} className="text-brand mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">
                Entregamos en Bucaramanga y el área metropolitana. Cuando la facturación esté
                activa podrás confirmar la dirección de entrega y el medio de pago desde aquí.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="shrink-0" data-icon="inline-start">
              <a href="#catalogo">
                <XpShoppingCart size={15} />
                Añadir más productos
              </a>
            </Button>
          </CardContent>
        </Card>

        <form id="formulario-confirmacion" data-endpoint="/api/orders" onSubmit={handleConfirm}>
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <XpMapPin size={16} className="text-brand shrink-0" />
                Datos de entrega
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                El domiciliario usa esta dirección para entregar tu pedido.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="direccion-entrega">Dirección de entrega</Label>
                <Input
                  id="direccion-entrega"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Calle 45 # 12-30, barrio Cabecera"
                  className="h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notas-pedido">Notas del pedido</Label>
                <Textarea
                  id="notas-pedido"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Horario de entrega, acceso al local, indicaciones especiales…"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground flex items-start gap-2 text-xs leading-relaxed">
                <XpCircleAlert size={14} className="text-brand mt-0.5 shrink-0" />
                Por ahora el pedido se registra en modo demo: todavía no hay pago ni factura
                electrónica.
              </p>
              <Button type="submit" variant="brand" size="lg" className="shrink-0">
                Confirmar pedido
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </section>
  )
}
