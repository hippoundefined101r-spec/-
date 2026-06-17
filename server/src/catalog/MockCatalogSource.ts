import type { CatalogSource } from './CatalogSource.js'
import type { Product, ProductList, ProductQuery } from '../types.js'
import { categories, products, rooms, stocks } from '../data/mock.js'

/** Источник на демо-данных. Вся фильтрация/сортировка — в памяти. */
export class MockCatalogSource implements CatalogSource {
  readonly name = 'mock'

  async getCategories() {
    return categories
  }

  async getRooms() {
    return rooms
  }

  async getBrands() {
    return [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'ru'))
  }

  async getProducts(query: ProductQuery): Promise<ProductList> {
    const q = query.q?.trim().toLowerCase()
    let items = products.filter((p) => {
      if (query.category && p.categoryId !== query.category) return false
      if (query.room && !p.rooms.includes(query.room)) return false
      if (query.brand && p.brand !== query.brand) return false
      if (query.minPrice != null && p.price < query.minPrice) return false
      if (query.maxPrice != null && p.price > query.maxPrice) return false
      if (query.inStock && !p.inStock) return false
      if (q && !(`${p.title} ${p.brand}`.toLowerCase().includes(q))) return false
      return true
    })

    items = sortProducts(items, query.sort)

    const total = items.length
    const offset = query.offset ?? 0
    const limit = query.limit ?? 50
    return { items: items.slice(offset, offset + limit), total }
  }

  async getProductById(id: string) {
    return products.find((p) => p.id === id) ?? null
  }

  async getSimilar(id: string, limit = 6) {
    const base = products.find((p) => p.id === id)
    if (!base) return []
    return products
      .filter((p) => p.id !== id && p.categoryId === base.categoryId)
      .slice(0, limit)
  }

  async getStocks() {
    return stocks
  }
}

function sortProducts(items: Product[], sort: ProductQuery['sort']): Product[] {
  const copy = [...items]
  switch (sort) {
    case 'price_asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'discount':
      return copy.sort((a, b) => discount(b) - discount(a))
    case 'popular':
    default:
      return copy.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
  }
}

const discount = (p: Product) => (p.oldPrice ? 1 - p.price / p.oldPrice : 0)
