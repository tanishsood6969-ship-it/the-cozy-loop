import React from 'react';
import { useStore } from '../context/StoreContext';
import { Flower2, Sparkles, PackageCheck, MapPin, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setSelectedCategory, setActiveModal } = useStore();

  const handleOwnerAdminPortalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = 'admin';
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 px-4 sm:px-8 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
        
        {/* Brand & Story */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-white font-bold text-xl shadow-md">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">{settings.storeName}</h3>
              <p className="text-xs text-rose-400 font-semibold">{settings.universityName}</p>
            </div>
          </div>

          <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
            A small-scale student crochet studio delivering 100% handcrafted eternal flowers, plushies, keychains, and custom gifts. Made with premium milk cotton yarn that never wilts!
          </p>

          <div className="flex items-center gap-2 text-xs text-amber-400 bg-stone-800/80 px-3 py-1.5 rounded-full w-fit border border-stone-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hand-knitted with love on campus 💕</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Quick Shop</h4>
          <ul className="space-y-2 text-xs font-medium text-stone-400">
            <li>
              <button onClick={() => setSelectedCategory('Bouquets')} className="hover:text-rose-400 transition-colors">
                🌸 Flower Bouquets
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedCategory('Flower Stems')} className="hover:text-rose-400 transition-colors">
                🌷 Eternal Tulip Stems
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedCategory('Keychains')} className="hover:text-rose-400 transition-colors">
                🐸 Frog & Plush Keychains
              </button>
            </li>
            <li>
              <button onClick={() => setSelectedCategory('Handbags & Pouches')} className="hover:text-rose-400 transition-colors">
                👜 Daisy Crochet Tote Bags
              </button>
            </li>
            <li>
              <button onClick={() => setActiveModal('customOrder')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <span>✨ Submit Custom Request</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Campus Pickup Info & Order Lookup */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Campus Delivery & Pickup</h4>
          <div className="space-y-2 text-xs text-stone-400">
            <div className="flex items-start gap-2 bg-stone-800/60 p-3 rounded-2xl border border-stone-800">
              <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Default Pickup Spot:</span>
                <span>{settings.pickupLocation}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('orderTracker')}
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold py-2.5 px-3 rounded-xl border border-stone-700 flex items-center justify-center gap-2 transition-colors"
            >
              <PackageCheck className="w-4 h-4 text-rose-400" />
              <span>Lookup Your Campus Order Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Subtle Owner Link */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <div>
          © {new Date().getFullYear()} {settings.storeName}. Handcrafted for university students.
        </div>

        {/* Secret Owner Portal Link */}
        <a
          href="#admin"
          onClick={handleOwnerAdminPortalClick}
          className="text-stone-600 hover:text-stone-400 transition-colors text-[11px] flex items-center gap-1 font-semibold opacity-70 hover:opacity-100"
          title="Owner Admin Login Page"
        >
          <Lock className="w-3 h-3 text-stone-500" />
          <span>Store Owner Portal</span>
        </a>
      </div>
    </footer>
  );
};
