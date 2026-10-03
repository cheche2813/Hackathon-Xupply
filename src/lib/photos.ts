import { readItem, STORAGE_KEYS, writeItem } from './storage'

type PhotoLibrary = Record<string, string>

const readLibrary = (): PhotoLibrary => {
  const stored = readItem(STORAGE_KEYS.photos)
  if (!stored) return {}

  try {
    const parsed: unknown = JSON.parse(stored)
    return parsed && typeof parsed === 'object' ? (parsed as PhotoLibrary) : {}
  } catch {
    return {}
  }
}

export function readPhoto(userId: string): string {
  const stored = readLibrary()[userId]
  return typeof stored === 'string' ? stored : ''
}

export function writePhoto(userId: string, photo: string) {
  const library = readLibrary()
  library[userId] = photo
  writeItem(STORAGE_KEYS.photos, JSON.stringify(library))
}

export function readImageFile(file: File, maxWidth = 480): Promise<string | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null)
      return
    }

    const reader = new FileReader()

    reader.onerror = () => resolve(null)
    reader.onload = () => {
      const source = String(reader.result)
      const image = new Image()

      image.onerror = () => resolve(source)
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width)
        const width = Math.max(1, Math.round(image.width * scale))
        const height = Math.max(1, Math.round(image.height * scale))
        const canvas = document.createElement('canvas')

        canvas.width = width
        canvas.height = height

        const context = canvas.getContext('2d')
        if (!context) {
          resolve(source)
          return
        }

        context.drawImage(image, 0, 0, width, height)

        const webp = canvas.toDataURL('image/webp', 0.82)
        resolve(webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.82))
      }

      image.src = source
    }

    reader.readAsDataURL(file)
  })
}
