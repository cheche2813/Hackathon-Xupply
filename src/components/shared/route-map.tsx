import { XpMapPin } from '@/components/icons'
import { cn } from '@/lib/utils'

export type MapPinTone = 'brand' | 'clay' | 'fresh' | 'muted'

export type MapPin = {
  id: string
  label: string
  x: number
  y: number
  tone?: MapPinTone
  badge?: string
}

type RouteMapProps = {
  pins: MapPin[]
  trail?: { x: number; y: number }[]
  caption?: string
  activeId?: string
  onSelect?: (id: string) => void
  className?: string
}

const STREETS_H = [12, 24, 36, 48, 60, 72, 84]
const STREETS_V = [14, 28, 42, 56, 70, 84]
const BLOCKS = [
  [17, 14, 9, 8],
  [30, 15, 10, 7],
  [45, 26, 9, 8],
  [59, 27, 9, 7],
  [30, 38, 10, 8],
  [73, 40, 9, 8],
  [17, 50, 9, 8],
  [45, 62, 9, 8],
  [60, 63, 9, 7],
  [31, 74, 9, 8],
]
const RIVER = 'M0 90 C 18 82 26 96 44 88 S 70 76 100 84'

const toneClasses: Record<MapPinTone, string> = {
  brand: 'bg-brand text-primary-foreground',
  clay: 'bg-clay text-white',
  fresh: 'bg-fresh text-white',
  muted: 'bg-muted-foreground text-background',
}

// Mapa ilustrativo de la ciudad: calles, manzana y rio dibujados en SVG con
// las paradas encima. Sirve para leer la ruta hoy; el seguimiento en vivo se
// conecta mas adelante con el servicio de ubicacion.
export function RouteMap({
  pins,
  trail,
  caption = 'Mapa ilustrativo · el seguimiento en vivo llega más adelante',
  activeId,
  onSelect,
  className,
}: RouteMapProps) {
  return (
    <div
      role="img"
      aria-label="Mapa de la ruta con sus paradas"
      className={cn(
        'bg-muted/40 relative aspect-4/3 w-full overflow-hidden rounded-xl border',
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <rect width="100" height="100" fill="var(--muted)" opacity="0.35" />
        {BLOCKS.map(([x, y, width, height]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={width}
            height={height}
            rx="1.5"
            fill="var(--card)"
            stroke="var(--border)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {STREETS_H.map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="var(--border)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {STREETS_V.map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            x2={x}
            y1="0"
            y2="100"
            stroke="var(--border)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d={RIVER}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="4"
          opacity="0.18"
          vectorEffect="non-scaling-stroke"
        />
        {trail && trail.length > 1 ? (
          <polyline
            points={trail.map((point) => `${point.x},${point.y}`).join(' ')}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="1.6"
            strokeDasharray="3 2.5"
            strokeLinecap="round"
            opacity="0.8"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>

      {pins.map((pin) => {
        const active = pin.id === activeId
        const Marker = onSelect ? 'button' : 'div'

        return (
          <Marker
            key={pin.id}
            {...(onSelect
              ? { type: 'button' as const, onClick: () => onSelect(pin.id), 'aria-pressed': active }
              : {})}
            title={pin.label}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            className={cn(
              'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 transition-transform',
              onSelect && 'cursor-pointer hover:scale-105',
            )}
          >
            <span
              className={cn(
                'grid size-6 shrink-0 place-items-center rounded-full shadow-md ring-2 ring-background',
                toneClasses[pin.tone ?? 'brand'],
                active && 'scale-125',
              )}
            >
              <XpMapPin size={13} />
            </span>
            {pin.badge ? (
              <span
                className={cn(
                  'rounded-full bg-card px-2 py-0.5 text-[0.65rem] font-semibold whitespace-nowrap shadow-sm ring-1 ring-border',
                  active ? 'text-brand' : 'text-muted-foreground',
                )}
              >
                {pin.badge}
              </span>
            ) : null}
          </Marker>
        )
      })}

      <span className="text-muted-foreground bg-background/80 absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] backdrop-blur">
        <XpMapPin size={12} className="text-brand" />
        {caption}
      </span>
    </div>
  )
}
