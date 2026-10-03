import { cn } from '@/lib/utils'

export type ProgressTick = {
  label: string
  value: number
  hint?: string
}

type ProgressTicksProps = {
  items: ProgressTick[]
  max?: number
  className?: string
  emptyValue?: number
  onSelect?: (index: number) => void
}

// Barras verticales con su valor: la serie diaria de entregas del quincenal,
// el avance de cada ruta o el estado de cada parada se leen de un vistazo.
export function ProgressTicks({
  items,
  max,
  className,
  emptyValue = 0,
  onSelect,
}: ProgressTicksProps) {
  const ceiling = max ?? Math.max(...items.map((item) => item.value), emptyValue, 1)

  return (
    <div className={cn('flex items-end gap-1.5', className)}>
      {items.map((item, index) => {
        const height = Math.max((item.value / ceiling) * 100, item.value > 0 ? 8 : 3)
        const filled = item.value > emptyValue
        const Tick = onSelect ? 'button' : 'div'

        return (
          <Tick
            key={`${item.label}-${index}`}
            {...(onSelect ? { type: 'button' as const, onClick: () => onSelect(index) } : {})}
            title={item.hint ?? `${item.label}: ${item.value}`}
            className="group/tick flex min-w-0 flex-1 cursor-default flex-col items-center gap-2"
          >
            <span className="bg-muted relative flex h-24 w-full items-end overflow-hidden rounded-md">
              <span
                className={cn(
                  'w-full rounded-md transition-[height] duration-500 ease-out',
                  filled ? 'bg-brand' : 'bg-border',
                )}
                style={{ height: `${height}%` }}
              />
            </span>
            <span
              className={cn(
                'text-muted-foreground truncate text-[0.65rem] tabular-nums',
                filled ? 'group-hover/tick:text-foreground' : '',
              )}
            >
              {item.label}
            </span>
          </Tick>
        )
      })}
    </div>
  )
}
