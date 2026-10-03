import { XpMail, XpMapPin, XpPhone, XpUsers } from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { demoUsers } from '@/data/users'

export function Team() {
  return (
    <section id="equipo" className="section" data-endpoint="/api/users">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Personas y permisos"
          title="Equipo"
          description="Administradores, gerentes, empleados, proveedores y domiciliarios con permisos claros."
        >
          <div className="text-muted-foreground flex flex-wrap items-center justify-start gap-2 text-sm">
            <XpUsers size={16} />
            <span>{demoUsers.length} personas con acceso a Xupply</span>
          </div>
        </SectionHeading>

        <div
          id="lista-equipo"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {demoUsers.map((user) => (
            <Card key={user.id} className="h-full gap-0">
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-brand-soft text-brand font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary">{user.roleLabel}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{user.focus}</p>
                </div>
                <div className="text-muted-foreground mt-auto flex flex-col gap-1.5 text-xs">
                  <span className="flex items-center gap-2">
                    <XpMail size={13} className="shrink-0" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <XpPhone size={13} className="shrink-0" />
                    {user.phone}
                  </span>
                  <span className="flex items-center gap-2">
                    <XpMapPin size={13} className="shrink-0" />
                    {user.zone}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
