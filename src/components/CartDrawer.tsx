import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Trash2, ArrowRight, Truck, Gift } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    settings,
    setActiveModal 
  } = useStore();

  if (!cartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const freeDeliveryNeeded = Math.max(0, settings.freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100);

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg">Your Crochet Cart</h3>
              <p className="text-xs text-stone-500">{cart.length} unique item(s)</p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-4 border-b border-rose-100">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-rose-500" />
              {freeDeliveryNeeded === 0 ? (
                <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Campus Dorm Delivery!</span>
              ) : (
                <span>Add ₹{freeDeliveryNeeded} more for FREE Campus Delivery!</span>
              )}
            </span>
            <span className="text-stone-500">{Math.round(freeDeliveryProgress)}%</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-500"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-3xl">
                🌸
              </div>
              <p className="text-stone-600 font-bold text-base">Your cart is currently empty!</p>
              <p className="text-xs text-stone-400 max-w-xs">
                Explore our eternal tulip stems, keychains, and flower bouquets to fill your cart.
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all shadow-xs"
              >
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-stone-900 text-sm truncate">
                      {item.product.name}
                    </h4>
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] text-stone-500 mt-0.5">
                    {item.selectedColor && (
                      <span className="bg-stone-200/60 px-2 py-0.5 rounded-md font-medium text-stone-700">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    {item.wrapPaperColor && (
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-medium">
                        Wrap: {item.wrapPaperColor}
                      </span>
                    )}
                  </div>

                  {item.giftNote && (
                    <div className="text-[10px] text-rose-600 italic bg-rose-50 p-1 rounded-md mt-1 flex items-center gap-1">
                      <Gift className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">"{item.giftNote}"</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-stone-900 text-sm">
                      ₹{item.product.price * item.quantity}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs text-stone-600 hover:bg-stone-100"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center font-bold text-xs text-stone-600 hover:bg-stone-100"
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

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/90 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-stone-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Campus Delivery Fee:</span>
                <span className="font-bold text-emerald-600">
                  {subtotal >= settings.freeDeliveryThreshold ? 'FREE' : '₹30'}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="text-rose-600">
                  ₹{subtotal >= settings.freeDeliveryThreshold ? subtotal : subtotal + 30}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 text-sm transition-all"
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
