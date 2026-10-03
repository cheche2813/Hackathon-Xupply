import { useEffect } from 'react'
import type { ComponentType } from 'react'

import { useAuth } from '@/contexts/auth'
import type { DemoRole } from '@/data/users'
import { AdminDashboard } from '@/components/account/admin-dashboard'
import { CourierDashboard } from '@/components/account/courier-dashboard'
import { ProviderDashboard } from '@/components/account/provider-dashboard'
import { Dashboard } from '@/components/account/user-dashboard'

// Cada cuenta demo de la pagina entra por #panel y ve la vista de su rol.
// Cuando entre el rol nuevo se registra aqui y el resto del menu no cambia.
const roleViews: Partial<Record<DemoRole, ComponentType>> = {
  admin: AdminDashboard,
  proveedor: ProviderDashboard,
  domiciliario: CourierDashboard,
}

export function MyAccount() {
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = '#acceso'
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <section id="panel" className="section" />
  }

  const RoleView = (user ? roleViews[user.role] : undefined) ?? Dashboard

  return (
    <section id="panel" className="section" data-endpoint="/api/dashboard">
      <div className="container-page">
        <RoleView />
      </div>
    </section>
  )
}
