const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">Account <span className="text-primary">Dashboard</span></h1>
        <button className="text-gray-500 hover:text-white transition-colors">Sign Out</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-[32px]">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">User Profile</h3>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">JD</div>
            <div>
              <div className="font-bold text-xl">John Doe</div>
              <div className="text-sm text-gray-500">Premium Member</div>
            </div>
          </div>
          <button className="w-full py-3 border border-white/10 rounded-xl text-sm hover:border-primary transition-all">Edit Profile</button>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-[32px]">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Recent Orders</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <div className="font-bold">#ORD-9921</div>
                  <div className="text-xs text-gray-500">iPhone 15 Pro Max</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₦1,405,000</div>
                  <div className="text-xs text-green-400 font-bold uppercase tracking-widest">Delivered</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-[32px]">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Active Repairs</h3>
              <p className="text-gray-500 text-sm">No active repairs. Need a fix?</p>
              <button className="text-primary text-sm font-bold mt-4 hover:underline">Book a Repair →</button>
            </div>
            <div className="glass-card p-8 rounded-[32px]">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Trade-in Credits</h3>
              <div className="text-3xl font-bold text-primary">₦0.00</div>
              <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Swap your old phone for credit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
