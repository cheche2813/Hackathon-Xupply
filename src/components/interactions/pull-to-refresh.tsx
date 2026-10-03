import { useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'

import { XpCheck, XpTrendingDown } from '@/components/icons'
import { cn } from '@/lib/utils'

type PullToRefreshProps = {
  children: ReactNode
  onRefresh: () => void | Promise<void>
  label?: string
  doneLabel?: string
  className?: string
}

const THRESHOLD = 52
const MAX_PULL = 84

// Tirador para actualizar el bloque: sirve con raton y con dedo porque el
// gesto vive en la barra, no sobre el contenido, asi la pagina sigue
// desplazando con normalidad.
export function PullToRefresh({
  children,
  onRefresh,
  label = 'Desliza para actualizar',
  doneLabel = 'Datos actualizados',
  className,
}: PullToRefreshProps) {
  const dragging = useRef(false)
  const dragged = useRef(false)
  const startY = useRef(0)

  const [pull, setPull] = useState(0)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const run = async () => {
    setBusy(true)
    try {
      await onRefresh()
    } finally {
      setBusy(false)
      setDone(true)
      window.setTimeout(() => setDone(false), 1600)
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (busy) return

    dragging.current = true
    dragged.current = false
    startY.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return

    setPull(Math.min(Math.max(event.clientY - startY.current, 0), MAX_PULL))
  }

  const handlePointerUp = () => {
    if (!dragging.current) return
    dragging.current = false

    const reached = pull >= THRESHOLD
    dragged.current = reached
    setPull(0)
    if (reached) void run()
  }

  // El clic solo cuenta cuando no hubo arrastre: si el gesto ya actualizó, el
  // click que dispara el navegador no debe actualizar por segunda vez.
  const handleClick = () => {
    if (dragged.current) {
      dragged.current = false
      return
    }

    if (!busy) void run()
  }

  const progress = Math.min(pull / THRESHOLD, 1)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        aria-label={label}
        style={{ height: `${22 + progress * 18}px` }}
        className="text-muted-foreground bg-muted/50 hover:text-foreground flex touch-none items-center justify-center gap-2 overflow-hidden rounded-full text-xs font-medium transition-colors"
      >
        <span
          style={{ transform: `rotate(${progress * 180}deg) scale(${0.85 + progress * 0.3})` }}
          className={cn(
            'grid size-5 place-items-center transition-colors',
            progress === 1 ? 'text-fresh' : 'text-brand',
          )}
        >
          {busy || done ? <XpCheck size={15} /> : <XpTrendingDown size={15} />}
        </span>
        {busy ? 'Actualizando…' : done ? doneLabel : progress === 1 ? 'Suelta para actualizar' : label}
      </button>

      {children}
    </div>
  )
}
