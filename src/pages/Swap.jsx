const Swap = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h1 className="text-5xl font-bold text-primary mb-8">Swap & Trade-In</h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
        Get the best value for your old device. Upgrade to the latest tech instantly at our Abuja headquarters.
      </p>
      <div className="glass-card p-12 rounded-[48px] max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Valuation Portal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Device Brand</label>
            <select className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none">
              <option>Apple iPhone</option>
              <option>Samsung</option>
              <option>Google Pixel</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Model</label>
            <input type="text" className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="e.g. iPhone 13 Pro" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Condition</label>
            <select className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none">
              <option>Mint (No scratches)</option>
              <option>Good (Minor wear)</option>
              <option>Cracked Screen</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Storage</label>
            <select className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none">
              <option>128GB</option>
              <option>256GB</option>
              <option>512GB</option>
              <option>1TB</option>
            </select>
          </div>
        </div>
        <button className="btn-primary w-full mt-12">Get Instant Valuation</button>
      </div>
    </div>
  );
};

export default Swap;
