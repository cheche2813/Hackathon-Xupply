import { useState } from 'react'
import type { ReactNode } from 'react'

import { XpChevronRight } from '@/components/icons'
import { cn } from '@/lib/utils'

export type Reorderable = {
  id: string
}

type ReorderListProps<T extends Reorderable> = {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  moveUpLabel?: string
  moveDownLabel?: string
}

// Lista reordenable con arrastre y con botones para teclado o dedo. El orden
// vive aqui mientras dura la maniobra y se entrega al padre al soltar.
export function ReorderList<T extends Reorderable>({
  items,
  onReorder,
  renderItem,
  className,
  moveUpLabel = 'Subir',
  moveDownLabel = 'Bajar',
}: ReorderListProps<T>) {
  const incoming = items.map((item) => item.id).join('|')
  const [order, setOrder] = useState<T[]>(items)
  const [synced, setSynced] = useState(incoming)
  const [dragging, setDragging] = useState<string | null>(null)

  // Si el padre cambia la lista, el reorden local se vuelve a alinear durante
  // el render en vez de depender de un efecto.
  if (incoming !== synced) {
    setSynced(incoming)
    setOrder(items)
  }

  const move = (fromId: string, toId: string) => {
    const from = order.findIndex((item) => item.id === fromId)
    const to = order.findIndex((item) => item.id === toId)
    if (from < 0 || to < 0 || from === to) return

    const next = [...order]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)

    setOrder(next)
    onReorder(next)
  }

  const shift = (id: string, delta: number) => {
    const index = order.findIndex((item) => item.id === id)
    const target = index + delta
    if (index < 0 || target < 0 || target >= order.length) return

    const next = [...order]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)

    setOrder(next)
    onReorder(next)
  }

  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {order.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={(event) => {
            setDragging(item.id)
            event.dataTransfer.effectAllowed = 'move'
            event.dataTransfer.setData('text/plain', item.id)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            if (dragging && dragging !== item.id) move(dragging, item.id)
          }}
          onDragEnd={() => setDragging(null)}
          onDrop={() => setDragging(null)}
          style={{ opacity: dragging === item.id ? 0.55 : 1 }}
          className="border-border/70 bg-card flex items-center gap-3 rounded-xl border p-3 transition-shadow"
        >
          <span className="text-muted-foreground flex flex-col gap-0.5">
            <span className="grid size-6 cursor-grab place-items-center rounded-md active:cursor-grabbing">
              <XpChevronRight size={14} className="-rotate-90" />
            </span>
            <span className="grid size-6 place-items-center rounded-md">
              <XpChevronRight size={14} className="rotate-90" />
            </span>
          </span>

          <div className="min-w-0 flex-1">{renderItem(item, index)}</div>

          <div className="flex shrink-0 flex-col gap-1">
            <button
              type="button"
              aria-label={`${moveUpLabel} ${index + 1}`}
              disabled={index === 0}
              onClick={() => shift(item.id, -1)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted grid size-6 place-items-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
            >
              <XpChevronRight size={13} className="-rotate-90" />
            </button>
            <button
              type="button"
              aria-label={`${moveDownLabel} ${index + 1}`}
              disabled={index === order.length - 1}
              onClick={() => shift(item.id, 1)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted grid size-6 place-items-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30"
            >
              <XpChevronRight size={13} className="rotate-90" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
