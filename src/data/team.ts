import type { AdminRole } from './permissions'

export type TeamStatus = 'activo' | 'invitado' | 'suspendido' | 'despedido'

export type TeamMember = {
  id: string
  name: string
  email: string
  phone: string
  initials: string
  role: AdminRole
  status: TeamStatus
  lastAccess: string
  focus: string
}

export const restaurantTeam: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'Camila Duarte',
    email: 'admin@xupply.co',
    phone: '+57 607 632 1188',
    initials: 'CD',
    role: 'admin',
    status: 'activo',
    lastAccess: 'Ahora',
    focus: 'Dueña del restaurante: equipo, proveedores, roster y facturación.',
  },
  {
    id: 'tm-002',
    name: 'Lina Ortega',
    email: 'gerente@xupply.co',
    phone: '+57 315 442 7781',
    initials: 'LO',
    role: 'gerente',
    status: 'activo',
    lastAccess: 'Hace 12 min',
    focus: 'Maneja pedidos, proveedores y el inventario diario.',
  },
  {
    id: 'tm-003',
    name: 'Mateo Ríos',
    email: 'empleado@xupply.co',
    phone: '+57 320 118 5523',
    initials: 'MR',
    role: 'empleado',
    status: 'activo',
    lastAccess: 'Hace 1 h',
    focus: 'Arma pedidos del día a día y consulta precios del catálogo.',
  },
  {
    id: 'tm-004',
    name: 'Valentina Gómez',
    email: 'valentina.gomez@laesquina.co',
    phone: '+57 316 552 9041',
    initials: 'VG',
    role: 'empleado',
    status: 'invitado',
    lastAccess: 'Invitación enviada el 14 mar',
    focus: 'Encargada de Receiving y conteo cíclico de bodega.',
  },
  {
    id: 'tm-005',
    name: 'Andrés Pardo',
    email: 'andres.pardo@laesquina.co',
    phone: '+57 300 774 2210',
    initials: 'AP',
    role: 'empleado',
    status: 'suspendido',
    lastAccess: 'Hace 24 días',
    focus: 'Chef de partida. Acceso suspendido hasta que renueve la quincena.',
  },
]

export const adminAgenda = [
  { label: 'Cerrar el inventario de bodega', done: true, hint: 'Completado a las 06:10' },
  { label: 'Confirmar los 4 pedidos en estado ROP crítico', done: false, hint: 'Vence hoy a las 11:00' },
  { label: 'Revisar la facturación del viernes', done: false, hint: '2 facturas por validar' },
  { label: 'Enviar el inventario a Xupply IA', done: false, hint: 'Food cost desactualizado' },
]
