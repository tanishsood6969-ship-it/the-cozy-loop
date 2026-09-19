import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Search,
  Sparkles,
  PackageCheck,
  User,
  LogOut,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import type { ProductCategory } from '../types';
import { YarnTitleAnimation } from './YarnTitleAnimation';

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
    setActiveModal,
    isDarkMode,
    toggleDarkMode,
  } = useStore();

  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const categories: ProductCategory[] = [
    'All',
    'Flower Stems',
    'Bouquets',
    'Keychains',
    'Handbags & Pouches',
    'Plushies & Amigurumi',
    'Wearables & Hair',
  ];

  return (
    <header
      className="
        crochet-navbar
        sticky
        top-0
        z-40
        w-full
        text-stone-900
        dark:text-stone-100
        shadow-sm
        transition-all
        relative
        overflow-hidden
      "
    >
      {/* Decorative Craft Background Accents across Navbar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <span className="absolute left-6 top-2 text-sm opacity-25 animate-float-wool">🧶</span>
        <span className="absolute right-12 top-2 text-sm opacity-25 animate-float-wool" style={{ animationDelay: '1.2s' }}>🧵</span>
        <span className="absolute left-1/4 bottom-2 text-xs opacity-20 animate-float-wool" style={{ animationDelay: '2.4s' }}>🪡</span>
        <span className="absolute right-1/4 top-3 text-xs opacity-20 animate-float-wool" style={{ animationDelay: '3.1s' }}>🌸</span>
        <span className="absolute left-1/3 top-1 text-[10px] opacity-20 animate-pulse" style={{ animationDelay: '0.8s' }}>✨</span>
        <span className="absolute right-1/3 bottom-1 text-[10px] opacity-20 animate-pulse" style={{ animationDelay: '1.8s' }}>✨</span>
      </div>

      {/* =====================================================
          SECTION 1 — ANNOUNCEMENT BAR
      ====================================================== */}
      <div className="relative z-10 bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 text-white text-[11px] font-bold py-1.5 px-4 flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />

        <span className="text-white">
          {settings.announcementText}
        </span>

        <span
          className="
            hidden md:inline-block
            bg-white/20
            text-white
            px-2
            py-0.5
            rounded-full
            text-[10px]
            ml-2
          "
        >
          📍 {settings.universityName}
        </span>
      </div>

      {/* =====================================================
          SECTION 2 — ANIMATED TITLE / LOGO WITH WAVY ANIMATION
      ====================================================== */}
      <div
        className="
          py-2.5
          px-4
          flex
          items-center
          justify-center
          border-b
          border-stone-200/50
          dark:border-stone-800/60
          bg-white/35
          dark:bg-stone-950/35
          backdrop-blur-2xl
          relative
          z-10
          overflow-visible
        "
      >
        <YarnTitleAnimation
          storeName={settings.storeName}
          tagline={settings.tagline}
          onCategoryReset={() => setSelectedCategory('All')}
        />
      </div>

      {/* =====================================================
          SECTION 3 — CATEGORIES LEFT / ACTIONS RIGHT
      ====================================================== */}
      <div
        className="
          relative
          z-10
          w-full
          px-4
          sm:px-6
          lg:px-8
          py-2
          bg-[#fffaf5]/90
          dark:bg-stone-950/90
          backdrop-blur-md
          border-t
          border-stone-200/60
          dark:border-stone-800/60
        "
      >
        <div
          className="
            w-full
            flex
            items-center
            justify-between
            gap-4
          "
        >
          {/* =================================================
              EXTREME LEFT — CATEGORIES
          ================================================== */}
          <div
            className="
              flex
              items-center
              gap-1.5
              overflow-x-auto
              no-scrollbar
              min-w-0
              flex-1
            "
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    whitespace-nowrap
                    flex-shrink-0
                    transition-all
                    font-semibold

                    ${
                      isActive
                        ? `
                          bg-rose-600
                          text-white
                          dark:bg-stone-100
                          dark:text-stone-900
                          shadow-sm
                          font-bold
                        `
                        : `
                          bg-white
                          text-stone-900
                          border
                          border-stone-300
                          hover:bg-rose-50
                          hover:text-rose-700
                          hover:border-rose-300

                          dark:bg-stone-900
                          dark:text-stone-100
                          dark:border-stone-700
                          dark:hover:bg-stone-800
                          dark:hover:text-rose-300
                        `
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* =================================================
              EXTREME RIGHT — ACTION BUTTONS
          ================================================== */}
          <div
            className="
              flex
              items-center
              justify-end
              gap-1.5
              flex-shrink-0
            "
          >
            {/* 1 — DARK MODE */}
            <button
              onClick={toggleDarkMode}
              className="
                p-2
                rounded-full
                bg-white
                dark:bg-stone-900
                border
                border-stone-300
                dark:border-stone-700
                text-stone-900
                dark:text-stone-100
                hover:bg-rose-50
                dark:hover:bg-stone-800
                transition-all
              "
              title={
                isDarkMode
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'
              }
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-rose-600" />
              )}
            </button>

            {/* 2 — SIGN IN / USER */}
            {currentUser ? (
              <div
                className="
                  flex
                  items-center
                  gap-1
                  bg-white
                  dark:bg-stone-900
                  border
                  border-stone-300
                  dark:border-stone-700
                  rounded-full
                  px-1
                "
              >
                <button
                  onClick={() => setActiveModal('userOrders')}
                  className="
                    flex
                    items-center
                    gap-1.5
                    px-2
                    py-1
                    text-xs
                    font-bold
                    text-stone-900
                    dark:text-stone-100
                  "
                >
                  <div
                    className="
                      w-5
                      h-5
                      rounded-full
                      bg-rose-500
                      text-white
                      flex
                      items-center
                      justify-center
                      text-[10px]
                      font-black
                    "
                  >
                    {currentUser.name.charAt(0)}
                  </div>

                  <span className="hidden lg:inline">
                    {currentUser.name}
                  </span>
                </button>

                <button
                  onClick={logoutUser}
                  className="
                    p-1
                    text-stone-500
                    hover:text-rose-600
                    dark:text-stone-400
                    dark:hover:text-rose-400
                  "
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveModal('auth')}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  font-bold
                  text-stone-900
                  dark:text-stone-100
                  bg-white
                  dark:bg-stone-900
                  border
                  border-stone-300
                  dark:border-stone-700
                  hover:bg-rose-50
                  hover:text-rose-700
                  dark:hover:bg-stone-800
                  dark:hover:text-rose-300
                  rounded-full
                  px-3
                  py-1.5
                  transition-all
                "
              >
                <User className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* 3 — TRACK ORDER */}
            <button
              onClick={() => setActiveModal('orderTracker')}
              className="
                flex
                items-center
                gap-1.5
                text-xs
                font-bold
                text-stone-900
                dark:text-stone-100
                bg-white
                dark:bg-stone-900
                border
                border-stone-300
                dark:border-stone-700
                hover:bg-amber-50
                hover:text-amber-700
                dark:hover:bg-stone-800
                dark:hover:text-amber-400
                rounded-full
                px-3
                py-1.5
                transition-all
              "
            >
              <PackageCheck
                className="
                  w-3.5
                  h-3.5
                  text-amber-600
                  dark:text-amber-400
                "
              />

              <span className="hidden md:inline">
                Track Order
              </span>
            </button>

            {/* 4 — CART */}
            <button
              onClick={() => setCartOpen(true)}
              className="
                relative
                bg-gradient-to-r
                from-rose-500
                via-pink-500
                to-amber-500
                hover:from-rose-600
                hover:to-amber-600
                text-white
                rounded-full
                px-3
                py-1.5
                flex
                items-center
                gap-1.5
                shadow-md
                transition-all
                active:scale-95
              "
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />

              <span className="text-xs font-black text-white">
                Cart
              </span>

              {totalCartCount > 0 && (
                <span
                  className="
                    bg-amber-400
                    text-stone-950
                    font-black
                    text-[10px]
                    rounded-full
                    w-4
                    h-4
                    flex
                    items-center
                    justify-center
                  "
                >
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* 5 — SEARCH */}
            <div className="relative flex items-center">
              {searchOpen && (
                <div
                  className="
                    absolute
                    right-11
                    top-1/2
                    -translate-y-1/2
                    flex
                    items-center
                  "
                >
                  <Search
                    className="
                      absolute
                      left-3
                      w-3.5
                      h-3.5
                      text-stone-500
                      dark:text-stone-400
                    "
                  />

                  <input
                    autoFocus
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="
                      w-40
                      lg:w-52
                      bg-white
                      dark:bg-stone-900
                      border
                      border-stone-300
                      dark:border-stone-700
                      rounded-full
                      pl-9
                      pr-8
                      py-1.5
                      text-xs
                      font-semibold
                      text-stone-900
                      dark:text-stone-100
                      placeholder:text-stone-500
                      outline-none
                      shadow-lg
                      focus:border-rose-400
                      focus:ring-2
                      focus:ring-rose-100
                      dark:focus:ring-rose-900/30
                    "
                  />

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="
                        absolute
                        right-2.5
                        text-stone-400
                        hover:text-stone-800
                        dark:hover:text-white
                      "
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="
                  p-2
                  rounded-full
                  bg-white
                  dark:bg-stone-900
                  border
                  border-stone-300
                  dark:border-stone-700
                  text-stone-900
                  dark:text-stone-100
                  hover:bg-rose-50
                  hover:text-rose-700
                  dark:hover:bg-stone-800
                  dark:hover:text-rose-300
                  transition-all
                "
                title="Search"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
