import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Search, Package, Clock, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';
import type { OrderStatus, Order } from '../types';

export const OrderTrackerModal: React.FC = () => {
  const { activeModal, setActiveModal, orders, lastCreatedOrder } = useStore();
  const [searchId, setSearchId] = useState<string>(lastCreatedOrder?.id || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(lastCreatedOrder || orders[0] || null);

  if (activeModal !== 'orderTracker') return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toLowerCase();
    const found = orders.find(o => 
      o.id.toLowerCase() === query || 
      o.phone.replaceAll(' ', '').includes(query)
    );
    setSearchedOrder(found || null);
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Crocheting': return 2;
      case 'Ready for Pickup': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

  const steps = [
    { title: 'Order Received', desc: 'Recorded at studio' },
    { title: 'Hand-Crocheting', desc: 'Crafting yarn with love' },
    { title: 'Ready for Campus', desc: 'Packed with gift card' },
    { title: 'Delivered!', desc: 'Handed to student' }
  ];

  const currentStepIndex = searchedOrder ? getStepIndex(searchedOrder.status || 'Pending') : 0;

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

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-full px-3 py-1 text-xs font-bold text-rose-700 mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Campus Order Status Lookup</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900">
            Track Your Order Timeline 🚚
          </h2>
          <p className="text-xs text-stone-500">
            Enter your Order ID (e.g., ORD-8942) or registered phone number below:
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input 
              type="text"
              placeholder="Enter Order ID (e.g. ORD-8942)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-rose-400 rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none font-semibold"
            />
          </div>
          <button
            type="submit"
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-2xl transition-colors"
          >
            Track Status
          </button>
        </form>

        {/* Order Details Display */}
        {searchedOrder ? (
          <div className="space-y-6">
            
            {/* Summary Banner */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Order ID</span>
                <div className="text-lg font-black text-stone-900">{searchedOrder.id}</div>
                <div className="text-xs text-stone-500">Ordered by {searchedOrder.customerName}</div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Current Status</span>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    searchedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : searchedOrder.status === 'Ready for Pickup'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {searchedOrder.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Progress Bar */}
            <div className="py-2">
              <div className="relative flex items-center justify-between max-w-lg mx-auto">
                {/* Connecting Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-rose-500 to-emerald-500 z-0 transition-all duration-500"
                  style={{ width: `${((Math.max(1, currentStepIndex) - 1) / 3) * 100}%` }}
                />

                {/* Timeline Nodes */}
                {steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = currentStepIndex >= stepNum;
                  const isCurrent = currentStepIndex === stepNum;

                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted 
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-200' 
                          : 'bg-stone-100 border-2 border-stone-300 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-rose-200 scale-110' : ''}`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                      </div>
                      <div className="text-center mt-2">
                        <div className={`text-[11px] font-bold ${isCurrent ? 'text-rose-600' : 'text-stone-800'}`}>
                          {step.title}
                        </div>
                        <div className="text-[9px] text-stone-400 hidden sm:block">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items Included & Delivery Spot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-3">
                <div className="font-bold text-stone-900 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Campus Delivery Location:
                </div>
                <div className="text-stone-700 font-medium">{searchedOrder.dormOrBuilding}</div>
                <div className="text-stone-500">{searchedOrder.roomOrSpot}</div>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3">
                <div className="font-bold text-stone-900 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Estimated Delivery:
                </div>
                <div className="text-amber-900 font-bold">{searchedOrder.estimatedDeliveryDate}</div>
                <div className="text-stone-500">{searchedOrder.paymentMethod} • {searchedOrder.paymentStatus}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
            <div className="text-stone-700 font-bold text-sm">No order found matching "{searchId}"</div>
            <p className="text-xs text-stone-400">Please double check your Order ID or phone number.</p>
          </div>
        )}
      </div>
    </div>
  );
};
