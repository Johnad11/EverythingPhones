import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@everythingphones.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call Firebase Login
      await login(email, password);
      
      // Wait a moment for auth listener to sync isAdmin flag
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center -mt-10 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-10 rounded-[48px] w-full max-w-md border-primary/30 shadow-glow-lg bg-black/60 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-10 relative">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            Control Room
          </span>
          <h1 className="text-4xl font-bold mt-6 mb-2">Owner <span className="text-primary glow-sm">Portal</span></h1>
          <p className="text-gray-500 text-sm">Everything Phones administration</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl flex gap-3 items-center"
          >
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@everythingphones.com" 
              className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all text-white placeholder:text-gray-600 text-sm" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all text-white placeholder:text-gray-600 text-sm" 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-black rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-glow flex items-center justify-center gap-2 mt-8 disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Securing Connection...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">vpn_key</span>
                <span>Enter Control Room</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-3xl text-center text-xs text-gray-500 relative">
          <p className="font-bold text-gray-400 mb-1">Administrative Credentials</p>
          <p className="font-mono text-[10px]">Email: admin@everythingphones.com</p>
          <p className="font-mono text-[10px]">Password: password</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
