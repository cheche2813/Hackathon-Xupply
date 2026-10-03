import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  XpMapPin,
  XpMenu,
  XpPhone,
  XpShoppingCart,
  XpUsers,
  XpX,
} from '@/components/icons'
import { Brand } from '@/components/shared/brand'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { menuSectionsByRole, navLinksByRole } from '@/data/navigation'
import { can } from '@/data/permissions'
import { accountLabel } from '@/data/users'
import { useAuth } from '@/contexts/auth'
import { useCart } from '@/contexts/cart'
import { cn } from '@/lib/utils'

// Aqui no se reutiliza el resolveHash de la app: el resalte del menu sigue la
// seccion que el usuario esta viendo de verdad, no la ruta de render.
// #registro y #pedidos se muestran dentro de #acceso y del carrito, asi que el
// resalte del menu sigue la seccion que realmente se esta viendo.
const normalizeHash = (hash: string) => {
  const value = hash.toLowerCase()
  if (value === '' || value === '#') return '#inicio'
  if (value === '#registro') return '#acceso'
  if (value === '#pedidos') return '#carrito'
  return value
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState(() => normalizeHash(window.location.hash))
  const { count } = useCart()
  const { user, isAuthenticated, signOut } = useAuth()

  useEffect(() => {
    const syncHash = () => setCurrentHash(normalizeHash(window.location.hash))

    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  const isActive = (href: string) => currentHash === href

  // Cada rol tiene su menu: el administrador ve administracion, el
  // domiciliario solo su cuenta y su mapa, y el resto el menu comercial.
  const links = navLinksByRole(user?.role)
  const showCart = can(user?.role, 'carrito')
  const extraSections = menuSectionsByRole(user?.role).filter(
    (section) => !links.some((link) => link.href === section.href),
  )

  const handleSignOut = () => {
    setOpen(false)
    signOut()
    window.location.hash = '#inicio'
    toast.info('Sesión cerrada', { description: 'Volviste al inicio de Xupply.' })
  }

  return (
    <header
      id="cabecera"
      className="border-border bg-background/85 sticky top-0 z-50 w-full border-b backdrop-blur-xl"
    >
      {/* Tira de estado: refuerza la lectura de herramienta de trabajo. */}
      <div className="border-border bg-brand text-white hidden border-b md:block">
        <div className="container-page flex h-8 items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2 font-medium">
            <span className="animate-halo size-1.5 rounded-[2px] bg-white" />
            340 proveedores verificados despachando en Bucaramanga
          </span>
          <span className="inline-flex items-center gap-4 opacity-90">
            <a href="#planes" className="transition-opacity hover:opacity-70">
              Planes
            </a>
            <a href="#proveedores" className="transition-opacity hover:opacity-70">
              Ser proveedor
            </a>
            <a href="tel:+576071234567" className="transition-opacity hover:opacity-70">
              +57 607 123 4567
            </a>
          </span>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-6">
        <div className="flex flex-1 items-center justify-start">
          <a
            href={links[0].href}
            className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Brand />
          </a>
        </div>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center justify-center gap-1 lg:flex flex-1"
        >
          {links.map((link) => {
            const active = isActive(link.href)

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-soft text-brand'
                    : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                )}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        <div className="hidden items-center justify-end gap-3 lg:flex flex-1">
          {showCart ? (
            <div className="relative">
              <Button asChild variant="ghost" size="icon">
                <a
                  href="#carrito"
                  aria-controls="carrito"
                  aria-label={
                    count === 0
                      ? 'Carrito de compras, vacío'
                      : `Carrito de compras, ${count} ${count === 1 ? 'producto' : 'productos'}`
                  }
                >
                  <XpShoppingCart size={20} />
                </a>
              </Button>
              {count > 0 ? (
                <Badge
                  id="contador-carrito"
                  aria-live="polite"
                  className="pointer-events-none absolute -top-0.5 -right-0.5 min-w-5 justify-center px-1 tabular-nums"
                >
                  {count}
                </Badge>
              ) : null}
            </div>
          ) : null}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto gap-2.5 py-1.5 pr-3 pl-1.5">
                  <Avatar>
                    <AvatarFallback className="bg-brand-soft text-brand font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col items-start text-left leading-tight">
                    <span className="text-xs font-semibold">{user.name}</span>
                    <span className="text-muted-foreground text-xs">{user.roleLabel}</span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2.5">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-brand-soft text-brand text-xs font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="px-2 py-2"
                  onSelect={() => {
                    setOpen(false)
                    signOut()
                    window.location.hash = '#acceso'
                  }}
                >
                  <XpUsers size={16} />
                  Cambiar cuenta
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  className="px-2 py-2"
                  onSelect={handleSignOut}
                >
                  <XpX size={16} />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost">
                <a href="#acceso">Iniciar sesión</a>
              </Button>
              <Button asChild variant="brand">
                <a href="#registro">Crear cuenta</a>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir menú">
              <XpMenu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm p-0">
            <SheetHeader className="border-b p-6">
              <SheetTitle asChild>
                <span>
                  <Brand />
                </span>
              </SheetTitle>
              <SheetDescription className="sr-only">Menú de navegación de Xupply</SheetDescription>
            </SheetHeader>
            <nav aria-label="Navegación móvil" className="flex flex-col gap-1 p-4">
              {links.map((link) => {
                const active = isActive(link.href)

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'hover:bg-muted hover:text-foreground relative rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
                      active ? 'bg-brand-soft/60 text-foreground' : 'text-foreground/80',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        'bg-brand absolute inset-x-4 bottom-1 h-0.5 rounded-full transition-opacity duration-200',
                        active ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </a>
                )
              })}
              {extraSections.length > 0 ? (
                <>
                  <p className="text-muted-foreground px-4 pt-4 pb-1 text-xs font-semibold tracking-wide uppercase">
                    Todas las secciones
                  </p>
                  {extraSections.map((link) => {
                    const active = isActive(link.href)

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'hover:bg-muted hover:text-foreground relative rounded-xl px-4 py-2.5 text-sm transition-colors',
                          active ? 'bg-brand-soft/60 text-foreground' : 'text-foreground/80',
                        )}
                      >
                        {link.label}
                        <span
                          aria-hidden
                          className={cn(
                            'bg-brand absolute inset-x-4 bottom-0.5 h-0.5 rounded-full transition-opacity duration-200',
                            active ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </a>
                    )
                  })}
                </>
              ) : null}
              {showCart ? (
                <a
                  href="#carrito"
                  onClick={() => setOpen(false)}
                  aria-current={isActive('#carrito') ? 'page' : undefined}
                  className={cn(
                    'hover:bg-muted hover:text-foreground relative flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
                    isActive('#carrito') ? 'bg-brand-soft/60 text-foreground' : 'text-foreground/80',
                  )}
                >
                  <span>Carrito</span>
                  <Badge variant="secondary">
                    {count} {count === 1 ? 'producto' : 'productos'}
                  </Badge>
                  <span
                    aria-hidden
                    className={cn(
                      'bg-brand absolute inset-x-4 bottom-1 h-0.5 rounded-full transition-opacity duration-200',
                      isActive('#carrito') ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </a>
              ) : null}
            </nav>
            <div className="mt-auto flex flex-col gap-3 border-t p-6">
              {isAuthenticated && user ? (
                <>
                  <div className="bg-muted/60 flex items-center gap-3 rounded-2xl p-3">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-brand-soft text-brand font-semibold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold">{user.name}</span>
                      <span className="text-muted-foreground text-xs">{user.roleLabel}</span>
                    </div>
                  </div>
                  <Button asChild variant="brand" size="lg" className="w-full">
                    <a href="#panel" onClick={() => setOpen(false)}>
                      {accountLabel(user)}
                    </a>
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setOpen(false)
                        signOut()
                        window.location.hash = '#acceso'
                      }}
                    >
                      Cambiar cuenta
                    </Button>
                    <Button variant="ghost" size="lg" className="w-full" onClick={handleSignOut}>
                      Cerrar sesión
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button asChild variant="brand" size="lg" className="w-full">
                    <a href="#registro" onClick={() => setOpen(false)}>
                      Crear cuenta gratis
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <a href="#acceso" onClick={() => setOpen(false)}>
                      Iniciar sesión
                    </a>
                  </Button>
                </>
              )}
              <ul className="text-muted-foreground mt-2 flex flex-col gap-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <XpMapPin size={16} className="text-brand" />
                  Bucaramanga y área metropolitana
                </li>
                <li className="flex items-center gap-2.5">
                  <XpPhone size={16} className="text-brand" />
                  +57 607 123 4567
                </li>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
