import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  XpArrowRight,
  XpBarChart3,
  XpBot,
  XpBoxes,
  XpCamera,
  XpCircleCheck,
  XpClock,
  XpLayers,
  XpNavigation,
  XpPackage,
  XpReceipt,
  XpShieldCheck,
  XpShoppingCart,
  XpStore,
  XpTruck,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/auth'
import { useCart } from '@/contexts/cart'
import { modules, stats } from '@/data/dashboard'
import { readImageFile, readPhoto, writePhoto } from '@/lib/photos'

const moduleIcons = {
  XpBoxes,
  XpReceipt,
  XpBarChart3,
  XpNavigation,
  XpBot,
} as const

const firstName = (name: string) => name.split(' ')[0]

const apiStateLabel = {
  verificando: 'Estado del servicio: verificando…',
  activo: 'Estado del servicio: conectado a /health',
  desconectado: 'Estado del servicio: sin conexión con la API',
} as const

export function Dashboard() {
  const { user, isAuthenticated, signOut } = useAuth()
  const { count } = useCart()
  const [uploaded, setUploaded] = useState<string | null>(null)
  const [apiState, setApiState] = useState<keyof typeof apiStateLabel>('verificando')
  const photoInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/health')
      .then((response) => {
        if (!cancelled) setApiState(response.ok ? 'activo' : 'desconectado')
      })
      .catch(() => {
        if (!cancelled) setApiState('desconectado')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleSignOut = () => {
    signOut()
    window.location.hash = '#inicio'
    toast.info('Sesión cerrada', { description: 'Volviste al inicio de Xupply.' })
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const photo = uploaded ?? readPhoto(user.id)

  const handlePhoto = async (file: File | undefined) => {
    if (!file) return

    const dataUrl = await readImageFile(file)

    if (!dataUrl) {
      toast.error('No pudimos leer la imagen', { description: 'Usa un archivo JPG o PNG.' })
      return
    }

    writePhoto(user.id, dataUrl)
    setUploaded(dataUrl)
    toast.success('Foto de perfil actualizada', {
      description: 'Solo se guarda en este navegador.',
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-6">
          <SectionHeading
            align="left"
            eyebrow="Tu espacio"
            title={`Hola, ${firstName(user.name)}`}
            description="Este es tu espacio en Xupply. Hoy los cinco roles comparten la misma pantalla; pronto cada uno verá lo que le corresponde."
          >
            <Badge className="gap-1.5">
              <XpCircleCheck size={13} />
              Sesión activa
            </Badge>
          </SectionHeading>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} size="sm">
                <CardContent className="flex flex-col gap-1">
                  <span className="font-heading text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground text-xs">{stat.label}</span>
                </CardContent>
              </Card>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold tracking-wide uppercase">Módulos</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => {
                  const Icon = moduleIcons[module.icon as keyof typeof moduleIcons] ?? XpLayers
                  return (
                    <a key={module.title} href={module.href} className="group block h-full">
                      <Card
                        size="sm"
                        className="h-full transition-colors group-hover:border-brand/40"
                      >
                        <CardContent className="flex items-start gap-3">
                          <span className="bg-brand-soft text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
                            <Icon size={18} />
                          </span>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold">{module.title}</span>
                            <span className="text-muted-foreground text-xs leading-relaxed">
                              {module.description}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="flex justify-center lg:justify-end">
              <div className="relative shrink-0">
                <Avatar className="size-28 sm:size-32">
                  {photo ? (
                    <AvatarImage src={photo} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-brand-soft text-brand text-3xl font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button
                  size="icon"
                  variant="brand"
                  className="ring-background absolute -right-1 -bottom-1 size-10 rounded-full ring-4"
                  aria-label="Cambiar foto de perfil"
                  onClick={() => photoInput.current?.click()}
                >
                  <XpCamera size={17} />
                </Button>
              </div>
            </div>

            <input
              ref={photoInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void handlePhoto(event.target.files?.[0])
                event.target.value = ''
              }}
            />

            <Card className="gap-0">
              <CardHeader>
                <CardTitle>Tu sesión</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-muted-foreground text-xs">{user.email}</span>
                </div>
                <Separator />
                {user.businessName ? (
                  <div className="flex flex-col gap-1.5 text-sm">
                    <span className="text-muted-foreground text-xs">Negocio</span>
                    <span className="font-medium">{user.businessName}</span>
                  </div>
                ) : null}
                <div className="flex flex-col gap-1.5 text-sm">
                  <span className="text-muted-foreground text-xs">Rol en Xupply</span>
                  <span className="font-medium">{user.roleLabel}</span>
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  <span className="text-muted-foreground text-xs">Tipo de cuenta</span>
                  <span className="font-medium">{user.accountTypeLabel}</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{user.focus}</p>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <XpClock size={14} className="text-brand shrink-0" />
                  Entregas en 24 h en el área metropolitana
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-2.5">
                <Button asChild variant="brand" data-icon="inline-end">
                  <a href="#catalogo">
                    <XpShoppingCart size={17} />
                    Armar un pedido
                    <XpArrowRight size={17} />
                  </a>
                </Button>
                <Button asChild variant="ghost" data-icon="inline-start">
                  <a href="#proveedores">
                    <XpStore size={17} />
                    Ver proveedores
                  </a>
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                  Cerrar sesión
                </Button>
              </CardFooter>
            </Card>

            <Card size="sm" className="border-brand/20 bg-brand-soft/40">
              <CardContent className="flex items-start gap-3">
                <XpPackage size={18} className="text-brand mt-0.5 shrink-0" />
                <p className="text-sm leading-relaxed">
                  Tienes {count} {count === 1 ? 'producto' : 'productos'} en el carrito.{' '}
                  <a
                    href="#carrito"
                    className="text-brand font-medium underline underline-offset-4 transition-colors hover:text-brand-strong"
                  >
                    Ver carrito
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="gap-0">
          <CardContent className="flex flex-col items-start gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <XpTruck size={20} className="text-brand mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">
                Xupply ya coordina proveedores verificados de Bucaramanga. Cada rol tendrá su
                propio panel con pedidos, inventario y rutas.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 gap-1.5">
              <XpShieldCheck size={13} />
              Roles separados por permisos
            </Badge>
          </CardContent>
        </Card>

        <p
          id="estado-api"
          data-endpoint="/health"
          aria-live="polite"
          className="text-muted-foreground text-xs"
        >
          {apiStateLabel[apiState]}
        </p>
    </div>
  )
}
