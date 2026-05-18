import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/Admin/ProductForm';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const { products, deleteProduct, loading } = useStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, categories, settings

  // Product CRUD states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Deletion Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState(null);

  // Orders History State (Synced in Real-time with Firestore)
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Toast Notifications
  const [toast, setToast] = useState(null);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('storeSettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        storeName: 'Everything Phones',
        whatsappNumber: '+2349032160435',
        currency: '₦'
      };
    } catch {
      return { storeName: 'Everything Phones', whatsappNumber: '+2349032160435', currency: '₦' };
    }
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const isFirebaseActive = () => {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    return apiKey && apiKey !== "YOUR_API_KEY" && apiKey !== "";
  };

  // Fetch Orders from Firestore / Local Storage
  useEffect(() => {
    if (!isFirebaseActive()) {
      const loadMockOrders = () => {
        try {
          const mockOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
          setOrders(mockOrders);
        } catch (err) {
          console.error("Error loading mock orders:", err);
        }
        setOrdersLoading(false);
      };

      loadMockOrders();

      // Poll mock orders every second to enable instant, real-time checkout-dashboard sync in demo mode
      const interval = setInterval(loadMockOrders, 1000);
      return () => clearInterval(interval);
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setOrdersLoading(false);
    }, (error) => {
      console.error("Error fetching orders from Firestore:", error);
      setOrdersLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
    showToast('Store settings updated successfully!');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const triggerDeleteConfirm = (product) => {
    setProductToDelete(product);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      showToast(`Successfully deleted ${productToDelete.name}!`, 'success');
    } catch (error) {
      showToast('Error deleting product. Please try again.', 'error');
    } finally {
      setProductToDelete(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      showToast('Error signing out', 'error');
    }
  };

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategoryFilter]);

  // Statistics calculations
  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const totalInventoryValue = products.reduce((acc, curr) => acc + (curr.price * (curr.stock || 0)), 0);

  // Recent Updates Feed
  const recentProducts = useMemo(() => {
    return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-headline border ${
              toast.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}
          >
            <span className="material-symbols-outlined select-none text-sm">
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="text-xs font-bold tracking-wider">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-black/90 border-r border-white/10 shrink-0 md:min-h-screen flex flex-col pt-24 pb-8 px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4 px-4 mb-10 border-b border-white/5 pb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-white shadow-glow-sm uppercase">
            EP
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{storeSettings.storeName}</h2>
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Admin Control</span>
          </div>
        </div>

        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', name: 'Dashboard Overview', icon: 'dashboard' },
            { id: 'products', name: 'Products Management', icon: 'inventory' },
            { id: 'orders', name: 'Orders History', icon: 'receipt_long', badge: orders.length },
            { id: 'categories', name: 'Categories Overview', icon: 'category' },
            { id: 'settings', name: 'Store Settings', icon: 'settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                activeTab === tab.id 
                  ? 'bg-primary text-black font-bold shadow-glow border border-primary' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`material-symbols-outlined text-xl ${
                  activeTab === tab.id ? 'text-black' : 'text-primary'
                }`}>
                  {tab.icon}
                </span>
                <span className="text-sm font-headline tracking-wide">{tab.name}</span>
              </div>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-black text-primary' : 'bg-primary/20 text-primary'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 mt-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-2xl transition-all"
        >
          <span className="material-symbols-outlined text-xl text-red-400">logout</span>
          <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Sign Out</span>
        </button>
      </aside>

      {/* Main Dashboard Workspace */}
      <main className="flex-grow p-8 md:p-12 pt-28 overflow-x-hidden">
        
        {/* Tab Components Wrapper */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-12"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome Back, <span className="text-primary glow-sm">Owner</span></h1>
                <p className="text-gray-500">Here's your live tech store inventory overview.</p>
              </div>

              {/* Grid Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Products', value: totalProducts, icon: 'inventory_2', color: 'text-primary bg-primary/10' },
                  { label: 'Products In Stock', value: inStockCount, icon: 'check_circle', color: 'text-green-400 bg-green-500/10' },
                  { label: 'Out of Stock Items', value: outOfStockCount, icon: 'error_outline', color: 'text-red-400 bg-red-500/10' },
                  { label: 'Total Inventory Value', value: `₦${totalInventoryValue.toLocaleString()}`, icon: 'payments', color: 'text-purple-400 bg-purple-500/10' }
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                      <span className="material-symbols-outlined">{stat.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Layout split: Recent Products & Quick Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Items feed */}
                <div className="glass-panel p-8 rounded-[36px] border border-white/5 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="font-bold text-lg">Recent Updates</h3>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Live Feed</span>
                  </div>
                  <div className="space-y-4">
                    {recentProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-10 h-10 object-contain p-1 rounded-lg bg-black/40 border border-white/10" alt="" />
                          <div>
                            <div className="text-sm font-bold text-white">{p.name}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{p.category} • {p.brand}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">{p.priceLabel}</div>
                          <div className="text-[10px] text-gray-500">{p.stock} in stock</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions & services stats */}
                <div className="glass-panel p-8 rounded-[36px] border border-white/5 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                      <h3 className="font-bold text-lg">Quick Tasks</h3>
                      <span className="material-symbols-outlined text-purple-400">bolt</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => { setActiveTab('products'); handleAdd(); }}
                        className="p-6 bg-white/5 border border-white/5 hover:border-primary/20 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
                      >
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform mb-3">add_box</span>
                        <span className="text-xs font-bold uppercase tracking-wider">New Product</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="p-6 bg-white/5 border border-white/5 hover:border-primary/20 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
                      >
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform mb-3">shopping_bag</span>
                        <span className="text-xs font-bold uppercase tracking-wider">View Orders</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 mt-6">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">WhatsApp Redirect Status</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Orders placed by customers will automatically sync into your control panel and prompt them to confirm via <strong>{storeSettings.whatsappNumber}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Product management header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Manage <span className="text-primary">Inventory</span></h1>
                  <p className="text-gray-500">Search, filter, edit, or delete items in your catalog.</p>
                </div>
                <button 
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-primary text-black px-6 py-4 rounded-2xl font-bold hover:bg-white transition-all shadow-glow active:scale-95 text-xs uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Product
                </button>
              </div>

              {/* Filters & search */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                  <input 
                    type="text"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-container border border-white/10 rounded-2xl pl-16 pr-8 py-4 focus:border-primary outline-none transition-all text-sm"
                  />
                </div>

                <select 
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none text-white text-sm cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Phones">Phones</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>

              {/* Grid/Table list of items */}
              <div className="glass-card rounded-[32px] overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Level</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Condition</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-xl p-1 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                                  <img src={p.image} className="max-h-full object-contain mx-auto" alt="" />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{p.name}</div>
                                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{p.brand}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="text-xs font-semibold text-gray-400">{p.category}</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-sm font-bold text-primary">{p.priceLabel}</div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${p.stock <= 0 ? 'bg-red-400' : (p.stock <= 2 ? 'bg-yellow-400' : 'bg-green-400')}`}></span>
                                <span className={`text-xs font-bold ${p.stock <= 0 ? 'text-red-400' : (p.stock <= 2 ? 'bg-yellow-400' : 'text-gray-300')}`}>
                                  {p.stock <= 0 ? 'Out of Stock' : `${p.stock} Units`}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="bg-white/5 text-white border border-white/10 px-3 py-1 rounded text-[10px] uppercase font-bold">
                                {p.conditionLabel || p.condition}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <div className="flex gap-2 justify-center">
                                <button 
                                  onClick={() => handleEdit(p)}
                                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-primary/10 text-gray-400 hover:text-primary flex items-center justify-center transition-all border border-white/5"
                                  title="Edit Item"
                                >
                                  <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button 
                                  onClick={() => triggerDeleteConfirm(p)}
                                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-400/10 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all border border-white/5"
                                  title="Delete Item"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-20 text-center text-gray-500">
                            <span className="material-symbols-outlined text-5xl text-gray-700 block mb-3">search_off</span>
                            No matching items found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2">Orders <span className="text-primary">History</span></h1>
                <p className="text-gray-500">Real-time log of WhatsApp checkout submissions.</p>
              </div>

              <div className="glass-card rounded-[32px] overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Order Details</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Info</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Date & Time</th>
                        <th className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Order Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ordersLoading ? (
                        <tr>
                          <td colSpan="4" className="py-20 text-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Loading checkout history...
                          </td>
                        </tr>
                      ) : orders.length > 0 ? (
                        orders.map(o => (
                          <tr key={o.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-8 py-5">
                              <div className="font-bold text-white text-sm mb-1">{o.orderId}</div>
                              <div className="text-xs text-gray-500 max-w-xs space-y-1">
                                {o.items?.map((item, idx) => (
                                  <div key={idx} className="truncate">
                                    • {item.name} <span className="text-primary font-bold">x{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-sm font-bold text-white">{o.customerName}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{o.customerPhone}</div>
                              {o.customerAddress && (
                                <div className="text-[10px] text-gray-500 mt-1 italic max-w-[200px] truncate" title={o.customerAddress}>
                                  Addr: {o.customerAddress}
                                </div>
                              )}
                            </td>
                            <td className="px-8 py-5">
                              <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</div>
                              <div className="text-[10px] text-gray-600 mt-0.5">{new Date(o.createdAt).toLocaleTimeString()}</div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="text-base font-bold text-primary">₦{o.total?.toLocaleString()}</div>
                              <span className="text-[9px] uppercase font-bold tracking-widest text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                                WhatsApp Sent
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-20 text-center text-gray-500">
                            <span className="material-symbols-outlined text-5xl text-gray-700 block mb-3">receipt_long</span>
                            No checkout orders recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2">Store <span className="text-primary">Categories</span></h1>
                <p className="text-gray-500">Overview of product groupings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Phones', icon: 'smartphone', desc: 'Flagship mobile devices and smartphones.' },
                  { name: 'Accessories', icon: 'headphones', desc: 'Audio accessories, cases, and charging blocks.' },
                  { name: 'Gaming', icon: 'sports_esports', desc: 'Consoles, next-gen controllers, and games.' }
                ].map(cat => {
                  const catProducts = products.filter(p => p.category === cat.name);
                  const catValue = catProducts.reduce((acc, curr) => acc + (curr.price * (curr.stock || 0)), 0);

                  return (
                    <div key={cat.name} className="glass-panel p-8 rounded-[36px] border border-white/5 space-y-6 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
                      <div className="space-y-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                        </div>
                        <h3 className="text-2xl font-bold">{cat.name}</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">{cat.desc}</p>
                      </div>
                      
                      <div className="border-t border-white/5 pt-4 mt-6 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Total Items</div>
                          <div className="text-lg font-bold text-white mt-0.5">{catProducts.length} items</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Stock Value</div>
                          <div className="text-base font-bold text-primary mt-0.5">₦{catValue.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8 max-w-xl"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2">Store <span className="text-primary">Settings</span></h1>
                <p className="text-gray-500">Configure global metadata and contacts.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="glass-panel p-8 rounded-[36px] border border-white/5 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest ml-1">Store Name</label>
                  <input 
                    type="text" 
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-2xl px-5 py-4 focus:border-primary outline-none transition-all text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest ml-1">Primary WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={storeSettings.whatsappNumber}
                    onChange={(e) => setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-2xl px-5 py-4 focus:border-primary outline-none transition-all text-sm text-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-2 ml-1">Must contain country code, e.g. +2349032160435</p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button 
                    type="submit"
                    className="btn-primary px-8 py-4 text-xs font-bold uppercase tracking-widest shadow-glow flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    Save Configurations
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Form Modal */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFormModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-4xl bg-surface p-8 sm:p-12 rounded-[56px] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
            >
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-4">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {editingProduct ? 'Edit' : 'Add'} <span className="text-primary">Product</span>
                </h2>
                <button onClick={() => setShowFormModal(false)} className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">close</span>
                </button>
              </div>

              <ProductForm 
                initialData={editingProduct} 
                onSuccess={(msg) => {
                  setShowFormModal(false);
                  setEditingProduct(null);
                  showToast(msg || 'Product updated successfully!');
                }} 
                onCancel={() => setShowFormModal(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Deletion Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-red-500/20 p-8 sm:p-10 rounded-[40px] shadow-2xl z-10 space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto select-none">
                <span className="material-symbols-outlined text-2xl">delete_forever</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Confirm Deletion</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Are you absolutely sure you want to delete <strong className="text-white">{productToDelete.name}</strong>? This action will permanently remove it from the catalog and cannot be undone.
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-4 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:border-white/30 transition-all text-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDelete}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-red-500/15"
                >
                  Delete Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
