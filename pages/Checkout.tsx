import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { calculateShipping, generateWhatsAppLink } from '../services/shippingService';
import { OrderForm } from '../types';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<OrderForm>({
    customerName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    state: 'Andhra Pradesh',
    pincode: '',
  });

  const shipping = calculateShipping(items);
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shipping.cost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Backend Order Creation
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const link = generateWhatsAppLink(items, shipping, form, orderId);

    // In a real app, we would POST to /api/orders here
    // For now, we simulate the delay and redirect
    setTimeout(() => {
      clearCart();
      // Redirect to Success Page which then auto-opens WhatsApp or shows button
      // But for this flow, we will direct the user directly to WhatsApp in a new tab and show success
      window.open(link, '_blank');
      navigate('/checkout/success');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-deepSea mb-8 text-center">Secure Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
            <ShieldCheck size={20} />
            <span className="text-sm font-semibold">Verified WhatsApp Business Checkout</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                required 
                type="text" 
                name="customerName" 
                value={form.customerName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepSea focus:border-deepSea outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input 
                  required 
                  type="tel" 
                  name="phone" 
                  value={form.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-deepSea focus:border-deepSea outline-none transition"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <textarea 
                required 
                name="address" 
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepSea focus:border-deepSea outline-none transition"
                placeholder="H.No, Street, Landmark"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City/Town</label>
                <input 
                  required 
                  type="text" 
                  name="city" 
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepSea focus:border-deepSea outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input 
                  required 
                  type="text" 
                  name="pincode" 
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepSea focus:border-deepSea outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input 
                  required 
                  type="text" 
                  name="district" 
                  value={form.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepSea focus:border-deepSea outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select 
                  name="state" 
                  value={form.state} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepSea focus:border-deepSea outline-none transition bg-white"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition flex justify-center items-center gap-2"
            >
              {loading ? 'Processing...' : 'Confirm Order via WhatsApp'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              By clicking confirm, you will be redirected to WhatsApp to send your order details directly to the owner.
            </p>
          </form>
        </div>

        {/* Mini Summary */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
          <h3 className="font-bold text-gray-800 mb-4">Your Order</h3>
          <div className="space-y-3 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} x{item.quantity}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
