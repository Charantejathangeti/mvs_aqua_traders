
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout';
import { Catalog } from './pages/Catalog';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { SuccessPage } from './pages/SuccessPage';
import { AdminProducts } from './pages/AdminProducts';
import { LoginPage } from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Catalog />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="checkout/success" element={<SuccessPage />} />
              <Route path="admin/products" element={<AdminProducts />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
