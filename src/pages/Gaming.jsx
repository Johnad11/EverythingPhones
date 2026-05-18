import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';

const Gaming = () => {
  const { products, addToCart } = useStore();

  const gamingProducts = useMemo(() => {
    return products.filter(p => p.category === "Gaming");
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-20">
        <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm">Gamer's Paradise</span>
        <h1 className="text-6xl font-bold mt-4">Next-Gen <span className="text-primary glow-sm">Gaming</span></h1>
        <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
          From PS5 consoles to elite controllers and the latest titles. Level up your gaming ecosystem.
        </p>
      </div>

      {gamingProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {gamingProducts.map((product) => (
              <motion.div 
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-[32px] overflow-hidden group hover:border-primary/30 transition-all duration-500 border border-white/5"
              >
                <div className="relative h-64 bg-black flex items-center justify-center p-8">
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-primary text-black px-3 py-1 rounded font-bold text-[10px] uppercase">
                      {product.conditionLabel || product.condition || 'Premium'}
                    </span>
                  </div>
                  <Link to={`/product/${product.id}`} className="h-full block flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-full object-contain transform group-hover:scale-110 transition-transform duration-700 mx-auto" 
                    />
                  </Link>
                </div>
                <div className="p-8">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                    {product.brand || 'Gaming'}
                  </span>
                  <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                    <h3 className="text-2xl font-bold mt-2 leading-tight h-14 line-clamp-2">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-400 mt-2 mb-6 line-clamp-1">{product.specs || 'Premium Gaming Equipment'}</p>
                  
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-2xl font-bold text-primary">{product.priceLabel}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="p-4 bg-primary text-black rounded-2xl hover:bg-white transition-all active:scale-90 shadow-glow flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined">shopping_cart</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="mt-20 text-center glass-panel p-20 rounded-[48px] border border-white/5 max-w-xl mx-auto">
          <span className="material-symbols-outlined text-6xl text-gray-700 mb-4 block">sports_esports</span>
          <h3 className="text-2xl font-bold mb-2">No Gaming Gear Found</h3>
          <p className="text-gray-500">Our elite gaming gear will be stocked soon. Go to the Admin Dashboard to add new consoles, controllers, and accessories!</p>
        </div>
      )}
    </div>
  );
};

export default Gaming;
