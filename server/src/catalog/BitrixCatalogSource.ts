import type { CatalogSource } from './CatalogSource.js'
import type { Product, ProductList, ProductQuery, Category, Room, Stock } from '../types.js'

/**
 * Адаптер каталога к Bitrix (kirgu.ru) — заготовка под этап 2.
 *
 * Конкретный способ доступа выбирается позже и инкапсулируется здесь:
 *   - REST-вебхук Bitrix:  `${BITRIX_BASE_URL}/rest/1/${BITRIX_WEBHOOK_TOKEN}/...`
 *   - YML/CSV-фид каталога (импорт в свою БД с периодической синхронизацией)
 *   - прямой доступ к MySQL Bitrix
 *
 * Маппинг полей Bitrix → доменная модель (по разметке сайта):
 *   - разделы инфоблока (iblock sections) → Category / Room
 *   - элементы инфоблока (iblock elements) → Product
 *   - свойства BREND/TSVET_1/MATERIAL/RAZMERY_1 → specs
 *   - картинки из /upload/iblock/... → Product.image
 *   - инфоблок «Акции» (stocks) → Stock
 *
 * Пока методы бросают ошибку — источник по умолчанию `mock` (см. index.ts / .env).
 */
export class BitrixCatalogSource implements CatalogSource {
  readonly name = 'bitrix'

  constructor(
    private readonly baseUrl: string,
    private readonly webhookToken: string,
  ) {}

  private notImplemented(method: string): never {
    const configured = this.baseUrl && this.webhookToken ? 'настроен' : 'не настроен'
    throw new Error(
      `BitrixCatalogSource.${method} ещё не реализован (этап 2). ` +
        `Доступ к Bitrix (${this.baseUrl || '—'}): ${configured}.`,
    )
  }

  async getCategories(): Promise<Category[]> {
    return this.notImplemented('getCategories')
  }
  async getRooms(): Promise<Room[]> {
    return this.notImplemented('getRooms')
  }
  async getBrands(): Promise<string[]> {
    return this.notImplemented('getBrands')
  }
  async getProducts(_query: ProductQuery): Promise<ProductList> {
    return this.notImplemented('getProducts')
  }
  async getProductById(_id: string): Promise<Product | null> {
    return this.notImplemented('getProductById')
  }
  async getSimilar(_id: string, _limit?: number): Promise<Product[]> {
    return this.notImplemented('getSimilar')
  }
  async getStocks(): Promise<Stock[]> {
    return this.notImplemented('getStocks')
  }
}
