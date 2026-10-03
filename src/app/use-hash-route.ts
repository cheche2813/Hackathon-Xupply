import { useEffect, useState } from 'react'

import { resolveHash } from './routes'

// La app es una SPA con enrutado por hash: no hay router externo, asi que el
// hash se lee una vez al montar y se vuelve a leer en cada hashchange.
export function useHashRoute() {
  const [currentHash, setCurrentHash] = useState(() => resolveHash(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(resolveHash(window.location.hash))
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return currentHash
}
