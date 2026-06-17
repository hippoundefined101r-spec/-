import type {
  Category,
  Product,
  ProductList,
  ProductQuery,
  Room,
  Stock,
} from '../types.js'

/**
 * Источник каталога — единый контракт для данных магазина.
 *
 * Сейчас реализован `MockCatalogSource` (демо-данные).
 * На этапе 2 добавляется `BitrixCatalogSource` (REST-вебхук / YML-фид / прямая БД) —
 * роутеры и фронтенд при этом не меняются.
 */
export interface CatalogSource {
  /** Человекочитаемое имя источника (для /health и логов) */
  readonly name: string

  getCategories(): Promise<Category[]>
  getRooms(): Promise<Room[]>
  getBrands(): Promise<string[]>

  /** Выборка товаров с фильтрами/сортировкой/пагинацией */
  getProducts(query: ProductQuery): Promise<ProductList>
  getProductById(id: string): Promise<Product | null>
  /** Похожие товары (та же категория, исключая сам товар) */
  getSimilar(id: string, limit?: number): Promise<Product[]>

  getStocks(): Promise<Stock[]>
}
