import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle, MapPin, Phone, User, CreditCard, Truck, QrCode, Copy, Check, Upload, BadgeCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    cart, 
    settings, 
    createOrder,
    currentUser,
    showToast
  } = useStore();

  if (activeModal !== 'checkout') return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal >= settings.freeDeliveryThreshold ? 0 : 30;
  const total = subtotal + deliveryFee;

  // Form State
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [dormOrBuilding, setDormOrBuilding] = useState<string>(
    currentUser?.dormOrBuilding || settings.campusDeliveryLocations[0] || 'Hostel Block A'
  );
  const [roomOrSpot, setRoomOrSpot] = useState<string>(currentUser?.roomOrSpot || '');
  const [paymentMethod, setPaymentMethod] = useState<'UPI / GPay' | 'Cash on Campus Pickup' | 'Card'>('UPI / GPay');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  
  // UPI Payment Verification State
  const [upiUtrInput, setUpiUtrInput] = useState<string>('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string>('');
  const [isUtrVerified, setIsUtrVerified] = useState<boolean>(false);
  const [upiCopied, setUpiCopied] = useState<boolean>(false);

  const activeUpiId = settings.upiId || `${settings.storeName.replaceAll(' ', '').toLowerCase()}@upi`;
  const activePayeeName = settings.upiPayeeName || settings.storeName;

  const copyUpiId = () => {
    navigator.clipboard.writeText(activeUpiId);
    setUpiCopied(true);
    showToast('UPI ID copied to clipboard!');
    setTimeout(() => setUpiCopied(false), 3000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotUrl(reader.result as string);
        showToast('Payment Screenshot attached successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyUtrFormat = () => {
    const cleanUtr = upiUtrInput.trim().replaceAll(' ', '');
    if (!cleanUtr) {
      showToast('Please enter your 12-digit UPI UTR Transaction Reference ID!');
      return;
    }
    if (cleanUtr.length < 8) {
      showToast('⚠️ Transaction ID must be at least 8-12 digits!');
      return;
    }
    setIsUtrVerified(true);
    showToast(`✅ Transaction Ref ${cleanUtr} Recorded!`);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !roomOrSpot.trim()) return;

    if (paymentMethod === 'UPI / GPay' && !upiUtrInput.trim() && !paymentScreenshotUrl) {
      showToast('⚠️ Please enter your 12-Digit UPI Transaction Ref / UTR No. or upload screenshot!');
      return;
    }

    const orderData = {
      customerName,
      phone,
      dormOrBuilding,
      roomOrSpot,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        selectedColor: item.selectedColor,
        giftNote: item.giftNote,
        imageUrl: item.product.imageUrl
      })),
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'UPI / GPay' 
        ? ('Payment Pending Owner Verification' as const) 
        : paymentMethod === 'Card' 
        ? ('Paid' as const) 
        : ('Pay on Pickup' as const),
      estimatedDeliveryDate: 'Within 24-48 Hours on Campus',
      specialInstructions: specialInstructions.trim() || undefined,
      upiTransactionId: upiUtrInput.trim() || undefined,
      paymentScreenshotUrl: paymentScreenshotUrl || undefined,
      paymentVerificationStatus: paymentMethod === 'UPI / GPay' ? ('Pending Owner Verification' as const) : undefined
    };

    createOrder(orderData);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    setActiveModal('orderSuccess');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col border-2 border-rose-200">
        
        {/* Header */}
        <div className="yarn-gradient-vibrant p-6 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-rose-100 text-xs font-bold uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Campus Dorm & Spot Delivery</span>
          </div>

          <h2 className="text-2xl font-black">Campus Order Checkout 🌸</h2>
          <p className="text-xs text-rose-100 mt-1">
            Delivering straight to your hostel building or campus spot at {settings.universityName}!
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-4">
          
          {/* Order Summary Mini List */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs space-y-2">
            <div className="font-bold text-stone-800 flex justify-between">
              <span>Order Summary ({cart.length} items):</span>
              <span className="text-rose-600 font-black text-sm">Total: ₹{total}</span>
            </div>
            <div className="flex overflow-x-auto gap-2 py-1 no-scrollbar">
              {cart.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 flex items-center gap-2 bg-white p-1.5 rounded-xl border border-stone-200 max-w-[200px]">
                  <img src={item.product.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div className="truncate">
                    <div className="font-bold text-stone-900 truncate">{item.product.name}</div>
                    <div className="text-[10px] text-stone-500">Qty: {item.quantity} • ₹{item.product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-rose-500">*</span> Full Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-rose-500">*</span> Phone / WhatsApp:
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Dynamic Campus Delivery Location Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Campus Delivery Location:
              </label>
              <select
                value={dormOrBuilding}
                onChange={(e) => setDormOrBuilding(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 outline-none"
              >
                {settings.campusDeliveryLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                <span className="text-rose-500">*</span> Room No. / Pickup Spot Details:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Room 304 or Library Fountain Bench"
                value={roomOrSpot}
                onChange={(e) => setRoomOrSpot(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-stone-400" />
              Payment Method:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI / GPay')}
                className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                  paymentMethod === 'UPI / GPay'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                📲 UPI / GPay
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Campus Pickup')}
                className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                  paymentMethod === 'Cash on Campus Pickup'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                💵 Cash on Pickup
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all ${
                  paymentMethod === 'Card'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                💳 Debit / Credit
              </button>
            </div>
          </div>

          {/* Dynamic UPI Payment & Verification Section */}
          {paymentMethod === 'UPI / GPay' && (
            <div className="bg-gradient-to-r from-amber-50 to-rose-50 border-2 border-rose-200 rounded-3xl p-5 text-center space-y-4">
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-stone-900">
                <QrCode className="w-4 h-4 text-rose-500" />
                <span>1. Scan & Pay via GPay / PhonePe / Paytm / BHIM</span>
              </div>

              {/* QR Code Display */}
              <div className="bg-white p-3 rounded-2xl shadow-md inline-block border border-stone-200 relative">
                {settings.upiQrImageUrl ? (
                  <img 
                    src={settings.upiQrImageUrl}
                    alt="Store Owner Payment QR Code"
                    className="w-40 h-40 object-contain mx-auto rounded-lg"
                  />
                ) : (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${total}&cu=INR`}
                    alt="UPI Payment QR Code"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                )}
                <span className="absolute bottom-1 right-2 bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-md">
                  ₹{total}
                </span>
              </div>

              {/* Copy UPI ID Bar */}
              <div className="flex items-center justify-center gap-2 max-w-sm mx-auto bg-white p-2 rounded-xl border border-stone-200 text-xs">
                <span className="text-stone-500 text-[11px] font-semibold">UPI ID:</span>
                <span className="font-mono font-black text-stone-900">{activeUpiId}</span>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-2.5 py-1 rounded-lg transition-colors text-[10px] flex items-center gap-1 ml-auto"
                >
                  {upiCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{upiCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* PAYMENT VERIFICATION INPUTS */}
              <div className="bg-white p-4 rounded-2xl border border-rose-200 text-left space-y-3">
                <div className="font-extrabold text-xs text-stone-800 flex items-center justify-between">
                  <span>2. Payment Verification Details:</span>
                  <span className="text-[10px] text-rose-600 font-semibold">*Required for UPI</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Enter 12-Digit UPI UTR Transaction Reference ID:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 425890123456"
                      value={upiUtrInput}
                      onChange={(e) => {
                        setUpiUtrInput(e.target.value);
                        setIsUtrVerified(false);
                      }}
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyUtrFormat}
                      className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                    >
                      Record ID
                    </button>
                  </div>
                </div>

                {/* Screenshot Upload Option */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-rose-500" />
                    Attach Payment Screenshot (Optional):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
                  />
                </div>

                {paymentScreenshotUrl && (
                  <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-xl border border-rose-200 text-xs text-rose-800 font-semibold">
                    <img src={paymentScreenshotUrl} alt="Receipt preview" className="w-10 h-10 rounded-lg object-cover border border-rose-300" />
                    <span>✓ Payment Receipt Screenshot Attached!</span>
                  </div>
                )}

                {isUtrVerified && (
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span>Transaction ID Recorded! Owner will cross-verify with studio bank.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Special Delivery Instructions */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Delivery Timing / Instructions (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Please deliver after 5 PM lectures end!"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Place Order • ₹{total}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
