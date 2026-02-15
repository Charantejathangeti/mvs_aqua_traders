
import React, { useState, useEffect } from 'react';
import { Product, Role } from '../types';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Trash2, Edit2, Plus, Save, X, RefreshCw, Loader2, CheckCircle2, ExternalLink, Database } from 'lucide-react';
import { ProductService } from '../services/productService';

export const AdminProducts: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await ProductService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const syncData = async () => {
    setSyncing(true);
    const data = await ProductService.syncWithGoogleSheet();
    setProducts(data);
    setSyncing(false);
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  if (!user || (user.role !== Role.ADMIN && user.role !== Role.OWNER)) {
    return <Navigate to="/" replace />;
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      ProductService.saveProducts(updated);
      triggerSaveFeedback();
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setIsAdding(false);
  };

  const saveEdit = () => {
    if (editingId && editForm.name) {
      const updated = products.map(p => 
        p.id === editingId ? { ...p, ...editForm } as Product : p
      );
      setProducts(updated);
      ProductService.saveProducts(updated);
      setEditingId(null);
      triggerSaveFeedback();
    }
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditingId('new');
    setEditForm({
      id: Date.now().toString(),
      name: '',
      price: 0,
      stockCount: 0,
      weightGrams: 0,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
      description: '',
      category: 'Livestock',
      difficulty: 'Beginner'
    });
  };

  const saveAdd = () => {
    if (editForm.name) {
      const updated = [...products, editForm as Product];
      setProducts(updated);
      ProductService.saveProducts(updated);
      setIsAdding(false);
      setEditingId(null);
      triggerSaveFeedback();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'stockCount' || name === 'weightGrams') ? Number(value) : value
    }));
  };

  return (
    <div className="container mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deepSea flex items-center gap-2">
            <Database size={24} className="text-coralPop" />
            Product Inventory
          </h1>
          <p className="text-sm text-gray-500">Manage your catalog via Google Sheets or local controls.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {showSaveToast && (
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium border border-green-100 animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 size={16} /> Updated
            </div>
          )}
          <button 
            onClick={syncData}
            disabled={syncing}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
          >
            {syncing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
            Sync Sheet
          </button>
          <button 
            onClick={startAdd}
            disabled={isAdding}
            className="bg-deepSea text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#003d61] disabled:opacity-50 transition shadow-md"
          >
            <Plus size={18} /> New Product
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Database size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900">Google Sheet Database</p>
            <p className="text-xs text-blue-700">Connect your spreadsheet to update prices and stock in real-time.</p>
          </div>
        </div>
        <a 
          href="https://docs.google.com/spreadsheets" 
          target="_blank" 
          rel="noreferrer"
          className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center gap-1 transition"
        >
          Open Sheet <ExternalLink size={12} />
        </a>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-deepSea w-10 h-10" />
          <p className="text-gray-400 animate-pulse">Fetching inventory...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Price (₹)</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isAdding && (
                  <tr className="bg-blue-50/50">
                    <td className="px-6 py-4">
                      <input name="name" placeholder="Fish Name" className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-deepSea outline-none" value={editForm.name || ''} onChange={handleChange} autoFocus />
                    </td>
                    <td className="px-6 py-4">
                      <input name="price" type="number" className="w-24 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-deepSea outline-none" value={editForm.price || ''} onChange={handleChange} />
                    </td>
                    <td className="px-6 py-4">
                      <input name="stockCount" type="number" className="w-20 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-deepSea outline-none" value={editForm.stockCount || ''} onChange={handleChange} />
                    </td>
                    <td className="px-6 py-4">
                      <input name="category" placeholder="Category" className="w-28 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-deepSea outline-none" value={editForm.category || ''} onChange={handleChange} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={saveAdd} className="bg-green-600 text-white p-2 rounded hover:bg-green-700 shadow-sm"><Save size={18} /></button>
                        <button onClick={cancelEdit} className="bg-gray-200 text-gray-600 p-2 rounded hover:bg-gray-300"><X size={18} /></button>
                      </div>
                    </td>
                  </tr>
                )}
                
                {products.length === 0 && !isAdding && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      Your catalog is currently empty.
                    </td>
                  </tr>
                )}

                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input name="name" className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-deepSea outline-none" value={editForm.name} onChange={handleChange} />
                      ) : (
                        <div className="flex items-center gap-3">
                          <img src={product.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-100 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-deepSea">{product.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input name="price" type="number" className="w-24 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-deepSea outline-none" value={editForm.price} onChange={handleChange} />
                      ) : (
                        `₹${product.price}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input name="stockCount" type="number" className="w-20 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-deepSea outline-none" value={editForm.stockCount} onChange={handleChange} />
                      ) : (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${product.stockCount === 0 ? 'bg-red-50 text-red-600' : product.stockCount <= 10 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                          {product.stockCount}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === product.id ? (
                        <input name="category" className="w-28 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-deepSea outline-none" value={editForm.category} onChange={handleChange} />
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200">{product.category}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingId === product.id ? (
                          <>
                            <button onClick={saveEdit} className="text-green-600 hover:bg-green-50 p-1.5 rounded" title="Save"><Save size={18} /></button>
                            <button onClick={cancelEdit} className="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Cancel"><X size={18} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(product)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded" title="Edit"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors" title="Delete"><Trash2 size={18} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
