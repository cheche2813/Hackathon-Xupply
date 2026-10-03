import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  children?: ReactNode
  /** Numero de seccion en formato 01, 02: reinforces la lectura de producto. */
  index?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  children,
  index,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'mx-auto max-w-3xl items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow || index ? (
        <span className="flex items-center gap-3">
          <span aria-hidden className="bg-brand h-px w-8" />
          {index ? (
            <span className="text-brand font-heading text-sm font-semibold tabular-nums">{index}</span>
          ) : null}
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        </span>
      ) : null}

      <h2 className="text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">{title}</h2>

      {description ? (
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
          {description}
        </p>
      ) : null}

      {children}
    </div>
  )
}
