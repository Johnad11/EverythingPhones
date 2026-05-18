const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center -mt-20">
      <div className="glass-card p-12 rounded-[48px] w-full max-w-md border-primary/30 shadow-glow-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Join the <span className="text-primary">Elite</span></h1>
          <p className="text-gray-500">Create your Everything Phones account</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Full Name</label>
            <input type="text" placeholder="John Doe" className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address</label>
            <input type="email" placeholder="name@example.com" className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-surface-container border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all" />
          </div>
          <button className="btn-primary w-full py-5 text-sm">Create Account</button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-primary hover:underline font-bold">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
