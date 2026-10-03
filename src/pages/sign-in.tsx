import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'

import {
  XpArrowRight,
  XpCircleAlert,
  XpCircleCheck,
  XpHeadset,
  XpLock,
  XpMail,
  XpPackage,
  XpPhone,
  XpShieldCheck,
  XpStore,
  XpTruck,
  XpUsers,
} from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/auth'
import { menuSectionsByRole, navLinksByRole } from '@/data/navigation'
import { DEMO_PASSWORD, accountLabel, demoUsers, type DemoUser } from '@/data/users'
import { gastronomicTypes, registerAccountTypes, registerBenefits, type RegisterAccountType } from '@/data/register'

type Mode = 'login' | 'register'

type RegisterForm = {
  businessName: string
  gastronomy: string
  username: string
  password: string
  phone: string
  email: string
}

const emptyRegisterForm: RegisterForm = {
  businessName: '',
  gastronomy: '',
  username: '',
  password: '',
  phone: '',
  email: '',
}

const roleIcons = {
  XpShieldCheck,
  XpStore,
  XpUsers,
  XpPackage,
  XpTruck,
} as const

const accountTypeIcons = {
  XpStore,
  XpPackage,
} as const

const modeHash: Record<Mode, string> = {
  login: '#acceso',
  register: '#registro',
}

// La tarjeta de cada perfil demo describe el menu real de su rol y lo toma del
// mismo origen que el encabezado. Asi la tarjeta y la aplicacion nunca se
// contradicen, y el cambio queda asociado al rol, no a un usuario concreto.
const roleMenu = (role: DemoUser['role']) => {
  const main = navLinksByRole(role)
  const sections = menuSectionsByRole(role).filter(
    (section) => !main.some((link) => link.href === section.href),
  )

  return { main: main.map((link) => link.label), extra: sections.length }
}

export function SignIn() {
  const { user, isAuthenticated, signIn, signOut } = useAuth()
  const [mode, setMode] = useState<Mode>(() =>
    window.location.hash === '#registro' ? 'register' : 'login',
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [useAnotherAccount, setUseAnotherAccount] = useState(false)
  const [accountType, setAccountType] = useState<RegisterAccountType>('restaurante')
  const [registerForm, setRegisterForm] = useState<RegisterForm>(emptyRegisterForm)

  useEffect(() => {
    const syncMode = () => {
      setMode(window.location.hash === '#registro' ? 'register' : 'login')
    }

    window.addEventListener('hashchange', syncMode)
    return () => window.removeEventListener('hashchange', syncMode)
  }, [])

  const goToMode = (next: Mode) => {
    setMode(next)
    if (window.location.hash !== modeHash[next]) {
      window.location.hash = modeHash[next]
    }
  }

  const updateRegisterField =
    (field: keyof RegisterForm) => (value: string) =>
      setRegisterForm((current) => ({ ...current, [field]: value }))

  const pickUser = (candidate: DemoUser) => {
    setEmail(candidate.email)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const result = signIn(email, password)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setError('')
    setPending(true)
    window.setTimeout(() => {
      window.location.hash = '#panel'
      toast.success('Sesión iniciada', {
        description: 'Entraste con tu usuario demo de Xupply.',
      })
    }, 400)
  }

  const handleRegister = (event: FormEvent) => {
    event.preventDefault()

    const missing =
      accountType === 'restaurante'
        ? ([
            ['businessName', 'el nombre del restaurante'],
            ['gastronomy', 'la clasificación gastronómica'],
            ['username', 'el nombre de usuario'],
            ['password', 'la contraseña'],
            ['phone', 'el teléfono'],
            ['email', 'el correo'],
          ] as const).filter(([field]) => registerForm[field].trim().length === 0)
        : ([
            ['businessName', 'el nombre de empresa'],
            ['password', 'la contraseña'],
            ['username', 'el nombre de usuario'],
            ['email', 'el correo'],
            ['phone', 'el teléfono'],
          ] as const).filter(([field]) => registerForm[field].trim().length === 0)

    if (missing.length > 0) {
      toast.error('Completa los campos obligatorios', {
        description: `Falta ${missing.map(([, label]) => label).join(', ')}.`,
      })
      return
    }

    toast.success('Solicitud registrada en modo demo', {
      description: `Conectaremos ${registerForm.email.trim()} con /api/auth/register cuando la API esté lista.`,
    })
    setRegisterForm(emptyRegisterForm)
  }

  if (isAuthenticated && user && !useAnotherAccount && mode === 'login') {
    return (
      <section id="acceso" className="section">
        <div className="container-page flex flex-col items-center gap-8 py-10 text-center lg:py-20">
          <div className="bg-brand-soft text-brand flex size-20 items-center justify-center rounded-full">
            <XpShieldCheck size={32} />
          </div>
          <div className="flex max-w-lg flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ya tienes sesión iniciada
            </h2>
            <p className="text-muted-foreground text-lg">
              Entraste como {user.roleLabel.toLowerCase()}. Puedes ir a{' '}
              {accountLabel(user).toLowerCase()} o cambiar a otro usuario demo.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="brand" size="xl" data-icon="inline-end">
              <a href="#panel">
                Ir a {accountLabel(user).toLowerCase()}
                <XpArrowRight size={18} />
              </a>
            </Button>
            <Button size="xl" onClick={() => setUseAnotherAccount(true)}>
              Cambiar cuenta
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const startOver = () => {
    signOut()
    setUseAnotherAccount(false)
    setEmail('')
    setPassword('')
    setError('')
  }

  const isRegister = mode === 'register'

  return (
    <section id="acceso" className="section">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        {isAuthenticated && user ? (
          <div className="border-brand/20 bg-brand-soft/40 flex flex-col items-start gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <XpCircleCheck size={18} className="text-brand mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed">
                Sesión activa: <span className="font-semibold">{user.name}</span> (
                {user.roleLabel.toLowerCase()}). Al entrar con otro usuario se reemplaza la cuenta
                activa de este navegador.
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={startOver}>
              Empezar de cero
            </Button>
          </div>
        ) : null}

        <SectionHeading
          align="left"
          eyebrow="Acceso"
          title={isRegister ? 'Crea tu cuenta en Xupply' : 'Inicia sesión en Xupply'}
          description={
            isRegister
              ? 'Dinos cómo trabajas y armamos tu espacio: catálogo, pedidos y panel listos desde el primer día.'
              : 'Elige un usuario demo para entrar. Todos comparten la misma contraseña, así que puedes recorrer cada rol sin fricción.'
          }
        >
          {isRegister ? (
            <Badge variant="secondary" className="gap-1.5">
              <XpCircleCheck size={13} />
              Registro en modo demo
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5">
              <XpLock size={13} />
              Contraseña demo: {DEMO_PASSWORD}
            </Badge>
          )}
        </SectionHeading>

        <div
          role="group"
          aria-label="Elige cómo entrar a Xupply"
          className="bg-muted/60 inline-flex w-full gap-1 self-start rounded-2xl p-1 sm:w-auto"
        >
          <Button
            variant={isRegister ? 'ghost' : 'brand'}
            size="lg"
            aria-pressed={!isRegister}
            className="flex-1 sm:flex-none"
            onClick={() => goToMode('login')}
            data-icon="inline-start"
          >
            <XpLock size={16} />
            Iniciar sesión
          </Button>
          <Button
            variant={isRegister ? 'brand' : 'ghost'}
            size="lg"
            aria-pressed={isRegister}
            className="flex-1 sm:flex-none"
            onClick={() => goToMode('register')}
            data-icon="inline-start"
          >
            <XpUsers size={16} />
            Crear cuenta
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
          {isRegister ? (
            <Card id="registro" className="gap-0 lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Crear mi cuenta</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Elige el tipo de cuenta y completa los datos de tu negocio.
                </p>
              </CardHeader>
              <CardContent>
                <form
                  id="formulario-registro"
                  data-endpoint="/api/auth/register"
                  className="flex flex-col gap-5"
                  onSubmit={handleRegister}
                  noValidate
                >
                  <fieldset className="flex flex-col gap-3">
                    <legend className="mb-3 text-sm font-medium">
                      ¿Cómo vas a usar Xupply?
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {registerAccountTypes.map((type) => {
                        const Icon = accountTypeIcons[type.icon as keyof typeof accountTypeIcons]
                        const selected = accountType === type.value

                        return (
                          <button
                            key={type.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setAccountType(type.value)}
                            className={
                              'flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ' +
                              (selected
                                ? 'border-brand bg-brand-soft/40 ring-brand/20 ring-2'
                                : 'hover:border-brand/40 hover:bg-muted/40')
                            }
                          >
                            <span
                              className={
                                'flex size-10 shrink-0 items-center justify-center rounded-xl ' +
                                (selected
                                  ? 'bg-brand text-primary-foreground'
                                  : 'bg-brand-soft text-brand')
                              }
                            >
                              <Icon size={18} />
                            </span>
                            <span className="text-sm font-semibold">{type.label}</span>
                            <span className="text-muted-foreground text-xs leading-relaxed">
                              {type.description}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="registro-negocio">
                      {accountType === 'restaurante'
                        ? 'Nombre del restaurante'
                        : 'Nombre de empresa'}
                    </Label>
                    <div className="relative">
                      <XpStore
                        size={16}
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                      />
                      <Input
                        id="registro-negocio"
                        value={registerForm.businessName}
                        onChange={(event) =>
                          updateRegisterField('businessName')(event.target.value)
                        }
                        placeholder={
                          accountType === 'restaurante'
                            ? 'Restaurante La Esquina'
                            : 'Distribuidora El Palmar'
                        }
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  {accountType === 'restaurante' ? (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="registro-gastronomia">
                        Clasificación Gastronómica del Restaurante
                      </Label>
                      <Select
                        value={registerForm.gastronomy}
                        onValueChange={updateRegisterField('gastronomy')}
                      >
                        <SelectTrigger id="registro-gastronomia" className="h-11 w-full">
                          <SelectValue placeholder="Elige una clasificación" />
                        </SelectTrigger>
                        <SelectContent>
                          {gastronomicTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        De acuerdo a tus platos principales te recomendaremos los mejores
                        proveedores mayoristas de insumos.
                      </p>
                    </div>
                  ) : null}

                  {accountType === 'proveedor' ? (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="registro-contrasena">Contraseña</Label>
                      <div className="relative">
                        <XpLock
                          size={16}
                          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                        />
                        <Input
                          id="registro-contrasena"
                          type="password"
                          value={registerForm.password}
                          onChange={(event) => updateRegisterField('password')(event.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          autoComplete="new-password"
                          className="h-11 pl-9"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="registro-usuario">Nombre de usuario</Label>
                    <div className="relative">
                      <XpUsers
                        size={16}
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                      />
                      <Input
                        id="registro-usuario"
                        value={registerForm.username}
                        onChange={(event) => updateRegisterField('username')(event.target.value)}
                        placeholder="laesquina"
                        autoComplete="username"
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  {accountType === 'restaurante' ? (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="registro-contrasena">Contraseña</Label>
                      <div className="relative">
                        <XpLock
                          size={16}
                          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                        />
                        <Input
                          id="registro-contrasena"
                          type="password"
                          value={registerForm.password}
                          onChange={(event) =>
                            updateRegisterField('password')(event.target.value)
                          }
                          placeholder="Mínimo 8 caracteres"
                          autoComplete="new-password"
                          className="h-11 pl-9"
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="registro-telefono">Teléfono</Label>
                    <div className="relative">
                      <XpPhone
                        size={16}
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                      />
                      <Input
                        id="registro-telefono"
                        type="tel"
                        value={registerForm.phone}
                        onChange={(event) => updateRegisterField('phone')(event.target.value)}
                        placeholder="+57 607 123 4567"
                        autoComplete="tel"
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="registro-correo">Correo</Label>
                    <div className="relative">
                      <XpMail
                        size={16}
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                      />
                      <Input
                        id="registro-correo"
                        type="email"
                        value={registerForm.email}
                        onChange={(event) => updateRegisterField('email')(event.target.value)}
                        placeholder="hola@tunegocio.co"
                        autoComplete="email"
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="justify-start px-0"
                        >
                          Términos y condiciones
                        </Button>
                      </DialogTrigger>
                      <DialogContent id="dialogo-terminos" className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Términos y condiciones</DialogTitle>
                          <DialogDescription>
                            Xupply conecta restaurantes con proveedores verificados. Al crear una
                            cuenta aceptas que usemos tus datos para gestionar pedidos,
                            facturación y entregas.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="brand">Entendido</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button
                      type="submit"
                      variant="brand"
                      size="lg"
                      className="sm:w-auto"
                      data-icon="inline-end"
                    >
                      Crear cuenta
                      <XpArrowRight size={18} />
                    </Button>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    ¿Ya tienes cuenta en Xupply?{' '}
                    <button
                      type="button"
                      onClick={() => goToMode('login')}
                      className="text-brand font-medium underline underline-offset-4"
                    >
                      Inicia sesión
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="gap-0 lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Entrar a mi cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  id="formulario-acceso"
                  data-endpoint="/api/auth/login"
                  className="flex flex-col gap-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="correo">Correo</Label>
                    <div className="relative">
                      <XpMail
                        size={16}
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                      />
                      <Input
                        id="correo"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="gerente@xupply.co"
                        autoComplete="username"
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contrasena">Contraseña</Label>
                    <div className="relative">
                      <XpLock
                        size={16}
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                      />
                      <Input
                        id="contrasena"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={DEMO_PASSWORD}
                        autoComplete="current-password"
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  {error ? (
                    <p className="text-destructive flex items-start gap-2 text-sm leading-relaxed">
                      <XpCircleAlert size={16} className="mt-0.5 shrink-0" />
                      {error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    disabled={pending}
                    data-icon="inline-end"
                  >
                    {pending ? 'Entrando…' : 'Iniciar sesión'}
                    <XpArrowRight size={18} />
                  </Button>

                  <p className="text-muted-foreground flex items-start gap-2 text-xs leading-relaxed">
                    <XpHeadset size={14} className="text-brand mt-0.5 shrink-0" />
                    ¿No encuentras tu cuenta? Escríbenos y te ayudamos a crearla.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}

          {isRegister ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Qué obtienes con tu cuenta</h3>
                <p className="text-muted-foreground text-sm">
                  {accountType === 'restaurante'
                    ? 'Eres un restaurante: compara, pide y controla tus insumos.'
                    : 'Eres un proveedor: publica tu catálogo y recibe pedidos.'}
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {registerBenefits[accountType].map((benefit) => (
                  <li
                    key={benefit}
                    className="border-border/70 bg-card flex items-start gap-3 rounded-2xl border p-4"
                  >
                    <XpCircleCheck
                      size={16}
                      className="text-fresh mt-0.5 shrink-0"
                    />
                    <span className="text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Card className="gap-0" size="sm">
                <CardContent className="flex items-start gap-3">
                  <XpCircleAlert size={18} className="text-brand mt-0.5 shrink-0" />
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Este formulario es una demostración: no creamos la cuenta real ni guardamos tus
                    datos. Cuando la API esté activa, se enviará a{' '}
                    <span className="text-foreground font-medium">/api/auth/register</span>.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">Usuarios demo</h3>
              <p className="text-muted-foreground text-sm">
                Toca un usuario para completar el formulario. Cada rol entra a su propia pantalla:
                domiciliario y proveedor ya tienen paneles propios, y el resto comparte el panel
                general.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {demoUsers.map((candidate) => {
                const Icon = roleIcons[candidate.icon as keyof typeof roleIcons] ?? XpStore
                const selected = email.trim().toLowerCase() === candidate.email
                const menu = roleMenu(candidate.role)

                  return (
                    <li key={candidate.id}>
                      <Card
                        size="sm"
                        role="button"
                        tabIndex={0}
                        onClick={() => pickUser(candidate)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            pickUser(candidate)
                          }
                        }}
                        className={
                          'h-full cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg ' +
                          (selected ? 'border-brand ring-brand/20 ring-2' : '')
                        }
                      >
                        <CardContent className="flex items-start gap-3">
                          <span className="bg-brand-soft text-brand flex size-11 shrink-0 items-center justify-center rounded-xl">
                            <Icon size={20} />
                          </span>
                          <div className="flex flex-col gap-1">
                            <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                              {candidate.roleLabel}
                              <Badge variant="outline" className="text-muted-foreground gap-1">
                                {candidate.accountType === 'restaurante' ? (
                                  <XpStore size={11} />
                                ) : (
                                  <XpUsers size={11} />
                                )}
                                {accountLabel(candidate)}
                              </Badge>
                              {selected ? (
                                <Badge variant="secondary" className="text-brand">
                                  Listo
                                </Badge>
                              ) : null}
                            </span>
                            <span className="text-xs font-medium">
                              {candidate.businessName ? `${candidate.businessName} · ` : ''}
                              {candidate.name} · {candidate.email}
                            </span>
                            <span className="text-muted-foreground text-xs leading-relaxed">
                              {candidate.focus}
                            </span>
                            <span className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className="text-muted-foreground text-[0.7rem] font-semibold tracking-wide uppercase">
                                Al entrar ve
                              </span>
                              {menu.main.map((label) => (
                                <Badge key={label} variant="secondary" className="text-[0.7rem]">
                                  {label}
                                </Badge>
                              ))}
                              {menu.extra > 0 ? (
                                <span className="text-muted-foreground text-[0.7rem]">
                                  +{menu.extra} secciones
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
