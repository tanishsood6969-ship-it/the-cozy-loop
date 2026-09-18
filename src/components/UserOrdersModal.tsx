import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, MapPin, LogOut } from 'lucide-react';

export const UserOrdersModal: React.FC = () => {
  const { activeModal, setActiveModal, currentUser, logoutUser, orders } = useStore();

  if (activeModal !== 'userOrders' || !currentUser) return null;

  const userOrders = orders.filter(o => 
    o.userId === currentUser.id || 
    o.customerName.toLowerCase() === currentUser.name.toLowerCase() ||
    o.phone.replaceAll(' ', '') === currentUser.phone.replaceAll(' ', '')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 p-6 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Account Profile Card */}
        <div className="yarn-gradient-vibrant p-5 rounded-3xl text-white flex items-center justify-between flex-wrap gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl shadow-inner">
              👩‍🎓
            </div>
            <div>
              <h2 className="text-xl font-extrabold">{currentUser.name}</h2>
              <p className="text-xs text-rose-100">{currentUser.email} • {currentUser.phone}</p>
              {currentUser.dormOrBuilding && (
                <div className="flex items-center gap-1 text-[11px] text-amber-200 mt-1 font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>{currentUser.dormOrBuilding} ({currentUser.roomOrSpot || 'Dorm'})</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              logoutUser();
              setActiveModal(null);
            }}
            className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Past Orders List */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <span>My Campus Orders ({userOrders.length})</span>
          </h3>

          {userOrders.length === 0 ? (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
              You haven't placed any orders yet! Browse our catalog to get started. 🌸
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-black text-stone-900 text-sm">{order.id}</span>
                      <span className="text-xs text-stone-500 ml-2">• {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Ready for Pickup'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-stone-700 font-semibold">
                    {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-stone-200 text-stone-500">
                    <span>Delivered to {order.dormOrBuilding}</span>
                    <span className="font-extrabold text-stone-900 text-sm">Total: ₹{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
