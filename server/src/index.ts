import Fastify from 'fastify'
import cors from '@fastify/cors'
import { config } from './config.js'
import { createCatalogSource } from './catalog/index.js'
import { catalogRoutes } from './routes/catalog.js'
import { authRoutes } from './routes/auth.js'
import { orderRoutes } from './routes/orders.js'

async function main() {
  const app = Fastify({ logger: true })
  const source = createCatalogSource()

  await app.register(cors, {
    origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((s) => s.trim()),
  })

  app.get('/health', async () => ({
    status: 'ok',
    catalogSource: source.name,
    authMode: config.devAuthBypass ? 'dev-bypass' : 'verified',
  }))

  // Все доменные роуты под /api
  await app.register(
    async (api) => {
      await api.register(catalogRoutes(source))
      await api.register(authRoutes)
      await api.register(orderRoutes(source))
    },
    { prefix: '/api' },
  )

  await app.listen({ port: config.port, host: '0.0.0.0' })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
