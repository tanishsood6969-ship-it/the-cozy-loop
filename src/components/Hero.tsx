import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Heart, Truck, Star, Flower2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveModal, setSelectedCategory } = useStore();

  return (
    <div className="relative overflow-hidden yarn-gradient-hero border-b-2 border-rose-200 py-12 sm:py-20 px-4 sm:px-8">
      
      {/* Animated Floating Wool & Yarn Ball Graphics */}
      <div className="absolute top-6 left-8 text-rose-300 opacity-60 text-5xl sm:text-6xl animate-float-wool pointer-events-none">
        🧶
      </div>
      <div className="absolute bottom-6 right-12 text-amber-400 opacity-60 text-6xl sm:text-7xl animate-float-wool pointer-events-none" style={{ animationDelay: '1.8s' }}>
        🌻
      </div>
      <div className="absolute top-12 right-1/4 text-pink-300 opacity-40 text-4xl animate-float-wool pointer-events-none" style={{ animationDelay: '3s' }}>
        🧵
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Vibrant Headline & CTA */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 bg-[var(--surface)]/95 backdrop-blur-md border-2 border-rose-300 rounded-full px-4 py-1.5 shadow-md">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-black text-rose-700 tracking-wider uppercase">
              🧶 100% Handcrafted Wool & Milk Cotton Studio
            </span>
          </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] leading-none tracking-tight">
            Hand-Knitted Flowers <br />
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
              That Bloom Forever 💕
            </span>
          </h2>

         <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
            Brighten your dorm desk, gift your best friends, or order a custom bouquet! Every tulip stem, plush frog keychain, and daisy bag is individually crocheted by hand using soft milk cotton & wool yarn.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => setSelectedCategory('Bouquets')}
              className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:to-pink-700 text-white font-black px-7 py-4 rounded-2xl shadow-xl shadow-rose-200 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base flex items-center gap-2.5"
            >
              <Flower2 className="w-5 h-5" />
              <span>Explore Bouquets & Stems</span>
            </button>

            <button
              onClick={() => setActiveModal('customOrder')}
              className="bg-[var(--surface)] hover:bg-stone-50 text-[var(--text-primary)] font-extrabold px-6 py-4 rounded-2xl border-2 border-amber-300 shadow-md transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Request Custom Design</span>
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t-2 border-rose-200/80 max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 shadow-xs">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div className="text-left">
               <div className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)]">
  Soft Wool Yarn
</div>
<div className="text-[11px] text-[var(--text-secondary)] font-semibold">
  100% Premium Cotton
</div>
</div>
</div>

<div className="flex items-center gap-2.5">
  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0 shadow-xs">
    <Truck className="w-5 h-5" />
  </div>
  <div className="text-left">
    <div className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)]">
      Dorm Drop
    </div>
    <div className="text-[11px] text-[var(--text-secondary)] font-semibold">
      Fast Campus Pickup
    </div>
  </div>
</div>

<div className="flex items-center gap-2.5">
  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 shadow-xs">
    <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
  </div>
  <div className="text-left">
    <div className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)]">
      5.0 Star Rating
    </div>
    <div className="text-[11px] text-[var(--text-secondary)] font-semibold">
      Verified Students
    </div>
  </div>
</div>
</div>
        </div>

        {/* Right Column: Hero Visual Card with Yarn Border */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-sm">
            
            {/* Featured Bouquet Card */}
            <div className="glass-card rounded-3xl p-4 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300 border-2 border-rose-300">
              <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-3">
                <img 
                  src="https://imgs.search.brave.com/49PPffm7k_l1g1i5UBvIj-nVC4kL-m8YnunmNJvkrYM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzY3MDcxODM1L3Iv/aWwvNWMwOTkxLzg0/MjQ0NzU3MjEvaWxf/MzAweDMwMC44NDI0/NDc1NzIxX2x6aHMu/anBn" 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                 <h3 className="font-extrabold text-[var(--text-primary)] dark:text-white text-base">Grand Sunflower Bouquet</h3>
                  <p className="text-xs text-[var(--text-secondary)] font-semibold">Includes rustic kraft wrap & gift note</p>
                </div>
              </div>
            </div>

            {/* Floating Mini Craft Badge Card */}
            <div className="absolute -bottom-5 -left-5 glass-panel rounded-2xl p-3 shadow-xl border-2 border-amber-300 flex items-center gap-3 animate-float-wool">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner">
                🌸
              </div>
              <div>
                <div className="hero-theme-text text-xs font-black text-[var(--text-primary)]">Custom Colors Available</div>
                <div className="hero-text-mute text-xs [var(--text-secondary)]">Pick your favorite yarn shades!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
