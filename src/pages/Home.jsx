import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover opacity-30" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuALlc_CfZQwq0TvPQRcTb9iUq4-6ambkTrCg5QB_kKxPaP_TQ3VmeV77UJEcYVvX4McYhjY4X63tZRM7PrGvAc9hnlcWXNJQnQOCtleeN90BMT1wSXw5lRofQV4fKhydKPWvtEivbLGPvIe9zJl6V3JZP7ceKsYqj9chl5KTmHntYX8VG0w1hrlFdHPH1ud51-TiG5zubGyZ1ksPA1rBFKHype_aN3tbwQt6AvfmG5FkCG1Uh5oSu7_cldEtlbS8ag2QYACX23DXV-9" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary-container/20 border border-primary-container text-primary font-bold tracking-widest text-xs uppercase">
              PREMIUM TECH HUB ABUJA
            </span>
            <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight">
              Elite Gadgets. <br/>
              <span className="text-primary glow-sm">Expert Care.</span>
            </h1>
            <p className="font-body text-xl text-gray-400 max-w-lg">
              Discover the latest iPhone 15 Pro and Samsung S24 Ultra. Experience elite mobile technology with Nigeria's most trusted gadget partner.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="btn-primary">Browse Latest Arrivals</button>
              <button className="btn-outline">Swap Your Phone</button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="absolute -inset-10 bg-primary-container/20 blur-[100px] rounded-full"></div>
            <img 
              className="relative z-10 w-full max-w-md mx-auto drop-shadow-[0_20px_50px_rgba(157,78,221,0.3)]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsbpSzN7L_MX-nRcxg_mBqidR25gFxeuDsy1uptKsTahNzdao0fr9vdQnIezEe__AOpBnlXC7daeU2HCbltRaNTn-tziVLFOfWsOmyIvKsUNzMPsmA2Cj3LO945yX2cvARlsIC3lmRFK6oLE-ZaqgCffldboUmInwWir6bC3E42FxsXrS3SO-H4fEt_0tkl5N_-s3El3gv6pqbb18-1o4OYBsu7VKT0DyjK6epFcIGhCPPqf_bTsig0JhlDSjHxzbZzktG4N_SwVxy" 
              alt="Elite Phones"
            />
          </motion.div>
        </div>
      </section>

      {/* Abuja Phone Swaps */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-headline text-4xl font-bold text-white">Abuja Phone Swaps</h2>
            <p className="font-body text-gray-400">Upgrade your lifestyle instantly with our seamless trade-in program.</p>
          </div>
          <a className="text-primary font-bold flex items-center gap-2 hover:underline tracking-widest text-sm uppercase" href="#">
            VIEW ALL DEALS <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 glass-card rounded-3xl p-10 relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10">
              <h3 className="font-headline text-3xl font-bold mb-2 text-primary">Instant Valuation</h3>
              <p className="font-body text-gray-400 max-w-xs">Get the best market price for your old device in under 10 minutes at our Abuja headquarters.</p>
            </div>
            <div className="mt-12 flex gap-3">
              <span className="bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">High Payouts</span>
              <span className="bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">Physical Inspection</span>
            </div>
            <img 
              className="absolute -right-10 -bottom-10 w-80 opacity-30 group-hover:scale-110 transition-transform duration-700 grayscale hover:grayscale-0" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKyWiB7CQG8XiJUb7XZYPkjlEVPOeQer4N9-5OhlzbKbTBHzJIJ4grb_w1F0KQF3vD8mLCKl_ySdlK3Gdy-ufM8W5dYlPuURvMakvA4EMiXCGa8ijeApyXcOWJbVxytKCx6D8RSEV34vIPEpv6tS2hiRwu24tZXXdwStcE4BBwh0k3CjYFEiDs3gay5zZc6D3NRcanYx-V6CwCf0Sul3MPSdnTbDnSKj11ZlMN4OfUBbI4FVU89XCgb8ewXFvQ_3lhb3tRKgYtH3Je" 
              alt="Valuation"
            />
          </div>

          <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-surface-container-high transition-colors">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-all shadow-glow">
              <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
            </div>
            <h3 className="font-headline text-lg font-bold mb-2 text-white">Pre-Owned Elite</h3>
            <p className="font-body text-sm text-gray-400">Certified pre-owned devices with 6 months warranty.</p>
          </div>

          <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-surface-container-high transition-colors">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-all shadow-glow">
              <span className="material-symbols-outlined text-primary text-3xl">sync</span>
            </div>
            <h3 className="font-headline text-lg font-bold mb-2 text-white">Zero Downtime</h3>
            <p className="font-body text-sm text-gray-400">Data migration service included with every swap.</p>
          </div>
        </div>
      </section>

      {/* Gaming Zone */}
      <section className="py-24 bg-surface-container-low border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Gamer's Haven</span>
              <h2 className="font-headline text-5xl font-bold text-white leading-tight">Gaming Zone</h2>
              <p className="font-body text-lg text-gray-400">Level up your setup with PlayStation 5, PS4 Pro, and the latest titles. From Abuja's #1 gaming destination.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border border-primary/20 rounded-2xl bg-surface-container">
                  <span className="font-headline text-3xl font-bold text-primary block">PS5</span>
                  <span className="text-xs text-gray-500 font-bold uppercase">In Stock</span>
                </div>
                <div className="p-6 border border-primary/20 rounded-2xl bg-surface-container">
                  <span className="font-headline text-3xl font-bold text-primary block">PS4</span>
                  <span className="text-xs text-gray-500 font-bold uppercase">Ready to Ship</span>
                </div>
              </div>
              <button className="w-full py-5 bg-tertiary-container text-white font-bold rounded-xl hover:shadow-[0_0_25px_rgba(60,9,108,0.5)] transition-all uppercase tracking-widest">
                Enter the Zone
              </button>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              <div className="rounded-3xl overflow-hidden h-[400px] relative border border-white/10 group">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5H4Q_Zoz8XpwwOv4O1deafPkJQ_pHqvSEtSS87Tk4mWwybnpCzuiSH3lmEGuDKV9ZADuzEir0hpfUx0zjvISb_8Iz2UjFpCwPfyx-TDbcomNSBNoM4V-E4W0gTlEUyNl1fuYQ0HwkhBduf9R9rM9CG0F1PGMBJb7VdzuFqpeqMWuu4aSsE7lkKsMNHdw5sLi7Qoozw5EbjPQrXalRSRxY-eZ5y-szfczUbLlV92NR2aOnqN2XKwmtAYIAobrSp9NaJg75Yk97AOSb" 
                  alt="PS5"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold text-white uppercase tracking-wider">PS5 Console</span>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden h-[400px] relative mt-12 border border-white/10 group">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK_v4QaRiN45QTcJCOGUwCUkzpEsQvuw5NkwJuZCcUmSQr1tgjbaD15g9B3aBL0MzawUPvEtjltZ_Jyzye4Qe8arj0ZWbRo7sZlbBU8k_otgHCR7mur3u1hNzMLGHrMEHe9ctjlOH2mDQYdY1wUlilSuqbT9Ww2wqWWOuqDN6zk-ooLP2Dm1FDZ7Fj0idsodmlG43hSS0ZQ6QiCQDAWZWl4TiIieW2XDsXkfO7PaQvwL4x6FHAGN0VW-BXbxHs30iGU9aEnyo0oXdT" 
                  alt="Accessories"
                />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold text-white uppercase tracking-wider">Accessories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repair Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="glass-card rounded-[48px] p-12 md:p-20 relative overflow-hidden border-primary/30">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-headline text-5xl md:text-6xl font-bold mb-8 text-white">Repair Your Tech</h2>
            <p className="font-body text-xl text-gray-400 mb-10">Smashed screen? Battery draining fast? Our certified engineers use genuine parts to bring your device back to life.</p>
            <ul className="space-y-6 mb-12">
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">bolt</span>
                <span className="font-body text-lg font-semibold text-primary/80">1-Hour Express Repairs</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                <span className="font-body text-lg font-semibold text-primary/80">90-Day Service Warranty</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">hardware</span>
                <span className="font-body text-lg font-semibold text-primary/80">Genuine OEM Parts Only</span>
              </li>
            </ul>
            <button className="px-12 py-6 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-2xl uppercase tracking-widest">
              Book Repair Appointment
            </button>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/3 hidden lg:block">
            <div className="w-full h-full bg-primary/5 flex items-center justify-center border-l border-white/5">
              <span className="material-symbols-outlined text-[300px] text-primary/5 rotate-12">build</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
