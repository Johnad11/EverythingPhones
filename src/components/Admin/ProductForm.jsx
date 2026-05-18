import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStore } from '../../context/StoreContext';

const ProductForm = ({ initialData = null, onSuccess, onCancel }) => {
  const { addProduct, updateProduct } = useStore();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Apple iPhone',
    category: 'Phones',
    condition: 'Brand New',
    price: '',
    specs: '',
    stock: 1,
    images: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        stock: initialData.stock || 1
      });
      setPreviews(initialData.images || []);
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const previewToRemove = previews[index];
    
    // If it's a blob URL (newly selected file)
    if (previewToRemove.startsWith('blob:')) {
      const fileIndex = index - (formData.images?.length || 0);
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    } else {
      // It's an existing image URL
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
    
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    // Current existing images (those that weren't removed)
    const existingUrls = formData.images || [];
    
    const uploadPromises = imageFiles.map(async (file) => {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });

    const newUrls = await Promise.all(uploadPromises);
    return [...existingUrls, ...newUrls];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload images first
      const imageUrls = await uploadImages();

      // 2. Prepare product data
      const priceNum = parseFloat(formData.price) || 0;
      const productData = {
        ...formData,
        price: priceNum,
        images: imageUrls,
        priceLabel: `₦${priceNum.toLocaleString()}`,
        conditionLabel: formData.condition === 'Brand New' || formData.condition === 'New'
          ? 'BRAND NEW' 
          : (formData.condition === 'UK Used' || formData.condition === 'Used' ? 'USED - MINT' : 'REFURBISHED')
      };

      // 3. Save to Firestore
      if (initialData?.id) {
        await updateProduct(initialData.id, productData);
        onSuccess('Product updated successfully!');
      } else {
        await addProduct(productData);
        onSuccess('Product added to inventory successfully!');
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Device Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. iPhone 15 Pro Max"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all text-sm text-white" 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none text-sm text-white cursor-pointer"
              >
                <option>Phones</option>
                <option>Accessories</option>
                <option>Gaming</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Brand</label>
              <select 
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none text-sm text-white cursor-pointer"
              >
                <option>Apple iPhone</option>
                <option>Samsung Galaxy</option>
                <option>Google Pixel</option>
                <option>Generic</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Condition</label>
              <select 
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none text-sm text-white cursor-pointer"
              >
                <option>Brand New</option>
                <option>UK Used</option>
                <option>Refurbished</option>
                <option>Open Box</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Price (₦)</label>
              <input 
                required
                type="number" 
                placeholder="e.g. 1500000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none text-sm text-white" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Stock Quantity</label>
              <input 
                required
                type="number" 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none text-sm text-white" 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Specifications / Details</label>
            <textarea 
              placeholder="e.g. 256GB, Blue Titanium, 100% Battery Health"
              value={formData.specs}
              onChange={(e) => setFormData({...formData, specs: e.target.value})}
              className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none min-h-[120px] resize-none" 
            />
          </div>
        </div>

        {/* Right Column: Images */}
        <div className="space-y-6">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Device Images</label>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-[32px] p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all bg-white/5 group"
          >
            <span className="material-symbols-outlined text-4xl text-gray-500 mb-4 group-hover:text-primary transition-colors">add_a_photo</span>
            <p className="text-sm text-gray-400 font-medium">Click to upload images</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">Multiple files supported</p>
            <input 
              type="file" 
              multiple 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*"
            />
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-3 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-8">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-5 border border-white/10 rounded-[20px] font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
        >
          Cancel
        </button>
        <button 
          disabled={loading}
          type="submit"
          className={`flex-1 py-5 bg-primary text-black rounded-[20px] font-bold uppercase tracking-widest text-xs transition-all shadow-glow flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            initialData ? 'Update Product' : 'Add to Inventory'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
