import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type InlineConfirmProps = {
  label: string
  confirmLabel?: string
  cancelLabel?: string
  icon?: ReactNode
  onConfirm: () => void
  variant?: 'outline' | 'ghost' | 'brand'
  size?: 'xs' | 'sm' | 'default'
  className?: string
}

// Confirmacion en dos toques, sin modal: el primer clic pide la confirmacion
// en el mismo sitio y el segundo la ejecuta.
export function InlineConfirm({
  label,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  icon,
  onConfirm,
  variant = 'outline',
  size = 'sm',
  className,
}: InlineConfirmProps) {
  const [asking, setAsking] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!asking) return

    const dismiss = (event: MouseEvent | TouchEvent) => {
      if (!root.current?.contains(event.target as Node)) setAsking(false)
    }

    document.addEventListener('mousedown', dismiss)
    document.addEventListener('touchstart', dismiss)
    return () => {
      document.removeEventListener('mousedown', dismiss)
      document.removeEventListener('touchstart', dismiss)
    }
  }, [asking])

  if (!asking) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => setAsking(true)}
        data-icon="inline-start"
        className={className}
      >
        {icon}
        {label}
      </Button>
    )
  }

  return (
    <div ref={root} className={cn('flex items-center gap-2', className)}>
      <span className="text-muted-foreground text-xs font-medium">¿Confirmar?</span>
      <Button
        variant="brand"
        size={size}
        onClick={() => {
          setAsking(false)
          onConfirm()
        }}
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" size={size} onClick={() => setAsking(false)}>
        {cancelLabel}
      </Button>
    </div>
  )
}
