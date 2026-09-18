import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Search, Sparkles, Flower2, PackageCheck, User, LogOut } from 'lucide-react';
import type { ProductCategory } from '../types';

export const Navbar: React.FC = () => {
  const { 
    cart, 
    setCartOpen, 
    settings, 
    currentUser,
    logoutUser,
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setActiveModal
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories: ProductCategory[] = [
    'All',
    'Flower Stems',
    'Bouquets',
    'Keychains',
    'Handbags & Pouches',
    'Plushies & Amigurumi',
    'Wearables & Hair'
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Announcement Ticker Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 text-white text-xs sm:text-sm font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>{settings.announcementText}</span>
        <span className="hidden md:inline-block bg-white/20 px-2.5 py-0.5 rounded-full text-xs ml-2">
          📍 {settings.universityName}
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="glass-nav px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedCategory('All')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
            <Flower2 className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent leading-none">
              {settings.storeName}
            </h1>
            <p className="text-xs text-stone-500 hidden sm:block mt-0.5 font-semibold">
              🧶 {settings.tagline}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 text-stone-400" />
          <input 
            type="text"
            placeholder="Search tulips, keychains, frog plushies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-100/90 hover:bg-stone-100 focus:bg-white border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 rounded-full pl-10 pr-4 py-2 text-xs font-semibold transition-all outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-stone-400 hover:text-stone-600 bg-stone-200 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Student Auth Profile Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-full border border-stone-200">
              <button
                onClick={() => setActiveModal('userOrders')}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:text-rose-600 px-2.5 py-1 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden lg:inline">{currentUser.name}</span>
              </button>
              <button 
                onClick={logoutUser} 
                className="text-stone-400 hover:text-rose-600 p-1 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveModal('auth')}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 border border-stone-200 rounded-full px-3 py-2 transition-all"
            >
              <User className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Order Tracker Link */}
          <button
            onClick={() => setActiveModal('orderTracker')}
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 border border-stone-200 rounded-full px-3 py-2 transition-all"
            title="Track my campus order"
          >
            <PackageCheck className="w-4 h-4 text-amber-500" />
            <span>Track Order</span>
          </button>

          {/* Custom Order CTA */}
          <button
            onClick={() => setActiveModal('customOrder')}
            className="flex items-center gap-1.5 text-xs font-extrabold text-rose-700 bg-rose-100/90 hover:bg-rose-200 border border-rose-200 rounded-full px-3.5 py-2 transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Custom Request</span>
            <span className="sm:hidden">Custom</span>
          </button>

          {/* Shopping Cart Drawer */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full p-2.5 sm:px-4 sm:py-2 flex items-center gap-2 shadow-md shadow-rose-200 transition-all active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-black">Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-amber-400 text-stone-900 font-black text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-2 bg-stone-50 border-b border-stone-200">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input 
            type="text"
            placeholder="Search tulips, keychains, frog plushies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 focus:border-rose-400 rounded-full pl-9 pr-4 py-1.5 text-xs outline-none"
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="bg-white/90 border-b border-stone-200/80 px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider hidden sm:inline mr-2 flex-shrink-0">
          Categories:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-sm scale-105'
                : 'bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
};
