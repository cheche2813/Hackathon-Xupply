export type DemoRole = 'admin' | 'gerente' | 'empleado' | 'proveedor' | 'domiciliario'

type AccountType = 'persona' | 'restaurante'

export type DemoUser = {
  id: string
  role: DemoRole
  roleLabel: string
  name: string
  email: string
  initials: string
  focus: string
  icon: string
  accountType: AccountType
  accountTypeLabel: string
  businessName?: string
  document: string
  phone: string
  zone: string
}

export const DEMO_PASSWORD = 'Demo1234'

export const demoUsers: DemoUser[] = [
  {
    id: 'u-admin',
    role: 'admin',
    roleLabel: 'Administrador',
    name: 'Camila Duarte',
    email: 'admin@xupply.co',
    initials: 'CD',
    focus: 'Administra el restaurante: equipo, roles, pedidos, inventario y facturación.',
    icon: 'XpShieldCheck',
    accountType: 'restaurante',
    accountTypeLabel: 'Cuenta de restaurante',
    businessName: 'Restaurante La Esquina',
    document: 'NIT 901.456.789-1',
    phone: '+57 607 632 1188',
    zone: 'Bucaramanga · Cabecera',
  },
  {
    id: 'u-gerente',
    role: 'gerente',
    roleLabel: 'Gerente',
    name: 'Lina Ortega',
    email: 'gerente@xupply.co',
    initials: 'LO',
    focus: 'Administra el restaurante: pedidos, equipo, inventario y facturación.',
    icon: 'XpStore',
    accountType: 'restaurante',
    accountTypeLabel: 'Cuenta de restaurante',
    businessName: 'Restaurante La Esquina',
    document: 'NIT 901.456.789-1',
    phone: '+57 315 442 7781',
    zone: 'Bucaramanga · Cabecera',
  },
  {
    id: 'u-empleado',
    role: 'empleado',
    roleLabel: 'Empleado',
    name: 'Mateo Ríos',
    email: 'empleado@xupply.co',
    initials: 'MR',
    focus: 'Arma los pedidos del día a día y consulta precios del catálogo.',
    icon: 'XpUsers',
    accountType: 'restaurante',
    accountTypeLabel: 'Cuenta de restaurante',
    businessName: 'Restaurante La Esquina',
    document: 'CC 1.019.774.310',
    phone: '+57 320 118 5523',
    zone: 'Bucaramanga · Cabecera',
  },
  {
    id: 'u-proveedor',
    role: 'proveedor',
    roleLabel: 'Proveedor',
    name: 'Sofía Villamizar',
    email: 'proveedor@xupply.co',
    initials: 'SV',
    focus: 'Publica su catálogo mayorista y organiza los pedidos que necesitan domicilio.',
    icon: 'XpPackage',
    accountType: 'persona',
    accountTypeLabel: 'Cuenta personal',
    document: 'CC 1.093.220.884',
    phone: '+57 311 905 4412',
    zone: 'Bucaramanga · Sabaneta',
  },
  {
    id: 'u-domiciliario',
    role: 'domiciliario',
    roleLabel: 'Domiciliario',
    name: 'Julián Castaño',
    email: 'domiciliario@xupply.co',
    initials: 'JC',
    focus: 'Solo su ruta: resumen de pedidos, historial de entregas y mapa de paradas.',
    icon: 'XpTruck',
    accountType: 'persona',
    accountTypeLabel: 'Cuenta personal',
    document: 'CC 1.118.336.902',
    phone: '+57 318 774 2205',
    zone: 'Bucaramanga · ruta norte',
  },
]

export const accountLabel = (user: DemoUser) =>
  user.accountType === 'restaurante' ? 'Mi negocio' : 'Mi cuenta'
