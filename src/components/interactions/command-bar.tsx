import { useEffect, useRef } from 'react'

import { XpSearch, XpX } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type CommandFilter = {
  id: string
  label: string
  count?: number
}

type CommandBarProps = {
  value: string
  onValueChange: (value: string) => void
  filters: CommandFilter[]
  activeFilter: string
  onFilterChange: (id: string) => void
  placeholder?: string
  resultLabel?: string
  className?: string
}

// Barra de comandos para filtrar listados largos: busqueda instantanea mas
// filtros rapidos. Ctrl/Cmd + K enfoca el campo, como en un panel real.
export function CommandBar({
  value,
  onValueChange,
  filters,
  activeFilter,
  onFilterChange,
  placeholder = 'Buscar…',
  resultLabel,
  className,
}: CommandBarProps) {
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return

      event.preventDefault()
      input.current?.focus()
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="border-border/70 bg-muted/50 focus-within:border-brand/50 focus-within:ring-brand/10 flex items-center gap-2 rounded-xl border pr-2 transition-colors focus-within:ring-3">
        <XpSearch size={16} className="text-muted-foreground ml-3 shrink-0" />
        <Input
          ref={input}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-11 border-none bg-transparent px-2 shadow-none focus-visible:border-none focus-visible:ring-0"
        />
        {value ? (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => onValueChange('')}
            className="text-muted-foreground hover:text-foreground hover:bg-muted grid size-7 shrink-0 place-items-center rounded-lg transition-colors"
          >
            <XpX size={15} />
          </button>
        ) : (
          <kbd className="text-muted-foreground bg-background hidden shrink-0 rounded-md border px-1.5 py-0.5 font-sans text-[0.65rem] sm:inline">
            Ctrl K
          </kbd>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const active = filter.id === activeFilter

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              aria-pressed={active}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-brand text-primary-foreground border-brand'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border-border',
              )}
            >
              {filter.label}
              {filter.count === undefined ? null : (
                <span className={cn('tabular-nums', active ? 'text-primary-foreground/80' : 'text-muted-foreground/80')}>
                  {filter.count}
                </span>
              )}
            </button>
          )
        })}

        {resultLabel ? (
          <span className="text-muted-foreground ml-auto text-xs tabular-nums">{resultLabel}</span>
        ) : null}
      </div>
    </div>
  )
}
