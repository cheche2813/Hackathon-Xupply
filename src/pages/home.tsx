import { Audiences } from '@/components/landing/audiences'
import { Hero } from '@/components/landing/hero'
import { HowItWorks } from '@/components/landing/how-it-works'

// La landing es una sola ruta (#inicio) compuesta por tres bloques.
export function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Audiences />
    </>
  )
}
