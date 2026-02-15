
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Layout } from './components/Layout.tsx';
import { Catalog } from './pages/Catalog.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { SuccessPage } from './pages/SuccessPage.tsx';
import { AdminProducts } from './pages/AdminProducts.tsx';
import { LoginPage } from './pages/LoginPage.tsx';

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
