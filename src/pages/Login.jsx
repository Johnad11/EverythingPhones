import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e, role) => {
    e.preventDefault();
    login(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-20">
      <div className="glass-card p-12 rounded-[48px] w-full max-w-md border-primary/30 shadow-glow-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome <span className="text-primary">Back</span></h1>
          <p className="text-gray-500">Access your elite tech dashboard</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label>
            <input type="email" placeholder="name@example.com" defaultValue="admin@everythingphones.com" className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Password</label>
            <input type="password" placeholder="••••••••" defaultValue="password" className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={(e) => handleLogin(e, 'user')}
              className="btn-secondary py-4 text-xs font-bold"
            >
              Login as User
            </button>
            <button 
              onClick={(e) => handleLogin(e, 'owner')}
              className="btn-primary py-4 text-xs font-bold"
            >
              Login as Owner
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-4">Demo: Use "Owner" to see management tools</p>
          Don't have an account? <a href="#" className="text-primary hover:underline font-bold">Create one</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
