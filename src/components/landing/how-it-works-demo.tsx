import { useEffect, useState } from 'react'

import { XpArrowRight, XpCheck, XpSparkles, XpStore, XpZap } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const STEP_DURATION = 4000

const flowSteps = [
  {
    actor: '🙋',
    actorLabel: 'Tu restaurante',
    title: 'Haces un pedido',
    message: 'Armas tu carrito y envías el pedido en menos de un minuto.',
    meta: '0 min',
  },
  {
    actor: '🏪',
    actorLabel: 'El proveedor',
    title: 'El proveedor recibe el pedido',
    message: 'El Palmar confirma disponibilidad, precio y hora de despacho.',
    meta: '3 min',
  },
  {
    actor: '🛵',
    actorLabel: 'El domiciliario',
    title: 'El domiciliario recibe el pedido',
    message: 'La app asigna al domiciliario más cercano y le muestra la ruta.',
    meta: '12 min',
  },
  {
    actor: '🍽️',
    actorLabel: 'Tu cocina',
    title: 'El pedido llega a tu restaurante',
    message: 'Recibes los productos listos para producir y sigues sirviendo.',
    meta: '24 h',
  },
] as const

const LAST = flowSteps.length - 1

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function HowItWorksDemo() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      setStep((current) => (current === LAST ? 0 : current + 1))
    }, STEP_DURATION)
    return () => window.clearTimeout(timer)
  }, [playing, step])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setStep(0)
      setPlaying(!prefersReducedMotion())
    }
  }

  const goTo = (hash: string) => {
    setOpen(false)
    window.location.hash = hash
  }

  const progress = 12.5 + (step / LAST) * 75

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="xl"
          data-icon="inline-start"
          className="w-full sm:w-auto"
        >
          <XpSparkles size={18} />
          Ver cómo funciona
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-3rem)] max-w-[calc(100%-3rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <DialogHeader className="border-b p-7 pb-6">
          <Badge variant="secondary" className="mb-2 w-fit">
            <XpZap size={13} />
            Demo del flujo
          </Badge>
          <DialogTitle className="text-3xl">Cómo llega tu pedido</DialogTitle>
          <DialogDescription className="text-base">
            Cuatro pasos, un mismo pedido: tú pides, el proveedor despacha, el domiciliar entrega.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-col gap-7 overflow-y-auto p-5 sm:p-7">
          {/* Movil: linea de tiempo vertical. Escritorio: stepper horizontal.
              Ninguna de las dos versiones necesita scroll lateral. */}
          <div className="md:hidden">
            <ol className="flex flex-col">
              {flowSteps.map((item, index) => {
                const isActive = index === step
                const isDone = index < step

                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      className="flex w-full items-start gap-3 py-3 text-left"
                      onClick={() => {
                        setStep(index)
                        setPlaying(false)
                      }}
                    >
                      <span className="relative flex flex-col items-center self-stretch">
                        <span
                          className={
                            'z-10 flex size-10 shrink-0 items-center justify-center rounded-lg text-xl transition-colors ' +
                            (isActive
                              ? 'bg-brand text-white'
                              : isDone
                                ? 'bg-brand-soft text-brand'
                                : 'bg-muted text-muted-foreground')
                          }
                        >
                          {isDone ? <XpCheck size={18} /> : item.actor}
                        </span>
                        {index < flowSteps.length - 1 ? (
                          <span
                            aria-hidden
                            className={'w-0.5 flex-1 ' + (isDone ? 'bg-brand' : 'bg-border')}
                          />
                        ) : null}
                      </span>

                      <span className="min-w-0 flex-1 pb-1">
                        <span className="text-muted-foreground block text-xs font-semibold tracking-wide uppercase">
                          {item.actorLabel}
                        </span>
                        <span className="mt-1 block font-heading text-sm font-semibold text-balance">
                          {item.title}
                        </span>
                        <span
                          className={
                            'mt-1 block text-sm leading-relaxed ' +
                            (isActive ? 'text-foreground' : 'text-muted-foreground')
                          }
                        >
                          {item.message}
                        </span>
                        <span className="text-brand mt-1 block text-xs font-semibold">{item.meta}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="hidden overflow-x-auto pt-6 pb-4 md:block">
            <div className="mx-auto min-w-[720px] max-w-[880px]">
              <div className="relative">
                <div className="bg-border absolute top-10 left-[12.5%] h-1.5 w-[75%] -translate-y-1/2 rounded-[3px]" />
                <div
                  className="from-brand to-fresh absolute top-10 left-[12.5%] h-1.5 -translate-y-1/2 rounded-[3px] bg-linear-to-r transition-[width] duration-1000 ease-out"
                  style={{ width: `${(step / LAST) * 75}%` }}
                />
                <div
                  className="absolute top-10 z-10 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-1000 ease-out"
                  style={{ left: `${progress}%` }}
                >
                  <span className="bg-background border-border flex size-11 items-center justify-center rounded-lg border text-xl shadow-md">
                    📦
                  </span>
                </div>

                <ol className="grid grid-cols-4">
                  {flowSteps.map((item, index) => {
                    const isActive = index === step
                    const isDone = index < step

                    const bubble =
                      'flex h-full w-full max-w-[17rem] flex-col justify-center rounded-lg border px-3 py-3 text-left text-[13px] leading-relaxed transition-colors duration-500 '

                    return (
                      <li
                        key={item.title}
                        className="flex cursor-pointer flex-col items-center px-2 text-center"
                        onClick={() => {
                          setStep(index)
                          setPlaying(false)
                        }}
                      >
                        <span
                          className={
                            'bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-2xl text-4xl ring-1 ring-border transition-all duration-700 hover:ring-brand/40 ' +
                            (isDone ? 'bg-brand-soft text-brand scale-90 ring-brand/20' : '') +
                            (isActive
                              ? 'bg-brand ring-brand/25 scale-110 shadow-lg shadow-brand/25 ring-4'
                              : '')
                          }
                        >
                          {isDone ? <XpCheck size={34} /> : item.actor}
                        </span>

                        <span className="text-muted-foreground mt-4 text-xs font-semibold tracking-wide uppercase">
                          {item.actorLabel}
                        </span>

                        <span className="mt-2 flex h-[4.5rem] items-start justify-center text-sm font-semibold text-balance">
                          <span>
                            <span className="text-brand mr-1.5 font-heading">0{index + 1}</span>
                            {item.title}
                          </span>
                        </span>

                        <div className="mt-1 flex h-40 w-full justify-center">
                          {isActive ? (
                            <p
                              key={item.title}
                              className={
                                bubble +
                                'bg-brand-soft/70 border-brand/20 text-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-300'
                              }
                            >
                              {item.message}
                              <span className="text-brand mt-2 block font-semibold">
                                {item.meta}
                              </span>
                            </p>
                          ) : (
                            <p
                              className={
                                bubble + 'bg-muted/50 text-muted-foreground border-border/80'
                              }
                            >
                              {item.message}
                              <span className="mt-2 block font-semibold">{item.meta}</span>
                            </p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              data-icon="inline-start"
              className="text-muted-foreground"
              onClick={() => setPlaying((current) => !current)}
            >
              <XpSparkles size={14} />
              {playing ? 'Pausar' : 'Reproducir'}
            </Button>
            <Button
              variant="ghost"
              size="xs"
              data-icon="inline-start"
              className="text-muted-foreground"
              onClick={() => {
                setStep(0)
                setPlaying(false)
              }}
            >
              <XpArrowRight size={14} className="rotate-180" />
              Reiniciar
            </Button>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 gap-2.5 px-9 py-6">
          <Button
            variant="outline"
            data-icon="inline-start"
            onClick={() => goTo('#proveedores')}
          >
            <XpStore size={18} />
            Ver proveedores
          </Button>
          <Button variant="brand" data-icon="inline-end" onClick={() => goTo('#catalogo')}>
            Ver catálogo
            <XpArrowRight size={18} />
          </Button>
          <DialogClose asChild>
            <Button variant="ghost">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
