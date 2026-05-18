import { useStore } from '../context/StoreContext';

const Repairs = () => {
  const { services } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="text-6xl font-bold mb-8">Expert <span className="text-primary">Repairs</span></h1>
          <p className="text-xl text-gray-400 mb-12">
            Nigeria's most trusted repair center. We fix iPhones, iWatches, Samsungs, and laptops with genuine OEM parts.
          </p>
          <div className="space-y-8">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-6 p-6 glass-card rounded-2xl hover:border-primary/50 transition-all">
                <span className="material-symbols-outlined text-primary text-4xl">{service.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-sm text-gray-500">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-12 rounded-[48px] border-primary/30">
          <h2 className="text-3xl font-bold mb-8">Book a Repair</h2>
          <form className="space-y-6">
            <input type="text" placeholder="Full Name" className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-4 focus:border-primary outline-none" />
            <input type="email" placeholder="Email Address" className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-4 focus:border-primary outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Device Model" className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-4 focus:border-primary outline-none" />
              <select className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-4 focus:border-primary outline-none">
                <option>Screen Issue</option>
                <option>Battery Issue</option>
                <option>Charging Port</option>
                <option>Other</option>
              </select>
            </div>
            <textarea placeholder="Describe the problem..." rows="4" className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-4 focus:border-primary outline-none"></textarea>
            <button className="btn-primary w-full py-5">Schedule Now</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Repairs;
