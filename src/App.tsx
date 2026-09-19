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
    selectedCategory, 
    searchQuery, 
    isAdmin, 
    adminAuthenticated,
    toastMessage,
    setActiveModal,
    setSelectedCategory
  } = useStore();

  const [currentHash, setCurrentHash] = useState<string>(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Secret Admin Page Routing Logic
  const isSecretAdminRoute = currentHash === '#admin' || currentHash === '#/admin' || isAdmin;

  if (isSecretAdminRoute) {
    if (adminAuthenticated) {
      return (
       <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)] transition-colors duration-300">
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-rose-500/40 animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2">
              <span>{toastMessage}</span>
            </div>
          )}
          <AdminDashboard />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-stone-950">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-rose-500/40 animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        )}
        <SecretAdminLoginPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-[var(--page-bg)]/50 text-[var(--text-primary)] transition-colors duration-300">
      
      {/* Toast Notification Floating Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-rose-500/40 animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      <Navbar />
      
      <main className="flex-1">
        {/* Show Hero only when viewing 'All' and no search query */}
        {selectedCategory === 'All' && !searchQuery && <Hero />}

        {/* Product Catalog Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          
          {/* Category Title & Filter Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 border-b-2 border-rose-200/80 pb-4">
            <div><h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] flex items-center gap-2">
              
                <span>{selectedCategory === 'All' ? '🌸 Handcrafted Wool & Cotton Collection' : selectedCategory}</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-semibold mt-1">
                Showing {filteredProducts.length} unique hand-knitted item(s) ready for campus dorm delivery
              </p>
            </div>

            {/* Custom Request CTA Button */}
            <button
              onClick={() => setActiveModal('customOrder')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs px-4 py-2 rounded-full border border-amber-300 flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Want a custom flower color? Request Custom Order</span>
            </button>
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[var(--surface)] rounded-3xl p-12 text-center border-2 border-[var(--border)] max-w-md mx-auto my-12 space-y-3 shadow-md transition-colors duration-300">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-3xl mx-auto">
                🔍
              </div>
             <h3 className="font-extrabold text-[var(--text-primary)] text-lg">No crochet products found</h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                We couldn't find any items matching "{searchQuery}". Try searching for tulips, sunflowers, or keychains!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                }}
                className="bg-stone-900 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-stone-800 transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Custom Commission Banner Card */}
          <div className="mt-16 yarn-gradient-hero rounded-3xl p-8 border-2 border-rose-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-xs">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Personalized Student Orders</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                Need a Custom Crochet Gift For Someone Special?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-semibold max-w-xl">
                Choose your favorite yarn colors, stem count, and custom notes. We'll hand-crochet it and deliver directly to your dorm room or campus spot!
              </p>
            </div>

            <button
              onClick={() => setActiveModal('customOrder')}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold px-7 py-4 rounded-2xl shadow-xl shadow-rose-200 transition-all text-sm flex-shrink-0"
            >
              Request Custom Design ✨
            </button>
          </div>
        </div>

        <Footer />
      </main>

      {/* All Modals & Drawers */}
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
export function App() {
  return (
    <StoreProvider>
      <div className="relative min-h-screen">
        <video
  autoPlay
  muted
  loop
  playsInline
  className="fixed inset-0 w-full h-full object-cover -z-10 opacity-60"
>
  <source src="/background.mp4" type="video/mp4" />
</video>

<div className="fixed inset-0 -z-10 bg-white/55 dark:bg-black/35 pointer-events-none" />

        <StoreContent />
      </div>
    </StoreProvider>
  );
}

export default App;