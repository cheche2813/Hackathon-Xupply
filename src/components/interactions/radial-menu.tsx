import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { XpLayers } from '@/components/icons'
import { cn } from '@/lib/utils'

export type RadialAction = {
  id: string
  label: string
  icon: ReactNode
  onSelect: () => void
  tone?: 'brand' | 'clay' | 'fresh'
}

type RadialMenuProps = {
  actions: RadialAction[]
  className?: string
  size?: 'sm' | 'md'
}

const RADIUS = 52

const toneClasses: Record<NonNullable<RadialAction['tone']>, string> = {
  brand: 'bg-brand text-primary-foreground',
  clay: 'bg-clay text-white',
  fresh: 'bg-fresh text-white',
}

// Menu radial: las acciones del bloque salen alrededor del disparador, como
// en un control radial. Se cierra con Escape o clic fuera.
export function RadialMenu({ actions, className, size = 'sm' }: RadialMenuProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  const step = 360 / Math.max(actions.length, 1)
  const diameter = size === 'sm' ? 'size-9' : 'size-11'

  return (
    <div className={cn('relative', className)}>
      {open ? (
        <button
          type="button"
          aria-label="Cerrar acciones"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 cursor-default"
        />
      ) : null}

      {open
        ? actions.map((action, index) => {
            const angle = -90 + step * index
            const offsetX = Math.cos((angle * Math.PI) / 180) * RADIUS
            const offsetY = Math.sin((angle * Math.PI) / 180) * RADIUS

            return (
              <div
                key={action.id}
                className="absolute top-1/2 left-1/2 z-40"
                style={{
                  transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
                }}
              >
                <button
                  type="button"
                  title={action.label}
                  aria-label={action.label}
                  onClick={() => {
                    setOpen(false)
                    action.onSelect()
                  }}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className={cn(
                    'animate-in fade-in-0 zoom-in-90 grid place-items-center rounded-full shadow-lg ring-1 ring-foreground/10 transition-transform duration-150 hover:scale-105',
                    diameter,
                    action.tone ? toneClasses[action.tone] : 'bg-card text-foreground',
                  )}
                >
                  {action.icon}
                </button>
              </div>
            )
          })
        : null}

      <button
        type="button"
        aria-label="Acciones rápidas"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'text-muted-foreground hover:text-foreground hover:bg-muted relative z-20 grid place-items-center rounded-lg border transition-colors',
          diameter,
        )}
      >
        <XpLayers size={16} />
      </button>
    </div>
  )
}
