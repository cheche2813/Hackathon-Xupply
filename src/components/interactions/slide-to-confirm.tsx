import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { XpCheck } from '@/components/icons'
import { cn } from '@/lib/utils'

type SlideToConfirmProps = {
  label: string
  doneLabel?: string
  onConfirm: () => void
  disabled?: boolean
  className?: string
}

// Desliza para confirmar. El mismo gesto sirve con raton y con dedo, y el
// boton tambien responde al teclado: pulsar la perilla confirma la accion.
export function SlideToConfirm({
  label,
  doneLabel = 'Confirmado',
  onConfirm,
  disabled = false,
  className,
}: SlideToConfirmProps) {
  const track = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLButtonElement>(null)
  const dragging = useRef(false)
  const startX = useRef(0)
  const offset = useRef(0)

  const [shift, setShift] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  const limit = () => {
    const trackNode = track.current
    const knobNode = knob.current
    if (!trackNode || !knobNode) return 0
    return Math.max(trackNode.clientWidth - knobNode.clientWidth - 8, 0)
  }

  const move = (value: number) => {
    offset.current = value
    setShift(value)
  }

  const confirm = () => {
    if (disabled || confirmed) return

    move(limit())
    setConfirmed(true)
    onConfirm()
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled || confirmed) return

    dragging.current = true
    startX.current = event.clientX - offset.current
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return

    const max = limit()
    move(Math.min(Math.max(event.clientX - startX.current, 0), max))
  }

  const handlePointerUp = () => {
    if (!dragging.current) return
    dragging.current = false

    const max = limit()
    if (max > 0 && offset.current >= max * 0.72) {
      confirm()
      return
    }

    move(0)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      confirm()
    }
  }

  useEffect(() => {
    if (!confirmed) return

    const timer = window.setTimeout(() => {
      setConfirmed(false)
      move(0)
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [confirmed])

  return (
    <div
      ref={track}
      className={cn(
        'bg-muted relative h-12 w-full overflow-hidden rounded-full p-1 select-none',
        disabled && 'opacity-60',
        className,
      )}
    >
      <span
        className={cn(
          'text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium transition-opacity duration-200',
          confirmed ? 'text-fresh opacity-0' : 'opacity-100',
        )}
      >
        {label}
      </span>
      <span
        aria-hidden
        className={cn(
          'text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium transition-opacity duration-300',
          confirmed ? 'opacity-100' : 'opacity-0',
        )}
      >
        {doneLabel}
      </span>
      <button
        ref={knob}
        type="button"
        disabled={disabled}
        aria-label={label}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onClick={confirm}
        style={{ transform: `translateX(${shift}px)` }}
        className={cn(
          'bg-brand text-primary-foreground shadow-brand/25 absolute top-1 left-1 grid size-10 touch-none place-items-center rounded-full shadow-lg transition-transform duration-200 ease-out disabled:pointer-events-none',
          confirmed && 'bg-fresh',
        )}
      >
        <XpCheck size={18} />
      </button>
    </div>
  )
}
