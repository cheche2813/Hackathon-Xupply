import { useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'

import {
  XpBuilding2,
  XpCheck,
  XpCircleAlert,
  XpClock,
  XpKeyRound,
  XpMail,
  XpPencil,
  XpPhone,
  XpSave,
  XpShieldCheck,
  XpTrash2,
  XpUserPlus,
  XpUserX,
  XpUsers,
  XpX,
} from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/auth'
import { adminRoleLabels, rolePermissions, type AdminRole } from '@/data/permissions'
import { gastronomicTypes } from '@/data/register'
import { restaurantTeam, type TeamMember, type TeamStatus } from '@/data/team'

const statusLabels: Record<TeamStatus, string> = {
  activo: 'Activo',
  invitado: 'Invitación pendiente',
  suspendido: 'Suspendido',
  despedido: 'Despedido',
}

const statusVariants: Record<TeamStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  activo: 'default',
  invitado: 'secondary',
  suspendido: 'outline',
  despedido: 'destructive',
}

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

type MemberDialogMode = 'editar' | 'despedir' | 'eliminar'
type MemberDialog = { mode: MemberDialogMode; member: TeamMember } | null

export function AdminTeam() {
  const { user } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>(restaurantTeam)
  const [dialog, setDialog] = useState<MemberDialog>(null)
  const [draft, setDraft] = useState<TeamMember | null>(null)
  const [invite, setInvite] = useState({ name: '', email: '', role: 'empleado' as AdminRole })
  const [business, setBusiness] = useState({
    name: 'Restaurante La Esquina',
    gastronomy: 'colombiana',
    nit: 'NIT 901.456.789-1',
    address: 'Calle 36 # 27-14, Bucaramanga',
    phone: '+57 607 632 1188',
    schedule: 'Lunes a sábado, 11:00 a 22:00',
  })

  const pendingInvites = members.filter((member) => member.status === 'invitado').length
  const activeMembers = members.filter((member) => member.status === 'activo').length

  const openDialog = (mode: MemberDialogMode, member: TeamMember) => {
    setDraft({ ...member })
    setDialog({ mode, member })
  }

  const changeRole = (member: TeamMember, role: AdminRole) => {
    setMembers((current) =>
      current.map((item) => (item.id === member.id ? { ...item, role } : item)),
    )
    toast.success(`Rol de ${member.name} actualizado`, {
      description: `Ahora es ${adminRoleLabels[role]}.`,
    })
  }

  const saveMember = (event: FormEvent) => {
    event.preventDefault()
    if (!draft || !dialog) return

    if (draft.name.trim().length === 0 || draft.email.trim().length === 0) {
      toast.error('Completa el nombre y el correo del usuario.')
      return
    }

    setMembers((current) =>
      current.map((item) => (item.id === draft.id ? { ...draft, initials: initialsOf(draft.name) } : item)),
    )
    setDialog(null)
    toast.success('Usuario actualizado', {
      description: `Guardamos los cambios de ${draft.name}.`,
    })
  }

  const reactivateMember = (member: TeamMember) => {
    setMembers((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, status: 'activo', lastAccess: ' reactivado ahora' } : item,
      ),
    )
    toast.success(`${member.name} vuelve a tener acceso`, {
      description: 'Restauramos sus permisos sobre el restaurante.',
    })
  }

  const fireMember = () => {
    if (!dialog) return

    setMembers((current) =>
      current.map((item) =>
        item.id === dialog.member.id ? { ...item, status: 'despedido' } : item,
      ),
    )
    setDialog(null)
    toast.info(`${dialog.member.name} fue despedido`, {
      description: 'Perdió el acceso al panel y al catálogo de la empresa.',
    })
  }

  const deleteMember = () => {
    if (!dialog) return

    setMembers((current) => current.filter((item) => item.id !== dialog.member.id))
    setDialog(null)
    toast.success('Usuario eliminado', {
      description: `${dialog.member.name} ya no hace parte del restaurante.`,
    })
  }

  const sendInvite = (event: FormEvent) => {
    event.preventDefault()

    if (invite.name.trim().length === 0 || invite.email.trim().length === 0) {
      toast.error('Completa el nombre y el correo de la invitación.')
      return
    }

    const member: TeamMember = {
      id: `tm-${Date.now()}`,
      name: invite.name.trim(),
      email: invite.email.trim(),
      phone: 'Sin teléfono',
      initials: initialsOf(invite.name),
      role: invite.role,
      status: 'invitado',
      lastAccess: 'Invitación enviada ahora',
      focus: 'Invitado por el administrador del restaurante.',
    }

    setMembers((current) => [...current, member])
    setInvite({ name: '', email: '', role: 'empleado' })
    toast.success('Invitación enviada', {
      description: `${member.name} recibe un correo para crear su acceso.`,
    })
  }

  const saveBusiness = (event: FormEvent) => {
    event.preventDefault()
    toast.success('Datos del restaurante actualizados', {
      description: 'Los cambios aplican a todo el equipo desde ya.',
    })
  }

  const memberDialogCopy = {
    editar: {
      title: 'Editar usuario',
      description: 'Cambia los datos o el rol del miembro del restaurante.',
    },
    despedir: {
      title: 'Despedir usuario',
      description: 'La persona pierde el acceso, pero queda en el historial.',
    },
    eliminar: {
      title: 'Eliminar usuario',
      description: 'Se borra del restaurante y no se puede recuperar.',
    },
  } as const

  return (
    <div className="flex flex-col gap-6">
      <Card id="panel-control" className="gap-0">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-2">
                <XpUsers size={18} className="text-brand" />
                Panel de control del equipo
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {activeMembers} personas activas y {pendingInvites}{' '}
                {pendingInvites === 1 ? 'invitación pendiente' : 'invitaciones pendientes'}. Desde
                aquí editas, cambias roles, despedes o eliminas usuarios del restaurante.
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <XpShieldCheck size={13} />
              Solo el administrador
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div id="lista-usuarios" className="flex flex-col gap-3">
            {members.map((member) => {
              const isCurrentUser = member.id === 'tm-001' || member.email === user?.email
              const disabled = isCurrentUser || member.status === 'despedido'

              return (
                <Card key={member.id} size="sm" className="gap-0">
                  <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-brand-soft text-brand font-semibold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">{member.name}</span>
                          {isCurrentUser ? (
                            <Badge variant="secondary">Tú</Badge>
                          ) : null}
                          <Badge variant={statusVariants[member.status]}>
                            {statusLabels[member.status]}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="flex items-center gap-1.5">
                            <XpMail size={12} />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <XpPhone size={12} />
                            {member.phone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <XpClock size={12} />
                            {member.lastAccess}
                          </span>
                        </span>
                        <span className="text-muted-foreground text-xs leading-relaxed">
                          {member.focus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(value) => changeRole(member, value as AdminRole)}
                        disabled={isCurrentUser}
                      >
                        <SelectTrigger
                          className="h-9 w-40"
                          aria-label={`Rol de ${member.name}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(adminRoleLabels) as AdminRole[]).map((role) => (
                            <SelectItem key={role} value={role}>
                              {adminRoleLabels[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        onClick={() => openDialog('editar', member)}
                        data-icon="inline-start"
                      >
                        <XpPencil size={14} />
                        Editar
                      </Button>
                      {member.status === 'suspendido' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reactivateMember(member)}
                          data-icon="inline-start"
                        >
                          <XpUserPlus size={14} />
                          Reactivar
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={disabled}
                          onClick={() => openDialog('despedir', member)}
                          data-icon="inline-start"
                        >
                          <XpUserX size={14} />
                          Despedir
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isCurrentUser}
                        onClick={() => openDialog('eliminar', member)}
                        data-icon="inline-start"
                        className="text-destructive hover:text-destructive"
                      >
                        <XpTrash2 size={14} />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Separator className="my-6" />

          <form className="grid gap-4 lg:grid-cols-[1fr_1fr_10rem_auto] lg:items-end" onSubmit={sendInvite}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invitacion-nombre">Invitar a alguien</Label>
              <Input
                id="invitacion-nombre"
                value={invite.name}
                onChange={(event) => setInvite({ ...invite, name: event.target.value })}
                placeholder="Nombre y apellido"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invitacion-correo">Correo</Label>
              <Input
                id="invitacion-correo"
                type="email"
                value={invite.email}
                onChange={(event) => setInvite({ ...invite, email: event.target.value })}
                placeholder="persona@laesquina.co"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invitacion-rol">Rol</Label>
              <Select
                value={invite.role}
                onValueChange={(value) => setInvite({ ...invite, role: value as AdminRole })}
              >
                <SelectTrigger id="invitacion-rol" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(adminRoleLabels) as AdminRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {adminRoleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="brand" data-icon="inline-start">
              <XpUserPlus size={16} />
              Invitar
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XpKeyRound size={18} className="text-brand" />
              Permisos por rol
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Lo que cada rol puede hacer dentro del restaurante.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_repeat(3,4.5rem)] gap-2 text-center">
              <span />
              {(Object.keys(adminRoleLabels) as AdminRole[]).map((role) => (
                <span
                  key={role}
                  className="text-muted-foreground text-xs font-semibold tracking-wide uppercase"
                >
                  {adminRoleLabels[role]}
                </span>
              ))}
            </div>
            {rolePermissions.map((permission) => (
              <div
                key={permission.label}
                className="grid grid-cols-[1fr_repeat(3,4.5rem)] items-center gap-2 border-b border-border/70 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{permission.label}</span>
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {permission.hint}
                  </span>
                </div>
                {(['admin', 'gerente', 'empleado'] as AdminRole[]).map((role) => (
                  <span key={role} className="flex justify-center">
                    {permission[role] ? (
                      <span className="bg-brand-soft text-brand flex size-7 items-center justify-center rounded-full">
                        <XpCheck size={14} />
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60 flex size-7 items-center justify-center">
                        <XpX size={14} />
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XpBuilding2 size={18} className="text-brand" />
              Configuración del restaurante
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Datos que ven los proveedores y que salen en las facturas.
            </p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveBusiness}>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="negocio-nombre">Nombre del restaurante</Label>
                <Input
                  id="negocio-nombre"
                  value={business.name}
                  onChange={(event) => setBusiness({ ...business, name: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="negocio-clasificacion">Clasificación gastronómica</Label>
                <Select
                  value={business.gastronomy}
                  onValueChange={(value) => setBusiness({ ...business, gastronomy: value })}
                >
                  <SelectTrigger id="negocio-clasificacion" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gastronomicTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="negocio-nit">NIT</Label>
                <Input
                  id="negocio-nit"
                  value={business.nit}
                  onChange={(event) => setBusiness({ ...business, nit: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="negocio-direccion">Dirección de entrega</Label>
                <Input
                  id="negocio-direccion"
                  value={business.address}
                  onChange={(event) => setBusiness({ ...business, address: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="negocio-telefono">Teléfono</Label>
                <Input
                  id="negocio-telefono"
                  value={business.phone}
                  onChange={(event) => setBusiness({ ...business, phone: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="negocio-horario">Horario de atención</Label>
                <Input
                  id="negocio-horario"
                  value={business.schedule}
                  onChange={(event) => setBusiness({ ...business, schedule: event.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" variant="brand" data-icon="inline-start">
                  <XpSave size={16} />
                  Guardar cambios
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-muted-foreground items-start gap-2 text-xs leading-relaxed">
            <XpCircleAlert size={14} className="mt-0.5 shrink-0" />
            Cambiar la clasificación recalcula las recomendaciones de Xupply IA y los proveedores
            que te escriben.
          </CardFooter>
        </Card>
      </div>

      <Dialog
        open={dialog?.mode === 'editar'}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{memberDialogCopy.editar.title}</DialogTitle>
            <DialogDescription>{memberDialogCopy.editar.description}</DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={saveMember}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="editar-nombre">Nombre</Label>
              <Input
                id="editar-nombre"
                value={draft?.name ?? ''}
                onChange={(event) =>
                  setDraft((current) => (current ? { ...current, name: event.target.value } : current))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="editar-correo">Correo</Label>
              <Input
                id="editar-correo"
                type="email"
                value={draft?.email ?? ''}
                onChange={(event) =>
                  setDraft((current) => (current ? { ...current, email: event.target.value } : current))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="editar-telefono">Teléfono</Label>
              <Input
                id="editar-telefono"
                value={draft?.phone ?? ''}
                onChange={(event) =>
                  setDraft((current) => (current ? { ...current, phone: event.target.value } : current))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="editar-rol">Rol</Label>
              <Select
                value={draft?.role ?? 'empleado'}
                onValueChange={(value) =>
                  setDraft((current) =>
                    current ? { ...current, role: value as AdminRole } : current,
                  )
                }
              >
                <SelectTrigger id="editar-rol" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(adminRoleLabels) as AdminRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {adminRoleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" variant="brand">
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog?.mode === 'despedir'}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{memberDialogCopy.despedir.title}</DialogTitle>
            <DialogDescription>{memberDialogCopy.despedir.description}</DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed">
            ¿Seguro que quieres despedir a{' '}
            <span className="font-semibold">{dialog?.member.name}</span>? Dejará de ver pedidos,
            inventario y facturación.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={fireMember} data-icon="inline-start">
              <XpUserX size={16} />
              Despedir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog?.mode === 'eliminar'}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{memberDialogCopy.eliminar.title}</DialogTitle>
            <DialogDescription>{memberDialogCopy.eliminar.description}</DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-relaxed">
            Se eliminará a <span className="font-semibold">{dialog?.member.name}</span> del
            restaurante. Si solo quieres quitarle el acceso, usa “Despedir”.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={deleteMember} data-icon="inline-start">
              <XpTrash2 size={16} />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
