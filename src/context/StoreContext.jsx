import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { productsData as localProducts } from '../data/products';

const StoreContext = createContext();

// Helper to check if Firebase is configured with active keys
const isFirebaseActive = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== "YOUR_API_KEY" && apiKey !== "";
};

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Cart State with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Subscribe to Products with normalizations and auto-seeding
  useEffect(() => {
    if (!isFirebaseActive()) {
      // --- DEMO MODE ACTIVE ---
      console.log("Firebase not configured. Running Store Inventory in Local Demo Mode.");
      try {
        const savedProducts = localStorage.getItem('mock_products');
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          // Seed local products with full normalization
          const seeded = localProducts.map((p, index) => {
            const priceNum = parseFloat(p.price) || 0;
            const images = p.image ? [p.image] : [];
            return {
              id: `mock-prod-${index}-${Date.now()}`,
              name: p.name || 'Gadget Item',
              category: p.category || 'Phones',
              brand: p.brand || 'Generic',
              condition: p.condition || 'New',
              conditionLabel: p.conditionLabel || (p.condition === 'New' ? 'BRAND NEW' : (p.condition === 'Used' ? 'USED - MINT' : 'REFURBISHED')),
              price: priceNum,
              priceLabel: p.priceLabel || `₦${priceNum.toLocaleString()}`,
              specs: p.specs || 'Various Specs, Unlocked',
              images: images,
              image: images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500',
              stock: 5,
              createdAt: new Date().toISOString()
            };
          });
          localStorage.setItem('mock_products', JSON.stringify(seeded));
          setProducts(seeded);
        }
      } catch (err) {
        console.error("Error managing mock products:", err);
      }
      setLoading(false);
      return;
    }

    // --- REAL FIREBASE MODE ACTIVE ---
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && !seeding) {
        setSeeding(true);
        console.log("Firestore products collection is empty. Seeding database with initial items...");
        try {
          // Upload initial products in batch / parallel
          const promises = localProducts.map((p) => {
            const priceNum = parseFloat(p.price) || 0;
            const docData = {
              name: p.name || 'Gadget Item',
              category: p.category || 'Phones',
              brand: p.brand || 'Generic',
              condition: p.condition || 'New',
              conditionLabel: p.conditionLabel || (p.condition === 'New' ? 'BRAND NEW' : 'USED - MINT'),
              price: priceNum,
              priceLabel: p.priceLabel || `₦${priceNum.toLocaleString()}`,
              specs: p.specs || 'Various Specs, Unlocked',
              images: p.image ? [p.image] : [],
              stock: 5, // Default stock of 5 units
              createdAt: new Date().toISOString()
            };
            return addDoc(collection(db, 'products'), docData);
          });
          await Promise.all(promises);
          console.log("Successfully seeded Firestore database!");
        } catch (err) {
          console.error("Error seeding Firestore database:", err);
        }
        setSeeding(false);
      }

      const productsDataFromDb = snapshot.docs.map(doc => {
        const data = doc.data();
        const images = data.images || (data.image ? [data.image] : []);
        const priceNum = parseFloat(data.price) || 0;
        
        // Normalize properties so legacy screens and new admin dashboard work smoothly
        return {
          id: doc.id,
          ...data,
          price: priceNum,
          images: images,
          image: images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500', // Premium default placeholder
          priceLabel: data.priceLabel || `₦${priceNum.toLocaleString()}`,
          conditionLabel: data.conditionLabel || (data.condition === 'New' ? 'BRAND NEW' : (data.condition === 'Used' ? 'USED - MINT' : 'REFURBISHED')),
          stock: data.stock !== undefined ? parseInt(data.stock) : 5,
          category: data.category || 'Phones',
          brand: data.brand || 'Generic'
        };
      });

      setProducts(productsDataFromDb);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [seeding]);

  // Subscribe to Services
  useEffect(() => {
    if (!isFirebaseActive()) {
      setServices([
        { id: '1', name: 'Screen Replacement', description: 'OLED / LCD Repairs', price: '₦45,000' },
        { id: '2', name: 'Battery Replacement', description: 'Original High Capacity', price: '₦15,000' }
      ]);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesData);
    });

    return () => unsubscribe();
  }, []);

  // Cart Operations
  const addToCart = (product) => {
    if (product.stock !== undefined && product.stock <= 0) {
      alert("This product is currently out of stock!");
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        const newQty = existingItem.quantity + 1;
        if (product.stock !== undefined && newQty > product.stock) {
          alert(`Only ${product.stock} units of this item are available in stock.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          if (item.product.stock !== undefined && quantity > item.product.stock) {
            alert(`Only ${item.product.stock} units of this item are available in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addProduct = async (product) => {
    if (!isFirebaseActive()) {
      const newProduct = {
        ...product,
        id: `mock-prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        images: product.images || [],
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500',
        stock: product.stock !== undefined ? parseInt(product.stock) : 5,
        category: product.category || 'Phones',
        brand: product.brand || 'Generic'
      };
      const list = JSON.parse(localStorage.getItem('mock_products') || '[]');
      const updatedList = [newProduct, ...list];
      localStorage.setItem('mock_products', JSON.stringify(updatedList));
      setProducts(updatedList);
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    if (!isFirebaseActive()) {
      const list = JSON.parse(localStorage.getItem('mock_products') || '[]');
      const updatedList = list.map(p => {
        if (p.id === id) {
          const priceNum = parseFloat(updatedProduct.price) || 0;
          const images = updatedProduct.images || [];
          return {
            ...p,
            ...updatedProduct,
            price: priceNum,
            images: images,
            image: images[0] || p.image,
            priceLabel: `₦${priceNum.toLocaleString()}`,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      localStorage.setItem('mock_products', JSON.stringify(updatedList));
      setProducts(updatedList);
      return;
    }

    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updatedProduct,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    if (!isFirebaseActive()) {
      const list = JSON.parse(localStorage.getItem('mock_products') || '[]');
      const updatedList = list.filter(p => p.id !== id);
      localStorage.setItem('mock_products', JSON.stringify(updatedList));
      setProducts(updatedList);
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  const updateService = async (id, updatedService) => {
    if (!isFirebaseActive()) return;
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, updatedService);
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  };

  const addService = async (service) => {
    if (!isFirebaseActive()) return;
    try {
      await addDoc(collection(db, 'services'), service);
    } catch (error) {
      console.error("Error adding service:", error);
      throw error;
    }
  };

  return (
    <StoreContext.Provider value={{ 
      products, 
      services, 
      loading,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      addProduct, 
      updateProduct, 
      deleteProduct,
      updateService,
      addService
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);


