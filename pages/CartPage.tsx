import React, { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { calculateShipping } from '../services/shippingService';
import { Trash2, Plus, Minus, ArrowRight, AlertCircle } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const { shipping, subtotal, total } = useMemo(() => {
    const shippingDetails = calculateShipping(items);
    const sub = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return {
      shipping: shippingDetails,
      subtotal: sub,
      total: sub + shippingDetails.cost
    };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4 text-gray-300">
          <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any aquatic friends yet.</p>
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-deepSea text-white rounded-lg hover:bg-[#003d61] transition font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Items List */}
      <div className="md:col-span-2 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700">Shopping Cart ({items.length} items)</h2>
            <span className="text-xs text-gray-500">Max 50pcs per item</span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex gap-4">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                
                <div className="flex-grow">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-bold text-deepSea">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-coralPop transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{item.weightGrams}g per unit</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-200 rounded-lg h-8">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 h-full hover:bg-gray-50 text-gray-600 border-r border-gray-200"
                      >
                        <Minus size={14} />
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        readOnly 
                        className="w-12 text-center text-sm font-semibold focus:outline-none" 
                      />
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 h-full hover:bg-gray-50 text-gray-600 border-l border-gray-200"
                        disabled={item.quantity >= 50}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="font-bold text-gray-900">₹{item.price * item.quantity}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
          
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Weight</span>
              <span>{shipping.weightKg.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between text-gray-800 font-medium pt-3 border-t border-dashed border-gray-200">
              <span>Shipping ({shipping.isTier1 ? 'Tier 1' : 'Tier 2'})</span>
              <span>₹{shipping.cost}</span>
            </div>
            {shipping.isTier1 ? (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Flat Rate (Under 1kg)
              </p>
            ) : (
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Heavy Load (Over 1kg)
              </p>
            )}
          </div>

          <div className="flex justify-between items-end mb-6 pt-4 border-t border-gray-200">
            <span className="text-gray-800 font-bold">Total</span>
            <span className="text-2xl font-extrabold text-deepSea">₹{total}</span>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-coralPop text-white py-3 rounded-lg font-bold shadow-lg shadow-coralPop/30 hover:shadow-coralPop/40 hover:-translate-y-0.5 transition flex justify-center items-center gap-2"
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
          <AlertCircle className="text-deepSea flex-shrink-0" size={20} />
          <div className="text-xs text-deepSea">
            <p className="font-bold mb-1">Shipping Policy</p>
            <p>We currently ship to Telangana (T.S.) and Andhra Pradesh (A.P.) only. Orders are dispatched every Monday.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
