import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useStore();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  
  // Checkout Form State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleQuantityChange = (productId, newQty, stock) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    if (stock !== undefined && newQty > stock) {
      alert(`Only ${stock} units are currently available in stock.`);
      return;
    }
    updateCartQuantity(productId, newQty);
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    // Generate a unique Order Reference ID
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setOrderRef(`EVTP-${randomNum}`);
    setShowCheckoutForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert("Please fill in your name and phone number.");
      return;
    }

    setRedirecting(true);

    // Build the formatted WhatsApp message
    const timestamp = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }) + ' (WAT)';
    let orderDetailsText = "";
    
    cart.forEach((item, index) => {
      const p = item.product;
      const isMultiple = item.quantity > 1;
      const priceText = isMultiple ? `₦${p.price.toLocaleString()} each` : `₦${p.price.toLocaleString()}`;
      orderDetailsText += `${index + 1}. ${p.name}\n   Quantity: ${item.quantity}\n   Price: ${priceText}\n\n`;
    });

    const rawMessage = `Hello, this is an order from the EverythingPhones Website.

ORDER DETAILS:

${orderDetailsText}---

TOTAL: ₦${total.toLocaleString()}

Order ID: ${orderRef}
Order Source: Website Checkout
Date: ${timestamp}

CUSTOMER INFORMATION:
- Name: ${customerInfo.name}
- Phone: ${customerInfo.phone}
${customerInfo.address ? `- Delivery Address: ${customerInfo.address}\n` : ''}
Please confirm availability.`;

    // Save order details for real-time tracking in the Admin Dashboard!
    const orderData = {
      id: orderRef,
      orderId: orderRef,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address || '',
      items: cart.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: total,
      createdAt: new Date().toISOString()
    };

    const isFirebaseActive = () => {
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      return apiKey && apiKey !== "YOUR_API_KEY" && apiKey !== "";
    };

    if (isFirebaseActive()) {
      try {
        await addDoc(collection(db, 'orders'), orderData);
        console.log("Successfully recorded order in Firestore database!");
      } catch (error) {
        console.error("Error writing order to Firestore:", error);
      }
    } else {
      try {
        const mockOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        mockOrders.unshift(orderData);
        localStorage.setItem('mock_orders', JSON.stringify(mockOrders));
        console.log("Successfully recorded order in Mock Local Storage!");
      } catch (error) {
        console.error("Error writing mock order to localStorage:", error);
      }
    }

    // Resolve WhatsApp number dynamically from admin configurations
    let whatsappNum = "2349032160435";
    try {
      const savedSettings = localStorage.getItem('storeSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.whatsappNumber) {
          whatsappNum = parsed.whatsappNumber.replace(/\D/g, ''); // Keep only numeric digits
        }
      }
    } catch (err) {
      console.error("Error extracting admin WhatsApp number:", err);
    }

    const encodedMessage = encodeURIComponent(rawMessage);
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedMessage}`;

    // Simulate a glowing premium checkout loading screen
    setTimeout(() => {
      clearCart();
      window.location.href = whatsappUrl;
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 min-h-[80vh] flex flex-col justify-center">
      <h1 className="text-4xl font-bold mb-12">Your <span className="text-primary glow-sm">Cart</span></h1>
      
      <AnimatePresence mode="wait">
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-20 glass-card rounded-[40px] border border-white/5 space-y-6"
          >
            <span className="material-symbols-outlined text-7xl text-gray-600 animate-pulse">shopping_cart_checkout</span>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-gray-400 max-w-md mx-auto">Looks like you haven't added any elite tech items to your cart yet. Explore our premier inventory to get started.</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-4 mt-4">
              <span className="material-symbols-outlined text-sm">shopping_bag</span>
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-center border border-white/5 group hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="w-24 h-24 bg-black/40 rounded-2xl flex items-center justify-center p-3 border border-white/10 shrink-0">
                      <img src={item.product.image} className="h-full object-contain transform group-hover:scale-105 transition-transform" alt={item.product.name} />
                    </div>
                    
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{item.product.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{item.product.specs}</p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                        <button 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1, item.product.stock)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-primary hover:text-primary transition-all flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-white w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.product.stock)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-primary hover:text-primary transition-all flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                        {item.product.stock !== undefined && (
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            Stock: {item.product.stock}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-right shrink-0">
                      <div className="text-xl font-bold text-primary">₦{(item.product.price * item.quantity).toLocaleString()}</div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-500 hover:text-red-400 mt-4 underline text-xs transition-colors"
                      >
                        Remove Item
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div className="glass-card p-8 rounded-[32px] border border-white/5 h-fit space-y-6">
              <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Items Count</span>
                  <span className="font-bold text-white">{cartItemsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold text-white">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400 font-bold uppercase tracking-wider text-sm">FREE</span>
                </div>
                
                <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                  <span className="text-lg font-bold">Grand Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary glow-sm">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Note on checkout */}
              <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl flex gap-3 items-start">
                <span className="material-symbols-outlined text-purple-400 text-lg select-none">info</span>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  After checkout, your order will be sent directly to our WhatsApp for confirmation.
                </p>
              </div>

              <button 
                onClick={handleCheckoutClick}
                className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">shopping_cart_checkout</span>
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Info / Checkout Modal */}
      <AnimatePresence>
        {showCheckoutForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-white/10 p-10 rounded-[40px] shadow-2xl z-10 space-y-8"
            >
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">Delivery <span className="text-primary">Details</span></h3>
                <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider font-bold">Order ID: {orderRef}</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest ml-1">Your Full Name *</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Samuel Adebayo"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-2xl px-5 py-4 focus:border-primary outline-none transition-all text-white placeholder:text-gray-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest ml-1">WhatsApp Phone Number *</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="e.g. +234 80 1234 5678"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-2xl px-5 py-4 focus:border-primary outline-none transition-all text-white placeholder:text-gray-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest ml-1">Delivery Address (Optional)</label>
                  <textarea 
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full bg-surface-container border border-white/10 rounded-2xl px-5 py-4 focus:border-primary outline-none transition-all text-white placeholder:text-gray-600 min-h-[90px] resize-none text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCheckoutForm(false)}
                    className="flex-1 py-4 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:border-white/30 transition-all text-gray-400"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-glow flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    Send to WhatsApp
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Redirecting success overlay */}
      <AnimatePresence>
        {redirecting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-sm space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                {/* Spinning loader */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <span className="material-symbols-outlined text-primary text-4xl animate-pulse">forum</span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Redirecting to WhatsApp</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your order <span className="text-primary font-bold">{orderRef}</span> is ready! Opening WhatsApp Web or your mobile application to complete confirmation...
                </p>
              </div>

              <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                Connecting with EverythingPhones
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
