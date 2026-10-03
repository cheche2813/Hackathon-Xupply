// Unico punto de acceso a localStorage. Cada modulo que necesita guardar algo
// en el navegador pasa por aqui, asi ninguna pantalla repite el mismo try/catch
// ni el guard de SSR.
export const STORAGE_KEYS = {
  session: 'xupply.sesion',
  cart: 'xupply.carrito',
  photos: 'xupply.fotos',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export function readItem(key: StorageKey): string | null {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeItem(key: StorageKey, value: string): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, value)
  } catch {
    return
  }
}

export function removeItem(key: StorageKey): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.removeItem(key)
  } catch {
    return
  }
}
