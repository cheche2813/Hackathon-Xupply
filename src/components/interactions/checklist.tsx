import { useState } from 'react'

import { XpCheck, XpClipboardList } from '@/components/icons'
import { cn } from '@/lib/utils'

export type ChecklistItem = {
  id: string
  label: string
  detail?: string
  kind?: string
  done: boolean
}

type ChecklistProps = {
  items: ChecklistItem[]
  title?: string
  description?: string
  className?: string
}

// Lista de pendientes con su avance. El estado vive aqui porque cada panel
// arma su propio resumen operativo, pero se puede pasar onToggle cuando el
// estado tiene que vivir en el padre.
export function Checklist({
  items,
  title = 'Pendientes del día',
  description,
  className,
}: ChecklistProps) {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.id, item.done])),
  )

  const toggle = (id: string) => setState((current) => ({ ...current, [id]: !current[id] }))
  const doneCount = items.filter((item) => state[item.id]).length
  const progress = items.length === 0 ? 0 : (doneCount / items.length) * 100

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <XpClipboardList size={16} className="text-brand" />
            {title}
          </span>
          {description ? <span className="text-muted-foreground text-xs">{description}</span> : null}
        </div>
        <span className="text-muted-foreground text-xs tabular-nums">
          {doneCount} de {items.length}
        </span>
      </div>

      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className="bg-brand h-full rounded-full transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const done = Boolean(state[item.id])

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={done}
                className={cn(
                  'hover:bg-muted/60 flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-2 text-left transition-colors',
                  done ? 'opacity-60' : '',
                )}
              >
                <span
                  className={cn(
                    'grid size-5 shrink-0 place-items-center rounded-md border transition-colors',
                    done ? 'bg-fresh border-fresh text-white' : 'border-border',
                  )}
                >
                  {done ? <XpCheck size={13} /> : null}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span
                    className={cn(
                      'truncate text-sm font-medium',
                      done ? 'text-muted-foreground line-through' : '',
                    )}
                  >
                    {item.label}
                  </span>
                  {item.detail ? (
                    <span className="text-muted-foreground truncate text-xs">{item.detail}</span>
                  ) : null}
                </span>
                {item.kind ? (
                  <span className="bg-secondary text-secondary-foreground shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium capitalize">
                    {item.kind}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
