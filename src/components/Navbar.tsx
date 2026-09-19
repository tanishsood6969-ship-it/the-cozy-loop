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
  ChevronDown,
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
  const [mobileCategoriesOpen, setMobileCategoriesOpen] =
    useState(false);

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

  const handleCategorySelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    setMobileCategoriesOpen(false);
  };

  return (
    <header
      className="
        crochet-navbar
        sticky
        top-0
        z-40
        w-full
        max-w-full
        text-stone-900
        dark:text-stone-100
        shadow-sm
        transition-all
        relative
        overflow-visible
      "
    >
      {/* =====================================================
          DECORATIVE CRAFT BACKGROUND
      ====================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <span className="absolute left-3 sm:left-6 top-2 text-sm opacity-25 animate-float-wool">
          🧶
        </span>

        <span
          className="absolute right-6 sm:right-12 top-2 text-sm opacity-25 animate-float-wool"
          style={{ animationDelay: '1.2s' }}
        >
          🧵
        </span>

        <span
          className="absolute left-1/4 bottom-2 text-xs opacity-20 animate-float-wool"
          style={{ animationDelay: '2.4s' }}
        >
          🪡
        </span>

        <span
          className="absolute right-1/4 top-3 text-xs opacity-20 animate-float-wool"
          style={{ animationDelay: '3.1s' }}
        >
          🌸
        </span>

        <span
          className="absolute left-1/3 top-1 text-[10px] opacity-20 animate-pulse"
          style={{ animationDelay: '0.8s' }}
        >
          ✨
        </span>

        <span
          className="absolute right-1/3 bottom-1 text-[10px] opacity-20 animate-pulse"
          style={{ animationDelay: '1.8s' }}
        >
          ✨
        </span>
      </div>

      {/* =====================================================
          SECTION 1 — ANNOUNCEMENT BAR
      ====================================================== */}
      <div
        className="
          relative
          z-10
          bg-gradient-to-r
          from-rose-600
          via-pink-500
          to-amber-500
          text-white
          text-[10px]
          sm:text-[11px]
          font-bold
          py-1.5
          px-3
          sm:px-4
          flex
          items-center
          justify-center
          gap-1.5
          sm:gap-2
          text-center
          min-h-[30px]
        "
      >
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white animate-pulse flex-shrink-0" />

        <span className="text-white truncate max-w-[85vw]">
          {settings.announcementText}
        </span>

        <span
          className="
            hidden
            md:inline-block
            bg-white/20
            text-white
            px-2
            py-0.5
            rounded-full
            text-[10px]
            ml-2
            flex-shrink-0
          "
        >
          📍 {settings.universityName}
        </span>
      </div>

      {/* =====================================================
          SECTION 2 — LOGO
      ====================================================== */}
      <div
        className="
          py-2
          sm:py-2.5
          px-3
          sm:px-4
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
          min-w-0
        "
      >
        <YarnTitleAnimation
          storeName={settings.storeName}
          tagline={settings.tagline}
          onCategoryReset={() => setSelectedCategory('All')}
        />
      </div>

      {/* =====================================================
          DESKTOP NAVIGATION
          Visible from md and above
      ====================================================== */}
      <div
        className="
          hidden
          md:block
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
          {/* DESKTOP CATEGORIES */}
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

          {/* DESKTOP ACTIONS */}
          <div
            className="
              flex
              items-center
              justify-end
              gap-1.5
              flex-shrink-0
            "
          >
            {/* DARK MODE */}
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

            {/* USER */}
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

            {/* TRACK ORDER */}
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

              <span>Track Order</span>
            </button>

            {/* CART */}
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

            {/* SEARCH */}
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

      {/* =====================================================
          MOBILE NAVIGATION
          Visible below md
      ====================================================== */}
      <div
        className="
          md:hidden
          relative
          z-20
          w-full
          px-3
          py-2
          bg-[#fffaf5]/95
          dark:bg-stone-950/95
          backdrop-blur-md
          border-t
          border-stone-200/60
          dark:border-stone-800/60
        "
      >
        {/* MOBILE CATEGORY DROPDOWN */}
        <div className="relative w-full">
          <button
            type="button"
            onClick={() =>
              setMobileCategoriesOpen(
                !mobileCategoriesOpen
              )
            }
            className="
              w-full
              min-h-[42px]
              px-4
              py-2
              rounded-xl
              flex
              items-center
              justify-between
              gap-3
              bg-white
              dark:bg-stone-900
              border
              border-stone-300
              dark:border-stone-700
              text-stone-900
              dark:text-stone-100
              shadow-sm
              active:scale-[0.99]
              transition-all
            "
            aria-expanded={mobileCategoriesOpen}
            aria-label="Open categories"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="
                  w-7
                  h-7
                  rounded-lg
                  bg-rose-100
                  dark:bg-rose-950/50
                  text-rose-600
                  dark:text-rose-300
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                🧶
              </span>

              <div className="text-left min-w-0">
                <span className="block text-[9px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500">
                  Browse
                </span>

                <span className="block text-sm font-bold truncate">
                  {selectedCategory}
                </span>
              </div>
            </div>

            <ChevronDown
              className={`
                w-5
                h-5
                flex-shrink-0
                text-stone-500
                dark:text-stone-400
                transition-transform
                duration-200
                ${
                  mobileCategoriesOpen
                    ? 'rotate-180'
                    : ''
                }
              `}
            />
          </button>

          {/* DROPDOWN */}
          {mobileCategoriesOpen && (
            <div
              className="
                absolute
                left-0
                right-0
                top-[calc(100%+6px)]
                z-50
                rounded-xl
                overflow-hidden
                bg-white
                dark:bg-stone-900
                border
                border-stone-200
                dark:border-stone-700
                shadow-xl
              "
            >
              <div className="max-h-[55vh] overflow-y-auto p-1.5">
                {categories.map((cat) => {
                  const isActive =
                    selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        handleCategorySelect(cat)
                      }
                      className={`
                        w-full
                        text-left
                        px-3
                        py-2.5
                        rounded-lg
                        text-sm
                        font-semibold
                        transition-all
                        flex
                        items-center
                        justify-between
                        gap-2

                        ${
                          isActive
                            ? `
                              bg-rose-600
                              text-white
                            `
                            : `
                              text-stone-800
                              dark:text-stone-100
                              hover:bg-rose-50
                              dark:hover:bg-stone-800
                              hover:text-rose-700
                              dark:hover:text-rose-300
                            `
                        }
                      `}
                    >
                      <span>{cat}</span>

                      {isActive && (
                        <span className="text-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* MOBILE ACTIONS */}
        <div
          className="
            mt-2
            flex
            items-center
            gap-2
            w-full
          "
        >
          {/* DARK MODE */}
          <button
            onClick={toggleDarkMode}
            className="
              w-10
              h-10
              flex-shrink-0
              rounded-xl
              bg-white
              dark:bg-stone-900
              border
              border-stone-300
              dark:border-stone-700
              flex
              items-center
              justify-center
              transition-all
              active:scale-95
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

          {/* USER */}
          <button
            onClick={() =>
              currentUser
                ? setActiveModal('userOrders')
                : setActiveModal('auth')
            }
            className="
              flex-1
              min-w-0
              h-10
              px-3
              rounded-xl
              bg-white
              dark:bg-stone-900
              border
              border-stone-300
              dark:border-stone-700
              flex
              items-center
              justify-center
              gap-2
              text-xs
              font-bold
              text-stone-900
              dark:text-stone-100
              transition-all
              active:scale-[0.98]
            "
          >
            {currentUser ? (
              <>
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
                    text-[9px]
                    font-black
                    flex-shrink-0
                  "
                >
                  {currentUser.name.charAt(0)}
                </div>

                <span className="truncate">
                  {currentUser.name}
                </span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* TRACK ORDER */}
          <button
            onClick={() =>
              setActiveModal('orderTracker')
            }
            className="
              w-10
              h-10
              flex-shrink-0
              rounded-xl
              bg-white
              dark:bg-stone-900
              border
              border-stone-300
              dark:border-stone-700
              flex
              items-center
              justify-center
              transition-all
              active:scale-95
            "
            title="Track Order"
            aria-label="Track Order"
          >
            <PackageCheck
              className="
                w-4
                h-4
                text-amber-600
                dark:text-amber-400
              "
            />
          </button>

          {/* CART */}
          <button
            onClick={() => setCartOpen(true)}
            className="
              relative
              w-10
              h-10
              flex-shrink-0
              rounded-xl
              bg-gradient-to-r
              from-rose-500
              via-pink-500
              to-amber-500
              text-white
              flex
              items-center
              justify-center
              shadow-md
              active:scale-95
              transition-all
            "
            aria-label="Cart"
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4 text-white" />

            {totalCartCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-amber-400
                  text-stone-950
                  font-black
                  text-[9px]
                  rounded-full
                  min-w-[17px]
                  h-[17px]
                  px-1
                  flex
                  items-center
                  justify-center
                  border-2
                  border-[#fffaf5]
                  dark:border-stone-950
                "
              >
                {totalCartCount}
              </span>
            )}
          </button>

          {/* SEARCH */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="
              w-10
              h-10
              flex-shrink-0
              rounded-xl
              bg-white
              dark:bg-stone-900
              border
              border-stone-300
              dark:border-stone-700
              flex
              items-center
              justify-center
              text-stone-900
              dark:text-stone-100
              transition-all
              active:scale-95
            "
            title="Search"
            aria-label="Search"
          >
            {searchOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* MOBILE SEARCH INPUT */}
        {searchOpen && (
          <div className="mt-2 relative w-full">
            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                text-stone-400
                dark:text-stone-500
              "
            />

            <input
              autoFocus
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="
                w-full
                h-10
                bg-white
                dark:bg-stone-900
                border
                border-stone-300
                dark:border-stone-700
                rounded-xl
                pl-10
                pr-10
                text-sm
                font-semibold
                text-stone-900
                dark:text-stone-100
                placeholder:text-stone-500
                outline-none
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
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-stone-400
                  hover:text-stone-800
                  dark:hover:text-white
                "
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};