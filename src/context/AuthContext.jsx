import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

// THE SOLE STORE OWNER EMAIL
const OWNER_EMAIL = "admin@everythingphones.com"; 

// Helper to check if Firebase is configured with active keys
const isFirebaseActive = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== "YOUR_API_KEY" && apiKey !== "";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isFirebaseActive()) {
      // --- DEMO MODE ACTIVE ---
      console.log("Firebase is not fully configured. Running Authentication in Local Demo Mode.");
      try {
        const savedUser = localStorage.getItem('mock_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.email === OWNER_EMAIL);
        }
      } catch (err) {
        console.error("Error loading mock user:", err);
      }
      setLoading(false);
      return;
    }

    // --- REAL FIREBASE AUTH ACTIVE ---
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setIsAdmin(currentUser.email === OWNER_EMAIL);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!isFirebaseActive()) {
      // Mock validation
      if (email === OWNER_EMAIL && password === "password") {
        const mockUserObj = { email: OWNER_EMAIL, uid: 'mock-admin-uid', displayName: 'Store Owner' };
        setUser(mockUserObj);
        setIsAdmin(true);
        localStorage.setItem('mock_user', JSON.stringify(mockUserObj));
        return mockUserObj;
      } else {
        throw new Error("Invalid administrative credentials. Use the demo accounts specified below.");
      }
    }

    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    if (!isFirebaseActive()) {
      const mockUserObj = { email, uid: `mock-${Date.now()}` };
      setUser(mockUserObj);
      setIsAdmin(email === OWNER_EMAIL);
      localStorage.setItem('mock_user', JSON.stringify(mockUserObj));
      return mockUserObj;
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseActive()) {
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('mock_user');
      return;
    }
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


