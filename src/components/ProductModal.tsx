import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Clock, Check } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    setActiveModal, 
    addToCart, 
    reviews, 
    addReview 
  } = useStore();

  if (!selectedProduct) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(selectedProduct.colorsAvailable[0] || 'Default');
  const [wrapPaperColor, setWrapPaperColor] = useState<string>('Rustic Kraft Paper');
  const [giftNote, setGiftNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // New review state
  const [reviewerName, setReviewerName] = useState<string>('');
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  const productReviews = reviews.filter(r => r.productName === selectedProduct.name);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedColor, wrapPaperColor, giftNote);
    setSelectedProduct(null);
    setActiveModal(null);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview({
      productName: selectedProduct.name,
      customerName: reviewerName,
      rating: ratingVal,
      comment: reviewComment
    });

    setReviewerName('');
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Modal Button */}
        <button
          onClick={() => {
            setSelectedProduct(null);
            setActiveModal(null);
          }}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-stone-700 p-2 rounded-full shadow-md backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side Image Banner */}
        <div className="md:w-1/2 relative bg-stone-100 min-h-[300px] md:min-h-[500px]">
          <img 
            src={selectedProduct.imageUrl} 
            alt={selectedProduct.name}
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-white/60 shadow-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-semibold text-stone-700">
                Hand-Knitted in ~{selectedProduct.leadTimeDays} Days
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock})` : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Right Side Content & Customizer */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Header Category & Title */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {selectedProduct.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating.toFixed(1)}</span>
                <span className="text-stone-400">({selectedProduct.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              {selectedProduct.name}
            </h2>

            {/* Price Header */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-black text-rose-600">₹{selectedProduct.price}</span>
              {selectedProduct.originalPrice && (
                <span className="text-stone-400 line-through text-sm">₹{selectedProduct.originalPrice}</span>
              )}
              <span className="text-xs text-stone-500 ml-2">Inclusive of all campus delivery taxes</span>
            </div>

            {/* Tabs for Details vs Reviews */}
            <div className="flex border-b border-stone-200 mb-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 text-sm font-bold border-b-2 mr-6 transition-all ${
                  activeTab === 'details'
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                Customization & Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'reviews'
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                Customer Reviews ({productReviews.length})
              </button>
            </div>

            {activeTab === 'details' ? (
              <div className="space-y-4">
                <p className="text-stone-600 text-sm leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Color Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                    Select Yarn Color Variant:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colorsAvailable.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          selectedColor === color
                            ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {selectedColor === color && <Check className="w-3 h-3 text-rose-600" />}
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wrapping Option for Bouquets */}
                {selectedProduct.category === 'Bouquets' || selectedProduct.category === 'Flower Stems' ? (
                  <div>
                    <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                      Gift Wrapping Preference:
                    </label>
                    <select
                      value={wrapPaperColor}
                      onChange={(e) => setWrapPaperColor(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-200"
                    >
                      <option value="Rustic Kraft Paper">Vintage Rustic Kraft Paper (Default)</option>
                      <option value="Pastel Pink Wrapping">Blush Pastel Pink Wrapping</option>
                      <option value="Lavender Purple Wrapping">Soft Lavender Purple Wrapping</option>
                      <option value="Clear Minimalist Wrap">Clear Minimalist Flower Sleeve</option>
                    </select>
                  </div>
                ) : null}

                {/* Optional Custom Gift Note */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                    Free Gift Message Card (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Happy Birthday Riya! Best roomie ever 💕"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                {/* Features Bullet List */}
                <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-100 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-amber-900 mb-1">Product Highlights:</div>
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-amber-500">✦</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Reviews Thread */
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">No reviews yet for this product. Be the first student to review!</p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-800">{rev.customerName}</span>
                        <span className="text-amber-500 font-bold">★ {rev.rating}/5</span>
                      </div>
                      <p className="text-stone-600 text-[11px] mb-1">{rev.comment}</p>
                      <span className="text-[10px] text-stone-400">{rev.date} • Verified Student</span>
                    </div>
                  ))
                )}

                {/* Leave a review Form */}
                <form onSubmit={handleReviewSubmit} className="pt-3 border-t border-stone-200 space-y-2">
                  <div className="font-bold text-xs text-stone-800">Leave a Student Review:</div>
                  <input 
                    type="text"
                    placeholder="Your Name & Hostel"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-rose-400"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Rating:</span>
                    <select
                      value={ratingVal}
                      onChange={(e) => setRatingVal(Number(e.target.value))}
                      className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs"
                    >
                      <option value={5}>5 ★★★★★</option>
                      <option value={4}>4 ★★★★☆</option>
                      <option value={3}>3 ★★★☆☆</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Write your review comments..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-rose-400 h-16"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-stone-900 text-white text-xs font-bold py-2 rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Action Bar: Quantity & Add to Cart */}
          <div className="pt-4 border-t border-stone-200 mt-6 flex items-center gap-3">
            <div className="flex items-center border border-stone-200 rounded-2xl bg-stone-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center font-extrabold text-sm text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedProduct.stock <= 0}
              className={`flex-1 font-bold text-sm py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all ${
                selectedProduct.stock <= 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-200 active:scale-95'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{selectedProduct.stock <= 0 ? 'Out of Stock' : `Add to Cart • ₹${selectedProduct.price * quantity}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
