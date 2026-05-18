const Footer = () => {
  return (
    <footer className="bg-black w-full pt-20 pb-10 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 max-w-[1440px] mx-auto font-headline text-sm uppercase tracking-widest">
        <div className="space-y-6">
          <div className="text-lg font-black text-primary-container">Everything Phones</div>
          <p className="text-gray-500 font-body normal-case tracking-normal">
            The ultimate tech ecosystem in Nigeria. Buy, Swap, Repair, and Game with confidence.
          </p>
          <div className="flex space-x-6">
            <a className="text-gray-500 hover:text-primary transition-all" href="#">
              <span className="material-symbols-outlined">social_leaderboard</span>
            </a>
            <a className="text-gray-500 hover:text-primary transition-all" href="#">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold">Quick Links</h4>
          <nav className="flex flex-col space-y-3 font-body normal-case tracking-normal">
            <a className="text-gray-500 hover:text-primary transition-all" href="#">Shop Gadgets</a>
            <a className="text-gray-500 hover:text-primary transition-all" href="#">Swap Values</a>
            <a className="text-gray-500 hover:text-primary transition-all" href="#">Track Repair</a>
            <a className="text-gray-500 hover:text-primary transition-all" href="#">Gaming Library</a>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold">Company</h4>
          <nav className="flex flex-col space-y-3 font-body normal-case tracking-normal">
            <a className="text-gray-500 hover:text-primary transition-all" href="#">About Us</a>
            <a className="text-gray-500 hover:text-primary transition-all" href="#">Contact</a>
            <a className="text-gray-500 hover:text-primary transition-all" href="#">Privacy Policy</a>
            <a className="text-gray-500 hover:text-primary transition-all" href="#">FAQ</a>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-bold">Newsletter</h4>
          <p className="text-gray-500 normal-case tracking-normal">Get drop alerts for latest tech.</p>
          <form className="flex gap-2">
            <input 
              className="bg-surface-container border-none rounded-lg text-sm focus:ring-1 focus:ring-primary w-full text-white placeholder:text-gray-600" 
              placeholder="EMAIL" 
              type="email" 
            />
            <button className="bg-primary-container px-4 py-2 rounded-lg text-white hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-12 mt-16 flex flex-col items-center gap-4 text-center">
        <div className="text-primary-container font-bold text-xl tracking-[0.2em] uppercase italic glow-sm">
          Your Phone, Your Trust, Our Commitment
        </div>
        <div className="text-gray-600 text-xs mt-4">
          © 2024 Everything Phones. Your Phone, Your Trust, Our Commitment.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
