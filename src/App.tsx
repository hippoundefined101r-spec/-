import { Routes, Route, useLocation } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { CatalogPage } from './pages/CatalogPage'
import { RoomsPage } from './pages/RoomsPage'
import { RoomPage } from './pages/RoomPage'
import { StocksPage } from './pages/StocksPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderSuccessPage } from './pages/OrderSuccessPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { ProfilePage } from './pages/ProfilePage'
import { OrdersPage } from './pages/OrdersPage'

export default function App() {
  const location = useLocation()
  // Скрываем нижнюю навигацию на «полноэкранных» шагах оформления.
  const hideNav = ['/checkout', '/order-success'].includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/room/:id" element={<RoomPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}
