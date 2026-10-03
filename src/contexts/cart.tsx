import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { products, type Product } from '@/data/catalog'
import { readItem, STORAGE_KEYS, writeItem } from '@/lib/storage'

export const MAX_QUANTITY_PER_ITEM = 99

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  count: number
  isEmpty: boolean
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  total: number
}

type StoredItem = { productId: string; quantity: number }

const CartContext = createContext<CartContextType | undefined>(undefined)

const isStoredItem = (value: unknown): value is StoredItem => {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Partial<StoredItem>
  return typeof entry.productId === 'string' && typeof entry.quantity === 'number'
}

const readStoredItems = (): CartItem[] => {
  const raw = readItem(STORAGE_KEYS.cart)
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const items: CartItem[] = []
    for (const entry of parsed) {
      if (!isStoredItem(entry)) continue
      const product = products.find((candidate) => candidate.id === entry.productId)
      if (!product) continue
      const quantity = Math.min(Math.floor(entry.quantity), MAX_QUANTITY_PER_ITEM)
      if (quantity < 1) continue
      items.push({ product, quantity })
    }
    return items
  } catch {
    return []
  }
}

const writeStoredItems = (items: CartItem[]) => {
  const payload: StoredItem[] = items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  }))

  writeItem(STORAGE_KEYS.cart, JSON.stringify(payload))
}

const clampQuantity = (quantity: number) =>
  Math.max(0, Math.min(Math.floor(quantity), MAX_QUANTITY_PER_ITEM))

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredItems)

  useEffect(() => {
    writeStoredItems(items)
  }, [items])

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const amount = clampQuantity(quantity)
    if (amount < 1) return

    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (!existing) return [...current, { product, quantity: amount }]
      return current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: clampQuantity(item.quantity + amount) }
          : item,
      )
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const amount = clampQuantity(quantity)
    setItems((current) =>
      amount < 1
        ? current.filter((item) => item.product.id !== productId)
        : current.map((item) =>
            item.product.id === productId ? { ...item, quantity: amount } : item,
          ),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextType>(
    () => ({
      items,
      count,
      isEmpty: items.length === 0,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      total: subtotal,
    }),
    [addToCart, clearCart, count, items, removeFromCart, subtotal, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}
