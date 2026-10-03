#!/usr/bin/env node
/**
 * Generador de iconos de Xupply.
 *
 * Sustituye al CLI de `reicons` (0.4.7), que no corre en Node >= 20 por su
 * dependencia interna `svgo@0.7`. Lee los SVG de `assets/icons/icons` y emite
 * un unico modulo TypeScript con un componente por icono.
 *
 *   node scripts/generate-icons.mjs
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'

const SRC = join(process.cwd(), 'assets', 'icons', 'icons')
const OUT_DIR = join(process.cwd(), 'src', 'components', 'icons')
const OUT = join(OUT_DIR, 'index.tsx')

mkdirSync(OUT_DIR, { recursive: true })

const toPascalCase = (name) =>
  name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')

const ATTR_MAP = {
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-dasharray': 'strokeDasharray',
  'clip-rule': 'clipRule',
  'fill-rule': 'fillRule',
  'stop-color': 'stopColor',
}

const toJsxAttrs = (raw) => {
  const attrs = {}
  for (const [, key, value] of raw.matchAll(/([a-zA-Z-:]+)="([^"]*)"/g)) {
    if (key === 'class' || key === 'xmlns') continue
    attrs[ATTR_MAP[key] ?? key] = value
  }
  return attrs
}

const readSvg = (file) => {
  const raw = readFileSync(file, 'utf8')
  const root = raw.match(/<svg([^>]*)>/)
  if (!root) throw new Error(`No se encontro <svg> en ${basename(file)}`)
  const body = raw.slice(raw.indexOf('>', raw.indexOf('<svg')) + 1, raw.lastIndexOf('</svg>'))
  return { attrs: toJsxAttrs(root[1]), body: body.replace(/>\s+</g, '><').trim() }
}

const files = readdirSync(SRC).filter((file) => file.endsWith('.svg')).sort()

const components = files.map((file) => {
  const { attrs, body } = readSvg(join(SRC, file))
  const name = `Xp${toPascalCase(basename(file, '.svg'))}`
  const {
    width: _w,
    height: _h,
    fill = 'none',
    stroke = 'currentColor',
    strokeWidth = '2',
    strokeLinecap = 'round',
    strokeLinejoin = 'round',
    viewBox = '0 0 24 24',
    ...rest
  } = attrs

  const passthrough = Object.entries(rest)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  return `export function ${name}({ size = 24, strokeWidth: sw = ${strokeWidth}, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${viewBox}"
      width={size}
      height={size}
      fill="${fill}"
      stroke="${stroke}"
      strokeWidth={sw}
      strokeLinecap="${strokeLinecap}"
      strokeLinejoin="${strokeLinejoin}"${passthrough ? ` ${passthrough}` : ''}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      ${body}
    </svg>
  )
}`
})

const output = `// Generado por scripts/generate-icons.mjs — no editar a mano.
// Fuentes: assets/icons/icons/*.svg (Lucide, ISC).

import type { SVGProps } from 'react'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  size?: number | string
}

${components.join('\n\n')}
`

writeFileSync(OUT, output, 'utf8')
console.log(`${files.length} iconos generados en src/components/icons/index.tsx`)
