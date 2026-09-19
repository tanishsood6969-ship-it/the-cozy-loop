
import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/Admin/AdminAuthModal';
import { UserOrdersModal } from './components/UserOrdersModal';
import { SecretAdminLoginPage } from './components/Admin/SecretAdminLoginPage';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Footer } from './components/Footer';
import { Sparkles, HeartHandshake } from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    products,
    reviews,
    selectedCategory,
    searchQuery,
    isAdmin,
    adminAuthenticated,
    toastMessage,
    setActiveModal,
    setSelectedCategory
  } = useStore();

  const [currentHash, setCurrentHash] = useState<string>(
    window.location.hash
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener(
      'hashchange',
      handleHashChange
    );

    return () =>
      window.removeEventListener(
        'hashchange',
        handleHashChange
      );
  }, []);

  /*
   * ============================================================
   * FILTER PRODUCTS
   * ============================================================
   */

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'All' ||
      product.category === selectedCategory;

    const matchesSearch =
      searchQuery === '' ||
      product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.category
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  /*
   * ============================================================
   * CALCULATE LIVE PRODUCT RATINGS
   * ============================================================
   */

  const getProductWithLiveRating = (
    product: typeof products[number]
  ) => {
    const productReviews = reviews.filter(
      review =>
        review.productName.trim().toLowerCase() ===
        product.name.trim().toLowerCase()
    );

    /*
     * If there are no reviews, preserve the product's
     * existing rating and count.
     */
    if (productReviews.length === 0) {
      return product;
    }

    const totalRating = productReviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

    const averageRating =
      totalRating / productReviews.length;

    const roundedRating =
      Math.round(averageRating * 10) / 10;

    return {
      ...product,
      rating: roundedRating,
      reviewCount: productReviews.length
    };
  };

  /*
   * ============================================================
   * TOAST NOTIFICATION
   * ============================================================
   *
   * All toast notifications now appear at the TOP CENTER
   * with a smooth pop / drop animation.
   * ============================================================
   */

 
const ToastNotification = () => {
  if (!toastMessage) {
    return null;
  }

  return (
    <div
      key={toastMessage}
      className="
        fixed
        top-6
        left-0
        right-0
        z-[9999]
        flex
        justify-center
        pointer-events-none
      "
    >
      <div
        className="
          w-max
          max-w-[calc(100vw-2rem)]
          animate-toast-pop
          pointer-events-auto
        "
      >
        <div
          className="
            relative
            overflow-hidden
            flex
            items-center
            gap-3
            px-5
            py-3.5
            rounded-2xl
            bg-stone-900
            dark:bg-zinc-900
            text-white
            text-xs
            sm:text-sm
            font-bold
            border
            border-rose-500/50
            shadow-[0_15px_45px_rgba(0,0,0,0.25)]
            backdrop-blur-xl
          "
        >
          {/* Soft background glow */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-rose-500/10
              via-pink-500/15
              to-amber-400/10
              pointer-events-none
            "
          />

          {/* Animated icon */}
          <div
            className="
              relative
              flex
              items-center
              justify-center
              w-8
              h-8
              rounded-full
              bg-rose-500/20
              border
              border-rose-400/30
              shrink-0
              animate-toast-icon
            "
          >
            ✨
          </div>

          {/* Toast message */}
          <span className="relative leading-5">
            {toastMessage}
          </span>

          {/* Moving shine */}
          <div
            className="
              absolute
              top-0
              left-0
              h-[2px]
              w-full
              bg-gradient-to-r
              from-transparent
              via-rose-400
              to-transparent
              animate-toast-shine
            "
          />
        </div>
      </div>
    </div>
  );
};


  /*
   * ============================================================
   * SECRET ADMIN PAGE ROUTING
   * ============================================================
   */

  const isSecretAdminRoute =
    currentHash === '#admin' ||
    currentHash === '#/admin' ||
    isAdmin;

  if (isSecretAdminRoute) {
    if (adminAuthenticated) {
      return (
        <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] transition-colors duration-300">

          <ToastNotification />

          <AdminDashboard />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-stone-950">

        <ToastNotification />

        <SecretAdminLoginPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-[var(--page-bg)]/50 text-[var(--text-primary)] transition-colors duration-300">

      {/* ========================================================
          TOP CENTER TOAST
          ======================================================== */}

      <ToastNotification />

      <Navbar />

      <main className="flex-1">

        {/* ======================================================
            HERO
            ====================================================== */}

        {selectedCategory === 'All' && !searchQuery && (
          <Hero />
        )}

        {/* ======================================================
            PRODUCT CATALOG
            ====================================================== */}

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">

          {/* Category Title & Filter Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 border-b-2 border-rose-200/80 pb-4">

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] flex items-center gap-2">

                <span>
                  {selectedCategory === 'All'
                    ? '🌸 Handcrafted Wool & Cotton Collection'
                    : selectedCategory}
                </span>

              </h2>

              <p className="text-xs text-[var(--text-secondary)] font-semibold mt-1">
                Showing {filteredProducts.length} unique hand-knitted item(s) ready for campus dorm delivery
              </p>
            </div>

            {/* Custom Request CTA Button */}
            <button
              onClick={() =>
                setActiveModal('customOrder')
              }
              className="
                bg-amber-100
                hover:bg-amber-200
                text-amber-900
                font-extrabold
                text-xs
                px-4
                py-2
                rounded-full
                border
                border-amber-300
                flex
                items-center
                gap-1.5
                transition-all
                self-start
                sm:self-auto
                shadow-xs
              "
            >
              <Sparkles className="w-4 h-4 text-amber-600" />

              <span>
                Want a custom flower color? Request Custom Order
              </span>
            </button>
          </div>

          {/* ====================================================
              EMPTY STATE
              ==================================================== */}

          {filteredProducts.length === 0 ? (
            <div
              className="
                bg-[var(--surface)]
                rounded-3xl
                p-12
                text-center
                border-2
                border-[var(--border)]
                max-w-md
                mx-auto
                my-12
                space-y-3
                shadow-md
                transition-colors
                duration-300
              "
            >

              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-3xl mx-auto">
                🔍
              </div>

              <h3 className="font-extrabold text-[var(--text-primary)] text-lg">
                No crochet products found
              </h3>

              <p className="text-xs text-[var(--text-secondary)] font-medium">
                We couldn't find any items matching "{searchQuery}".
                Try searching for tulips, sunflowers, or keychains!
              </p>

              <button
                onClick={() => {
                  setSelectedCategory('All');
                }}
                className="
                  bg-stone-900
                  text-white
                  font-bold
                  text-xs
                  px-5
                  py-2.5
                  rounded-full
                  hover:bg-stone-800
                  transition-colors
                "
              >
                View All Products
              </button>
            </div>
          ) : (

            /* ==================================================
               PRODUCTS GRID
               ================================================== */

            <div
              id="products"
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-6
              "
            >
              {filteredProducts.map(product => {

                /*
                 * Calculate rating directly from live reviews.
                 */
                const liveProduct =
                  getProductWithLiveRating(
                    product
                  );

                return (
                  <ProductCard
                    key={product.id}
                    product={liveProduct}
                  />
                );
              })}
            </div>
          )}

          {/* ====================================================
              CUSTOM COMMISSION BANNER
              ==================================================== */}

          <div
            className="
              mt-16
              yarn-gradient-hero
              rounded-3xl
              p-8
              border-2
              border-rose-300
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-6
              shadow-md
            "
          >

            <div className="space-y-2 text-center md:text-left">

              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  bg-rose-600
                  text-white
                  text-[11px]
                  font-extrabold
                  px-3.5
                  py-1
                  rounded-full
                  shadow-xs
                "
              >
                <HeartHandshake className="w-3.5 h-3.5" />

                <span>
                  Personalized Student Orders
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                Need a Custom Crochet Gift For Someone Special?
              </h3>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-semibold max-w-xl">
                Choose your favorite yarn colors, stem count, and custom notes.
                We'll hand-crochet it and deliver directly to your dorm room or campus spot!
              </p>
            </div>

            <button
              onClick={() =>
                setActiveModal('customOrder')
              }
              className="
                bg-gradient-to-r
                from-rose-500
                to-pink-600
                hover:from-rose-600
                hover:to-pink-700
                text-white
                font-extrabold
                px-7
                py-4
                rounded-2xl
                shadow-xl
                shadow-rose-200
                transition-all
                text-sm
                flex-shrink-0
              "
            >
              Request Custom Design ✨
            </button>
          </div>
        </div>

        <Footer />
      </main>

      {/* ========================================================
          ALL MODALS & DRAWERS
          ======================================================== */}

      <ProductModal />
      <CustomOrderModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <OrderTrackerModal />
      <AuthModal />
      <AdminAuthModal />
      <UserOrdersModal />

    </div>
  );
};

/*
 * ==============================================================
 * APP
 * ==============================================================
 */

export function App() {
  return (
    <StoreProvider>

      <div className="relative min-h-screen w-full max-w-full ">

        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="
            fixed
            top-0
            left-0
            w-full
            h-[100dvh]
            max-w-full
            object-cover
            -z-10
            opacity-60
            pointer-events-none
          "
        >
          <source
            src="/background.mp4"
            type="video/mp4"
          />
        </video>

        {/* Background Overlay */}
        <div
          className="
            fixed
            inset-0
            -z-10
            bg-white/55
            dark:bg-black/35
            pointer-events-none
          "
        />

        <StoreContent />

      </div>

    </StoreProvider>
  );
}

export default App;

