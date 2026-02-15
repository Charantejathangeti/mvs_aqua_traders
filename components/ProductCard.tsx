import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { StockBadge } from './StockBadge';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  const handleIncrement = () => {
    if (qty < 50 && qty < product.stockCount) {
      setQty(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > 1) setQty(prev => prev - 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <StockBadge count={product.stockCount} />
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-deepSea mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 flex-grow line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="text-xl font-bold text-gray-900">₹{product.price}</div>
          <div className="text-xs text-gray-400 font-medium">{product.weightGrams}g</div>
        </div>

        {product.stockCount > 0 ? (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button 
                onClick={handleDecrement}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-l-lg disabled:opacity-50"
                disabled={qty <= 1}
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                value={qty} 
                readOnly 
                className="w-10 text-center text-sm font-semibold focus:outline-none" 
              />
              <button 
                onClick={handleIncrement}
                className="p-2 hover:bg-gray-100 text-gray-600 rounded-r-lg disabled:opacity-50"
                disabled={qty >= 50 || qty >= product.stockCount}
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={() => {
                addToCart(product, qty);
                setQty(1);
              }}
              className="flex-1 bg-deepSea text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#003d61] active:transform active:scale-95 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Add
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button disabled className="w-full bg-gray-200 text-gray-400 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
              Out of Stock
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
