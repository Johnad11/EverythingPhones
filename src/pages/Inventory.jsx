import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';

const Inventory = () => {
  const { products, services, addProduct, updateProduct, deleteProduct, updateService } = useStore();
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Phones',
    brand: 'Apple iPhone',
    condition: 'New',
    price: '',
    specs: '',
    image: ''
  });
  
  const fileInputRef = useRef(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceNum = parseInt(formData.price.replace(/[^0-9]/g, ''));
    
    const newProduct = {
      id: editingId || Date.now(),
      ...formData,
      price: priceNum,
      priceLabel: `₦${priceNum.toLocaleString()}`,
      conditionLabel: formData.condition === 'New' ? 'BRAND NEW' : (formData.condition === 'Used' ? 'USED - MINT' : 'REFURBISHED')
    };

    if (editingId) {
      updateProduct(editingId, newProduct);
    } else {
      addProduct(newProduct);
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Phones',
      brand: 'Apple iPhone',
      condition: 'New',
      price: '',
      specs: '',
      image: ''
    });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      condition: product.condition,
      price: product.price.toString(),
      specs: product.specs,
      image: product.image
    });
    setEditingId(product.id);
    setShowAddModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Store <span className="text-primary">Management</span></h1>
          <p className="text-gray-500">Manage your inventory, prices, and services in one place.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-2xl font-bold hover:bg-white transition-all shadow-glow"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-12 border-b border-white/10">
        {['products', 'services'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'products' && (
        <div className="space-y-8">
          {/* Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
            <input 
              type="text"
              placeholder="Search products by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:border-primary outline-none text-white"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Items', value: products.length, icon: 'inventory_2' },
              { label: 'New Phones', value: products.filter(p => p.condition === 'New').length, icon: 'verified' },
              { label: 'Used/Refurbished', value: products.filter(p => p.condition !== 'New').length, icon: 'history_edu' },
              { label: 'Accessories', value: products.filter(p => p.category === 'Accessories').length, icon: 'headphones' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Table */}
          <div className="glass-card rounded-[32px] overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Product</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Price</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Condition</th>
                    <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.slice(0, 50).map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center p-2 border border-white/10">
                            <img src={product.image} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="font-bold">{product.name}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-primary">{product.priceLabel}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.condition === 'New' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                          {product.condition}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-gray-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length > 50 && (
              <div className="p-8 text-center border-t border-white/5">
                <p className="text-gray-500 text-sm">Showing first 50 items. Use search to find specific items.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-4xl">{service.icon}</span>
                <h3 className="font-bold text-xl">{service.title}</h3>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Display Price</label>
                <input 
                  type="text"
                  value={service.price}
                  onChange={(e) => updateService(service.title, { price: e.target.value })}
                  className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface p-10 rounded-[48px] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-bold mb-8">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Capture Section */}
                <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/10 rounded-[32px] bg-black/20 group hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative"
                     onClick={handleCaptureClick}>
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="max-h-48 object-contain" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-gray-500 mb-2 group-hover:text-primary transition-colors">photo_camera</span>
                      <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-center">Snap a Picture or Upload</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*" 
                    capture="environment"
                    className="hidden" 
                  />
                  {formData.image && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <span className="text-white font-bold uppercase tracking-widest text-xs">Retake / Change Image</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Product Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. iPhone 15 Pro Max"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-surface-container border border-white/10 rounded-2xl px-4 py-4 focus:border-primary outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Brand</label>
                    <select 
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full bg-surface-container border border-white/10 rounded-2xl px-4 py-4 focus:border-primary outline-none"
                    >
                      <option>Apple iPhone</option>
                      <option>Samsung Galaxy</option>
                      <option>Google Pixel</option>
                      <option>Generic</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-surface-container border border-white/10 rounded-2xl px-4 py-4 focus:border-primary outline-none"
                    >
                      <option>Phones</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Condition</label>
                    <select 
                      value={formData.condition}
                      onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full bg-surface-container border border-white/10 rounded-2xl px-4 py-4 focus:border-primary outline-none"
                    >
                      <option>New</option>
                      <option>Used</option>
                      <option>Refurbished</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Price (₦)</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 1500000"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full bg-surface-container border border-white/10 rounded-2xl px-4 py-4 focus:border-primary outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Quick Specs</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 256GB, Blue Titanium"
                      value={formData.specs}
                      onChange={(e) => setFormData(prev => ({ ...prev, specs: e.target.value }))}
                      className="w-full bg-surface-container border border-white/10 rounded-2xl px-4 py-4 focus:border-primary outline-none" 
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-xs hover:border-white/30 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-glow"
                  >
                    {editingId ? 'Update Product' : 'Add to Inventory'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
