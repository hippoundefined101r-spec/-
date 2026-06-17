import type { CatalogSource } from './CatalogSource.js'
import { MockCatalogSource } from './MockCatalogSource.js'
import { BitrixCatalogSource } from './BitrixCatalogSource.js'
import { config } from '../config.js'

/** Фабрика источника каталога. Выбор по CATALOG_SOURCE (.env). */
export function createCatalogSource(): CatalogSource {
  switch (config.catalogSource) {
    case 'bitrix':
      return new BitrixCatalogSource(config.bitrixBaseUrl, config.bitrixWebhookToken)
    case 'mock':
    default:
      return new MockCatalogSource()
  }
}

export type { CatalogSource }
