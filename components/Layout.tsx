
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Role, Product } from '../types';
import { ShoppingCart, Package, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { AiAssistant } from './AiAssistant';
import { ProductService } from '../services/productService';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    ProductService.getProducts().then(setProducts);
  }, [location.pathname]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <header className="bg-deepSea text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <span>🐠</span> Mvs_Aqua
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className={`hover:text-coralPop transition ${location.pathname === '/' ? 'text-coralPop' : ''}`}>
              Catalog
            </Link>
            
            {user && (user.role === Role.ADMIN || user.role === Role.OWNER) && (
              <Link to="/admin/products" className={`hover:text-coralPop transition flex items-center gap-1 ${location.pathname.includes('admin') ? 'text-coralPop' : ''}`}>
                <Package size={18} /> Admin
              </Link>
            )}

            <Link to="/cart" className="relative hover:text-coralPop transition">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-coralPop text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3 border-l border-white/20 pl-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs text-blue-200">Logged in as</span>
                  <span className="text-sm font-bold">{user.name}</span>
                </div>
                <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition border border-white/10"
              >
                <LogIn size={16} /> Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <AiAssistant products={products} />

      <footer className="bg-slate-900 text-slate-300 py-8 text-sm">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-3 text-lg">Mvs_Aqua</h3>
            <p>Premium aquatic products delivered to your doorstep.</p>
            <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-700">
              <p className="font-bold text-coralPop">MONDAY DISPATCH ONLY</p>
              <p className="text-xs mt-1">Orders processed weekly. Shipping to Telangana & AP only.</p>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Contact Us</h3>
            <p>15 Line, Upadhyaya Nagar</p>
            <p>Tirupati, Andhra Pradesh 517507</p>
            <p className="mt-2 text-white">📞 +91 94902 55775</p>
            <p className="mt-1 text-green-400">📱 +91 63023 82280 (WhatsApp)</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="https://www.tpcindia.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Track Your Order (TPC India)</a></li>
              <li><Link to="/cart" className="hover:text-white">My Cart</Link></li>
              <li><Link to="/login" className="hover:text-white">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Mvs_Aqua. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
