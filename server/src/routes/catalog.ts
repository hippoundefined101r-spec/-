import type { FastifyInstance } from 'fastify'
import type { CatalogSource } from '../catalog/index.js'
import type { ProductQuery } from '../types.js'

export function catalogRoutes(source: CatalogSource) {
  return async function (app: FastifyInstance) {
    app.get('/catalog/categories', async () => source.getCategories())

    app.get('/catalog/rooms', async () => source.getRooms())

    app.get('/catalog/brands', async () => source.getBrands())

    app.get('/catalog/products', async (req) => {
      const q = req.query as Record<string, string | undefined>
      const query: ProductQuery = {
        q: q.q,
        category: q.category,
        room: q.room,
        brand: q.brand,
        minPrice: num(q.minPrice),
        maxPrice: num(q.maxPrice),
        inStock: q.inStock === 'true' ? true : undefined,
        sort: q.sort as ProductQuery['sort'],
        limit: num(q.limit),
        offset: num(q.offset),
      }
      return source.getProducts(query)
    })

    app.get('/catalog/products/:id', async (req, reply) => {
      const { id } = req.params as { id: string }
      const product = await source.getProductById(id)
      if (!product) {
        reply.code(404).send({ error: 'not_found' })
        return
      }
      const similar = await source.getSimilar(id)
      return { product, similar }
    })

    app.get('/stocks', async () => source.getStocks())
  }
}

function num(v: string | undefined): number | undefined {
  if (v == null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}
