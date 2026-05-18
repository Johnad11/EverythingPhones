import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';

const Shop = () => {
  const { products: allProducts, addToCart } = useStore();
  const productsData = useMemo(() => allProducts.filter(p => p.category === "Phones"), [allProducts]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [maxPrice, setMaxPrice] = useState(3000000);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleCondition = (cond) => {
    setSelectedConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
      const matchPrice = product.price <= maxPrice;
      return matchBrand && matchPrice && matchCondition;
    });
  }, [selectedBrands, selectedConditions, maxPrice, productsData]);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedConditions([]);
    setMaxPrice(3000000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-16">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h1 className="font-headline text-5xl font-bold text-gradient mb-4">Elite Tech Collection</h1>
          <p className="font-body text-xl text-gray-400 max-w-2xl">Verified flagship technology with a touch of luxury. Explore our curated selection of premium devices.</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="glass-panel p-8 rounded-[32px] space-y-10 sticky top-28">
            <div>
              <h3 className="font-headline text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Brand</h3>
              <div className="space-y-4">
                {['Apple iPhone', 'Samsung Galaxy', 'Google Pixel', 'Generic'].map(brand => (
                  <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="form-checkbox bg-black border-white/20 text-primary rounded focus:ring-primary"
                    />
                    <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-primary font-bold' : 'text-gray-300 group-hover:text-primary'}`}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-headline text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Condition</h3>
              <div className="flex flex-col gap-3">
                {['New', 'Used', 'Refurbished'].map(cond => (
                  <button 
                    key={cond}
                    onClick={() => toggleCondition(cond)}
                    className={`text-left px-5 py-3 rounded-xl text-sm border transition-all ${selectedConditions.includes(cond) ? 'bg-primary text-black font-bold shadow-glow border-primary' : 'bg-surface text-gray-300 border-white/5 hover:border-primary/30'}`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-headline text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Price Range</h3>
              <div className="px-2">
                <input 
                  type="range" 
                  min="0"
                  max="3000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                />
                <div className="flex justify-between mt-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Under ₦{(maxPrice/1000).toFixed(0)}k</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">₦3.0M</span>
                </div>
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full py-4 bg-transparent border border-primary/30 text-primary rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-primary/10 transition-all active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-10">
            <span className="text-gray-500 text-sm">Showing {filteredProducts.length} of {productsData.length} items</span>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="bg-transparent border-none text-primary font-bold focus:ring-0 cursor-pointer text-sm">
                <option>Latest Arrival</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div 
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel rounded-[32px] overflow-hidden group hover:border-primary/30 transition-all duration-500"
                  >
                    <div className="relative h-72 bg-black flex items-center justify-center p-12">
                      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                        <span className="bg-primary text-black px-3 py-1 rounded font-bold text-[10px] uppercase">
                          {product.conditionLabel || product.condition}
                        </span>
                        {product.savings && (
                          <span className="bg-white/10 backdrop-blur-md text-white border border-white/10 px-3 py-1 rounded font-bold text-[10px] uppercase">
                            SAVE {product.savings}
                          </span>
                        )}
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
                      <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                        <h2 className="font-headline text-2xl font-bold text-white mb-2 leading-tight h-14 line-clamp-2">{product.name}</h2>
                      </Link>
                      <p className="text-sm text-gray-400 mb-6">{product.specs}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <span className="material-symbols-outlined text-[18px]">
                            {product.battery ? 'battery_very_low' : (product.category === 'Phones' ? 'photo_camera' : 'bolt')}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {product.battery || product.special || 'Premium'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <span className="material-symbols-outlined text-[18px]">
                            {product.chip ? 'memory' : 'verified_user'}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {product.chip || product.warranty || product.network || 'Verified'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          {product.oldPrice && (
                            <span className="text-gray-600 line-through text-xs block mb-1">{product.oldPrice}</span>
                          )}
                          <div className="font-headline text-2xl font-bold text-primary">{product.priceLabel}</div>
                        </div>
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
            <div className="mt-20 text-center glass-panel p-20 rounded-[48px]">
              <span className="material-symbols-outlined text-6xl text-gray-700 mb-4">search_off</span>
              <h3 className="text-2xl font-bold mb-2">No matching items found</h3>
              <p className="text-gray-500">Try adjusting your filters or clear all to see the full collection.</p>
              <button 
                onClick={clearFilters}
                className="mt-8 btn-outline"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="mt-20 flex justify-center items-center space-x-4">
              <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 text-gray-500 hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-black font-bold shadow-glow">1</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 text-gray-500 hover:border-primary hover:text-primary transition-all">2</button>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 text-gray-500 hover:border-primary hover:text-primary transition-all">3</button>
              <span className="text-gray-700">...</span>
              <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 text-gray-500 hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
