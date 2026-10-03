import { XpStore } from '@/components/icons'
import { cn } from '@/lib/utils'

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'bg-linear-to-br from-brand to-brand-strong text-white inline-flex size-9 shrink-0 items-center justify-center rounded-md shadow-sm shadow-brand/30',
        className,
      )}
    >
      <XpStore size={20} strokeWidth={2} />
    </span>
  )
}

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark />
      <span className="font-heading text-xl font-semibold tracking-tight">Xupply</span>
    </span>
  )
}
