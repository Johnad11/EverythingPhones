import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const navLinks = [
    { name: 'Shop', path: '/shop', icon: 'shopping_bag' },
    { name: 'Accessories', path: '/accessories', icon: 'headset' },
    { name: 'Swap', path: '/swap', icon: 'swap_horiz' },
    { name: 'Repairs', path: '/repairs', icon: 'build' },
    { name: 'Gaming', path: '/gaming', icon: 'sports_esports' },
  ];

  const adminLinks = [
    { name: 'Admin', path: '/admin', icon: 'admin_panel_settings' },
  ];

  return (
    <nav className="bg-black/80 backdrop-blur-xl fixed top-0 w-full border-b border-white/10 z-50 shadow-[0_8px_32px_rgba(157,78,221,0.15)]">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-[1440px] mx-auto font-headline tracking-tight">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-white uppercase">
          Everything Phones
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`${location.pathname === link.path ? 'text-purple-400 border-b-2 border-purple-500 pb-1 font-bold' : 'text-gray-400 hover:text-white'} transition-all duration-300 ease-in-out hover:scale-105`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && adminLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`${location.pathname === link.path ? 'text-purple-400 border-b-2 border-purple-500 pb-1 font-bold' : 'text-gray-400 hover:text-white'} transition-all duration-300 ease-in-out hover:scale-105`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-white/10 focus-within:border-purple-500/50 transition-all">
            <span className="material-symbols-outlined text-purple-400 text-sm">search</span>
            <input 
              className="bg-transparent border-none text-sm focus:ring-0 text-white placeholder:text-gray-500 w-40 ml-2" 
              placeholder="Search devices..." 
              type="text" 
            />
          </div>
          
          <div className="flex items-center space-x-4 relative">
            <Link to="/cart" className="relative material-symbols-outlined text-purple-400 hover:text-purple-300 transition-all flex items-center p-2 rounded-full hover:bg-white/5">
              shopping_cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-headline text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-black shadow-glow animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-glow-sm">
                    {isAdmin ? 'AD' : 'UN'}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:block">
                    {isAdmin ? 'Admin' : 'Member'}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] shadow-2xl">
                  <div className="p-4 border-b border-white/5">
                    <p className="text-xs font-bold text-white truncate">{user.email}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">{isAdmin ? 'Admin' : 'Standard'} Account</p>
                  </div>
                  <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 hover:bg-white/5 text-xs text-gray-300 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-sm">dashboard</span>
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-500/10 text-xs text-red-400 hover:text-red-300 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="material-symbols-outlined text-purple-400 hover:text-purple-300 transition-all p-2 rounded-full hover:bg-white/5">
                person
              </Link>
            )}

            {/* Services Dropdown Button */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`material-symbols-outlined text-purple-400 hover:text-purple-300 transition-all p-2 rounded-full hover:bg-white/5 ${isMenuOpen ? 'bg-white/10 rotate-180' : ''}`}
              >
                apps
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(157,78,221,0.3)] animate-in fade-in zoom-in duration-200 z-[60]">
                  <div className="p-4 bg-gradient-to-br from-purple-900/20 to-transparent">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-4 px-2">Quick Access</p>
                    <div className="grid grid-cols-1 gap-1">
                      {[...navLinks, ...(isAdmin ? adminLinks : [])].map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all group"
                        >
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-purple-400 transition-colors">
                            {link.icon}
                          </span>
                          <span className="text-sm text-gray-300 group-hover:text-white font-medium">
                            {link.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border-t border-white/5 bg-white/5 font-headline">
                    <div className="flex items-center justify-between px-2">
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Our Services</span>
                       <span className="w-1 h-1 rounded-full bg-purple-500 shadow-glow animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
