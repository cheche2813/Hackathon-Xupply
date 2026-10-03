import { useState, type FormEvent } from 'react'

import { XpBot, XpSend, XpSparkles } from '@/components/icons'
import { SectionHeading } from '@/components/shared/section-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { aiAnswers, aiPrompts } from '@/data/ai'

type Message = {
  id: string
  from: 'user' | 'ia'
  text: string
}

const initialMessages: Message[] = [
  {
    id: 'm0',
    from: 'ia',
    text: 'Hola, soy Xupply IA. Pregúntame por tu food cost, tus compras o el clima del negocio y te respondo en lenguaje llano.',
  },
]

export function XupplyIa() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [question, setQuestion] = useState('')
  const [pending, setPending] = useState(false)

  const send = (text: string) => {
    const clean = text.trim()
    if (clean.length === 0 || pending) return

    const index = messages.length

    setMessages((current) => [
      ...current,
      { id: `u-${index}`, from: 'user', text: clean },
    ])
    setQuestion('')
    setPending(true)

    window.setTimeout(() => {
      const answer = aiAnswers[index % aiAnswers.length]
      setMessages((current) => [
        ...current,
        { id: `a-${index}`, from: 'ia', text: answer },
      ])
      setPending(false)
    }, 600)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    send(question)
  }

  return (
    <section id="xupply-ia" className="section" data-endpoint="/api/ai">
      <div className="container-page flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          align="left"
          eyebrow="Asistente del negocio"
          title="Xupply IA"
          description="Food cost, compras y clima del negocio explicados en lenguaje llano, todos los días."
        >
          <Badge variant="secondary" className="gap-1.5">
            <XpSparkles size={13} />
            Respuestas demo · se conecta a /api/ai
          </Badge>
        </SectionHeading>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10">
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <XpBot size={18} className="text-brand shrink-0" />
                Conversación
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ol id="conversacion-ia" className="flex flex-col gap-3" aria-live="polite">
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className={
                      message.from === 'ia'
                        ? 'bg-muted/60 text-foreground max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed'
                        : 'bg-brand text-primary-foreground ml-auto max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed'
                    }
                  >
                    {message.text}
                  </li>
                ))}
                {pending ? (
                  <li className="text-muted-foreground bg-muted/60 max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                    Xupply IA está escribiendo…
                  </li>
                ) : null}
              </ol>

              <form
                id="formulario-ia"
                className="flex flex-col gap-3 border-t pt-4"
                onSubmit={handleSubmit}
              >
                <label htmlFor="pregunta-ia" className="text-sm font-medium">
                  Escribe tu pregunta
                </label>
                <Textarea
                  id="pregunta-ia"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="¿Cuál es mi food cost ideal este mes?"
                />
                <Button type="submit" variant="brand" className="self-end" data-icon="inline-end">
                  Preguntar
                  <XpSend size={16} />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="gap-0">
            <CardHeader>
              <CardTitle className="text-base">Sugerencias</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {aiPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  className="h-auto justify-start py-2.5 text-left text-sm whitespace-normal"
                  onClick={() => send(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
