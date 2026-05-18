import { useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart } = useStore();
  
  const product = products.find(p => p.id.toString() === id.toString());

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold">Product not found</h1>
      </div>
    );
  }

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-square glass-panel rounded-[48px] overflow-hidden p-12 flex items-center justify-center bg-black/40">
            <img 
              src={product.image} 
              className="h-full object-contain" 
              alt={product.name} 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(product.images && product.images.length > 0 ? product.images : [product.image]).slice(0, 4).map((imgUrl, i) => (
              <div key={i} className="aspect-square glass-panel rounded-2xl p-4 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all bg-black/20">
                <img src={imgUrl} className="h-full object-contain opacity-60" alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
              {product.conditionLabel || product.condition}
            </span>
            <h1 className="text-5xl font-bold mt-4 mb-2">{product.name}</h1>
            <p className="text-gray-400 text-xl font-body">{product.specs}</p>
          </div>

          <div className="flex items-center gap-6 mb-10">
            <div className="text-4xl font-bold text-primary">{product.priceLabel}</div>
            {product.oldPrice && (
              <div className="text-gray-500 line-through text-xl">{product.oldPrice}</div>
            )}
            {product.savings && (
              <span className="bg-white/10 text-white px-3 py-1 rounded-lg text-sm font-bold">SAVE {product.savings}</span>
            )}
          </div>

          <div className="space-y-8 flex-grow">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Availability</h3>
              <div className="flex gap-4">
                <span className={`font-bold ${isOutOfStock ? 'text-red-400' : 'text-green-400'}`}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} units available)`}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Condition Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 glass-panel rounded-xl">
                  <span className="text-xs text-gray-500 block">Battery Health</span>
                  <span className="text-lg font-bold">{product.battery || '95% - 100%'}</span>
                </div>
                <div className="p-4 glass-panel rounded-xl">
                  <span className="text-xs text-gray-500 block">Status</span>
                  <span className="text-lg font-bold text-green-400">Unlocked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <button 
              disabled={isOutOfStock}
              onClick={() => addToCart(product)}
              className={`flex-grow py-5 font-bold uppercase tracking-widest text-xs transition-all rounded-2xl shadow-glow ${
                isOutOfStock 
                  ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed shadow-none' 
                  : 'bg-primary text-black hover:bg-white active:scale-95'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="p-5 glass-panel rounded-2xl hover:border-primary transition-all">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
