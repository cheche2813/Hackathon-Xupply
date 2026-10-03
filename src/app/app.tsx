import { useEffect } from 'react'
import { Toaster } from 'sonner'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { useAuth } from '@/contexts/auth'
import { can, panelRoles } from '@/data/permissions'

import { DEFAULT_ROUTE, ROUTE_COMPONENTS, routeCapability } from './routes'
import { useHashRoute } from './use-hash-route'

export default function App() {
  const { isAuthenticated, user } = useAuth()
  const currentHash = useHashRoute()
  const Page = ROUTE_COMPONENTS[currentHash] ?? ROUTE_COMPONENTS[DEFAULT_ROUTE]

  // Los roles que ya tienen panel propio entran por el, no por la landing.
  useEffect(() => {
    const hasPanel = user != null && panelRoles.includes(user.role)

    if (isAuthenticated && hasPanel && currentHash === DEFAULT_ROUTE) {
      window.location.hash = '#panel'
    }
  }, [currentHash, isAuthenticated, user])

  // Guard de permisos: si la ruta exige una capacidad que el rol no tiene, el
  // usuario vuelve a su panel en lugar de encontrar una pantalla vacia.
  useEffect(() => {
    if (!isAuthenticated) return

    const capability = routeCapability(currentHash)
    if (!capability || can(user?.role, capability)) return

    window.location.hash = '#panel'
  }, [currentHash, isAuthenticated, user?.role])

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="bg-brand sr-only rounded-lg px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100"
      >
        Saltar al contenido principal
      </a>

      <SiteHeader />

      <main id="contenido" className="flex-1">
        <Page />
      </main>

      <SiteFooter />

      <Toaster
        position="bottom-right"
        closeButton
        richColors={false}
        toastOptions={{
          classNames: {
            toast: 'rounded-2xl border-border shadow-xl',
            title: 'font-medium',
            description: 'text-muted-foreground',
            actionButton: 'bg-primary text-primary-foreground rounded-lg text-xs',
          },
        }}
      />
    </div>
  )
}
