import { useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TiltCardProps = {
  children: ReactNode
  className?: string
  max?: number
}

// Carta que se inclina siguiendo el puntero. Sin libreria externa: solo dos
// grados por lado calculados desde el rectangulo del elemento.
export function TiltCard({ children, className, max = 6 }: TiltCardProps) {
  const node = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = node.current?.getBoundingClientRect()
    if (!rect) return

    const ratioX = (event.clientX - rect.left) / rect.width - 0.5
    const ratioY = (event.clientY - rect.top) / rect.height - 0.5

    setTilt({ x: ratioX * max, y: ratioY * -max })
  }

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 })
    setActive(false)
  }

  return (
    <div
      ref={node}
      onPointerMove={handleMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={handleLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${active ? 1.01 : 1})`,
      }}
      className={cn(
        'transition-transform duration-200 ease-out motion-reduce:!transform-none',
        className,
      )}
    >
      {children}
    </div>
  )
}
