import { useEffect, useState } from 'react'

import {
  XpArrowRight,
  XpBuilding2,
  XpClipboardList,
  XpCircleCheck,
  XpKeyRound,
  XpShieldCheck,
  XpUsers,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth'
import { adminAgenda } from '@/data/team'
import { AdminTeam } from '@/components/account/team-management'

export function Administration() {
  const { isAuthenticated, user } = useAuth()
  const [agenda, setAgenda] = useState(adminAgenda)
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = '#acceso'
      return
    }
    // Esta pantalla es exclusiva del administrador del restaurante.
    if (!isAdmin) {
      window.location.hash = '#panel'
    }
  }, [isAuthenticated, isAdmin])

  if (!isAuthenticated) {
    return <section id="administracion" className="section" />
  }

  if (!isAdmin) {
    return (
      <section id="administracion" className="section">
        <div className="container-page flex flex-col items-center gap-6 py-16 text-center">
          <div className="bg-brand-soft text-brand flex size-20 items-center justify-center rounded-full">
            <XpShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-semibold">Solo el administrador entra aquí</h2>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            La gestión de usuarios, roles y configuración del restaurante es exclusiva del
            administrador.
          </p>
          <Button asChild variant="brand" data-icon="inline-end">
            <a href="#panel">
              Ir a mi cuenta
              <XpArrowRight size={17} />
            </a>
          </Button>
        </div>
      </section>
    )
  }

  const toggleAgenda = (label: string) => {
    setAgenda((current) =>
      current.map((item) => (item.label === label ? { ...item, done: !item.done } : item)),
    )
  }

  const pending = agenda.filter((item) => !item.done).length

  return (
    <section id="administracion" className="section" data-endpoint="/api/users">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Administración"
          title="Usuarios, roles y configuración"
          description="Administra quién entra al restaurante, qué puede hacer cada persona y los datos del negocio que ven tus proveedores."
        >
          <div className="flex flex-wrap items-center justify-start gap-2">
            <Badge className="gap-1.5">
              <XpShieldCheck size={13} />
              {user?.roleLabel}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <XpBuilding2 size={13} />
              {user?.businessName}
            </Badge>
          </div>
        </SectionHeading>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
          <AdminTeam />

          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <Card className="gap-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XpClipboardList size={18} className="text-brand" />
                  Pendientes del día
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pending === 0
                    ? 'Todo al día por hoy.'
                    : `${pending} ${pending === 1 ? 'tarea pendiente' : 'tareas pendientes'} antes de cerrar.`}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-1">
                  {agenda.map((item) => (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => toggleAgenda(item.label)}
                        className="hover:bg-muted flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors"
                      >
                        <span
                          className={
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border ' +
                            (item.done ? 'bg-brand border-brand' : 'border-border')
                          }
                        >
                          {item.done ? (
                            <XpCircleCheck size={13} className="text-primary-foreground" />
                          ) : null}
                        </span>
                        <span className="flex flex-col">
                          <span
                            className={
                              'text-sm font-medium ' +
                              (item.done ? 'text-muted-foreground line-through' : '')
                            }
                          >
                            {item.label}
                          </span>
                          <span className="text-muted-foreground text-xs">{item.hint}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card size="sm" className="border-brand/20 bg-brand-soft/30">
              <CardContent className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <XpKeyRound size={16} className="text-brand" />
                  Atajos del administrador
                </div>
                <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
                  <li className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <XpUsers size={14} />
                      Equipo
                    </span>
                    <a href="#panel-control" className="text-brand font-medium">
                      Panel de control
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <XpBuilding2 size={14} />
                      Datos del negocio
                    </span>
                    <span className="text-xs">En esta página</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <XpClipboardList size={14} />
                      Resumen del mes
                    </span>
                    <a href="#panel" className="text-brand font-medium">
                      Ir a Cuenta
                    </a>
                  </li>
                </ul>
                <Button asChild variant="outline" size="sm" className="w-full" data-icon="inline-end">
                  <a href="#panel">
                    Volver a mi cuenta
                    <XpArrowRight size={15} />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
