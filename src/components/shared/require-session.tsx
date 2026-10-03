import type { ReactNode } from 'react'
import { useState } from 'react'

import { XpLock } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth'

type RequireSessionProps = {
  children: ReactNode
  title: string
  description: string
  endpoint: string
  className?: string
}

export function RequireSession({
  children,
  title,
  description,
  endpoint,
  className,
}: RequireSessionProps) {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <Card className={className} data-endpoint={endpoint}>
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="bg-brand-soft text-brand flex size-16 items-center justify-center rounded-full">
          <XpLock size={26} />
        </span>
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="brand">Iniciar sesión</Button>
          </DialogTrigger>
          <DialogContent id="dialogo-sesion" className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sesión requerida</DialogTitle>
              <DialogDescription>
                Este contenido necesita tu cuenta de Xupply. Inicia sesión para ver pedidos,
                inventario y facturación.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Ahora no</Button>
              </DialogClose>
              <Button asChild variant="brand">
                <a href="#acceso" onClick={() => setOpen(false)}>
                  Ir al acceso
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
