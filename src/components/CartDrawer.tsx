import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  Gift,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    setActiveModal,
    isDarkMode,
  } = useStore();

  if (!cartOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Delivery is FREE for every order
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setActiveModal('checkout');
  };

  /*
   * THEME COLORS
   * These are controlled directly by your StoreContext.
   * No Tailwind `dark:` classes are used here.
   */

  const drawerClass = isDarkMode
    ? 'bg-stone-950 text-stone-100'
    : 'bg-white text-stone-900';

  const headerClass = isDarkMode
    ? 'bg-stone-900 border-stone-800'
    : 'bg-stone-50/80 border-stone-200';

  const primaryText = isDarkMode
    ? 'text-stone-100'
    : 'text-stone-900';

  const secondaryText = isDarkMode
    ? 'text-stone-400'
    : 'text-stone-500';

  const itemClass = isDarkMode
    ? 'bg-stone-900 border-stone-800 hover:bg-stone-800'
    : 'bg-stone-50/50 border-stone-200 hover:bg-white';

  const imageBorderClass = isDarkMode
    ? 'border-stone-700'
    : 'border-stone-200';

  const colorBadgeClass = isDarkMode
    ? 'bg-stone-800 text-stone-300'
    : 'bg-stone-200/60 text-stone-700';

  const quantityContainerClass = isDarkMode
    ? 'bg-stone-900 border-stone-700'
    : 'bg-white border-stone-200';

  const quantityButtonClass = isDarkMode
    ? 'text-stone-300 hover:bg-stone-800'
    : 'text-stone-600 hover:bg-stone-100';

  const quantityTextClass = isDarkMode
    ? 'text-stone-200'
    : 'text-stone-800';

  const footerClass = isDarkMode
    ? 'bg-stone-900 border-stone-800'
    : 'bg-stone-50/90 border-stone-200';

  const closeButtonClass = isDarkMode
    ? 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
    : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-sm transition-opacity">
      <div
        className={`w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 ${drawerClass}`}
      >
        {/* =========================
            DRAWER HEADER
        ========================== */}
        <div
          className={`p-5 border-b flex items-center justify-between ${headerClass}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>

            <div>
              <h3 className={`font-extrabold text-lg ${primaryText}`}>
                Your Crochet Cart
              </h3>

              <p className={`text-xs ${secondaryText}`}>
                {cart.length} unique item(s)
              </p>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            className={`p-2 rounded-full transition-colors ${closeButtonClass}`}
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================
            FREE DELIVERY BANNER
        ========================== */}
        <div
          className={`p-4 border-b ${
            isDarkMode
              ? 'bg-gradient-to-r from-stone-900 via-stone-900 to-stone-800 border-stone-800'
              : 'bg-gradient-to-r from-amber-50 to-rose-50 border-rose-100'
          }`}
        >
          <div
            className={`flex items-center justify-center text-xs font-semibold ${
              isDarkMode ? 'text-stone-200' : 'text-stone-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-500" />

              <span className="text-emerald-500 font-bold">
                🎉 FREE Campus Delivery on Every Order!
              </span>
            </span>
          </div>

          {/* Full progress bar because delivery is always free */}
          <div
            className={`w-full h-2 rounded-full overflow-hidden mt-2 ${
              isDarkMode ? 'bg-stone-700' : 'bg-stone-200'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* =========================
            CART ITEM LIST
        ========================== */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div
              className={`h-full flex flex-col items-center justify-center text-center space-y-3 ${
                isDarkMode ? 'text-stone-500' : 'text-stone-400'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  isDarkMode ? 'bg-rose-950/50' : 'bg-rose-50'
                }`}
              >
                🌸
              </div>

              <p
                className={`font-bold text-base ${
                  isDarkMode ? 'text-stone-200' : 'text-stone-600'
                }`}
              >
                Your cart is currently empty!
              </p>

              <p
                className={`text-xs max-w-xs ${
                  isDarkMode ? 'text-stone-500' : 'text-stone-400'
                }`}
              >
                Explore our eternal tulip stems, keychains, and flower
                bouquets to fill your cart.
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all shadow-sm ${itemClass}`}
              >
                {/* Product Image */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className={`w-16 h-16 rounded-xl object-cover flex-shrink-0 border ${imageBorderClass}`}
                />

                <div className="flex-1 min-w-0">
                  {/* Product Name + Delete */}
                  <div className="flex items-start justify-between">
                    <h4
                      className={`font-bold text-sm truncate ${primaryText}`}
                    >
                      {item.product.name}
                    </h4>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
                      title="Remove item"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Product Options */}
                  <div
                    className={`flex flex-wrap gap-1 text-[10px] mt-0.5 ${secondaryText}`}
                  >
                    {item.selectedColor && (
                      <span
                        className={`px-2 py-0.5 rounded-md font-medium ${colorBadgeClass}`}
                      >
                        Color: {item.selectedColor}
                      </span>
                    )}

                    {item.wrapPaperColor && (
                      <span
                        className={`px-2 py-0.5 rounded-md font-medium ${
                          isDarkMode
                            ? 'bg-amber-950/60 text-amber-300'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        Wrap: {item.wrapPaperColor}
                      </span>
                    )}
                  </div>

                  {/* Gift Note */}
                  {item.giftNote && (
                    <div
                      className={`text-[10px] italic p-1 rounded-md mt-1 flex items-center gap-1 ${
                        isDarkMode
                          ? 'text-rose-300 bg-rose-950/40'
                          : 'text-rose-600 bg-rose-50'
                      }`}
                    >
                      <Gift className="w-3 h-3 flex-shrink-0" />

                      <span className="truncate">
                        "{item.giftNote}"
                      </span>
                    </div>
                  )}

                  {/* Price + Quantity */}
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`font-extrabold text-sm ${primaryText}`}
                    >
                      ₹{item.product.price * item.quantity}
                    </span>

                    {/* Quantity Controls */}
                    <div
                      className={`flex items-center border rounded-lg overflow-hidden ${quantityContainerClass}`}
                    >
                      <button
                        onClick={() =>
                          updateCartQuantity(index, item.quantity - 1)
                        }
                        className={`w-6 h-6 flex items-center justify-center font-bold text-xs transition-colors ${quantityButtonClass}`}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>

                      <span
                        className={`w-6 text-center text-xs font-bold ${quantityTextClass}`}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateCartQuantity(index, item.quantity + 1)
                        }
                        className={`w-6 h-6 flex items-center justify-center font-bold text-xs transition-colors ${quantityButtonClass}`}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* =========================
            FOOTER / CHECKOUT
        ========================== */}
        {cart.length > 0 && (
          <div
            className={`p-5 border-t space-y-3 ${footerClass}`}
          >
            <div
              className={`space-y-1.5 text-xs ${
                isDarkMode ? 'text-stone-400' : 'text-stone-600'
              }`}
            >
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal:</span>

                <span
                  className={`font-bold ${primaryText}`}
                >
                  ₹{subtotal}
                </span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between">
                <span>Campus Delivery:</span>

                <span className="font-bold text-emerald-500">
                  FREE
                </span>
              </div>

              {/* Total */}
              <div
                className={`flex justify-between text-base font-extrabold pt-2 border-t ${
                  isDarkMode
                    ? 'text-stone-100 border-stone-800'
                    : 'text-stone-900 border-stone-200'
                }`}
              >
                <span>Total Amount:</span>

                <span className="text-rose-500">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <span>Proceed to Campus Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};