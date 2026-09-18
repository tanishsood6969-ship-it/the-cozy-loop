import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, PackageCheck, MessageCircle, X, Copy, MapPin } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { activeModal, setActiveModal, lastCreatedOrder, settings, showToast } = useStore();

  if (activeModal !== 'orderSuccess' || !lastCreatedOrder) return null;

  // Generate WhatsApp Message Link
  const getWhatsAppLink = () => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsList = lastCreatedOrder.items.map(i => `• ${i.productName} (Qty ${i.quantity})`).join('%0A');
    const text = `Hi ${settings.storeName}! 👋 I just placed campus order *${lastCreatedOrder.id}*%0A%0A*Name:* ${lastCreatedOrder.customerName}%0A*Location:* ${lastCreatedOrder.dormOrBuilding} (${lastCreatedOrder.roomOrSpot})%0A*Total Amount:* ₹${lastCreatedOrder.total}%0A*Payment:* ${lastCreatedOrder.paymentMethod} (${lastCreatedOrder.paymentStatus})%0A%0A*Items:*%0A${itemsList}%0A%0APlease confirm my order! 🌸`;
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(lastCreatedOrder.id);
    showToast('Order ID copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 p-6 text-center space-y-5">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Icon */}
        <div className="w-20 h-20 rounded-full bg-rose-100 mx-auto flex items-center justify-center text-rose-500 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-full px-3 py-1 text-xs font-extrabold text-rose-700 mb-2">
            <span>Order Confirmed!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            Thank You, {lastCreatedOrder.customerName}! 🌸
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Your handmade crochet order has been safely placed with our campus studio.
          </p>
        </div>

        {/* Order ID Badge */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between text-left">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Order ID</div>
            <div className="text-lg font-black text-stone-900 flex items-center gap-2">
              <span>{lastCreatedOrder.id}</span>
              <button 
                onClick={copyOrderId}
                className="text-stone-400 hover:text-rose-600 transition-colors"
                title="Copy Order ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Paid</div>
            <div className="text-lg font-extrabold text-rose-600">₹{lastCreatedOrder.total}</div>
          </div>
        </div>

        {/* Delivery Spot Summary */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-xs text-stone-700 flex items-center gap-2.5 text-left">
          <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-bold text-stone-900">Delivering To: </span>
            <span>{lastCreatedOrder.dormOrBuilding} ({lastCreatedOrder.roomOrSpot})</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* WhatsApp Direct Action Button */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>Send Order Confirmation via WhatsApp</span>
          </a>

          {/* Track Order Button */}
          <button
            onClick={() => setActiveModal('orderTracker')}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all"
          >
            <PackageCheck className="w-4 h-4 text-rose-500" />
            <span>View Real-Time Order Status Tracker</span>
          </button>
        </div>
      </div>
    </div>
  );
};
