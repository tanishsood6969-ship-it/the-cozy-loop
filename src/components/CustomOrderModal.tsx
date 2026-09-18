import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Sparkles, Send, Palette, Calendar, Image, Phone, MapPin, Calculator } from 'lucide-react';

export const CustomOrderModal: React.FC = () => {
  const { activeModal, setActiveModal, createCustomRequest, settings } = useStore();

  if (activeModal !== 'customOrder') return null;

  const [studentName, setStudentName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [dormOrBuilding, setDormOrBuilding] = useState<string>('');
  const [itemType, setItemType] = useState<string>('Custom Flower Bouquet');
  const [primaryColor, setPrimaryColor] = useState<string>('Soft Pink & Cream');
  const [secondaryColor, setSecondaryColor] = useState<string>('Sage Green Leaves');
  const [targetDate, setTargetDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState<string>('');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('');

  // Estimate price dynamically
  const getEstimatedPrice = () => {
    switch (itemType) {
      case 'Custom Flower Bouquet': return 550;
      case 'Custom Amigurumi Mascot': return 480;
      case 'Custom Crochet Bag': return 750;
      case 'Matching Couple Keychains': return 260;
      default: return 350;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || !description.trim()) return;

    createCustomRequest({
      studentName,
      phone,
      dormOrBuilding,
      itemType,
      primaryColor,
      secondaryColor,
      targetDate,
      description,
      referenceImageUrl: referenceImageUrl.trim() || undefined,
      quotedPrice: getEstimatedPrice()
    });

    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="yarn-gradient-rose p-6 text-white relative">
          <button
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Crochet Commission Studio</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Design Your Custom Crochet Gift 🌸
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-1">
            Have a unique Pinterest design or personalized color palette in mind? Tell us your idea and we'll hand-crochet it for you!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Customer Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <span className="text-rose-500">*</span> Your Full Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sanya Sharma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-rose-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-stone-400" />
                <span className="text-rose-500">*</span> Phone / WhatsApp:
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-rose-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              Dorm / Campus Pickup Spot:
            </label>
            <input
              type="text"
              placeholder={`e.g. Hostel 4 Room 201 or ${settings.pickupLocation}`}
              value={dormOrBuilding}
              onChange={(e) => setDormOrBuilding(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-rose-300 outline-none"
            />
          </div>

          {/* Item Type & Delivery Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Item Category:
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 outline-none"
              >
                <option value="Custom Flower Bouquet">Custom Flower Bouquet</option>
                <option value="Custom Amigurumi Mascot">Custom Amigurumi Mascot / Plushie</option>
                <option value="Custom Crochet Bag">Custom Crochet Bag / Tote</option>
                <option value="Matching Couple Keychains">Matching Couple Keychains</option>
                <option value="Other Special Craft">Other Special Craft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                Needed By Date on Campus:
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-800 outline-none"
              />
            </div>
          </div>

          {/* Color Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-rose-500" /> Primary Yarn Color:
              </label>
              <input
                type="text"
                placeholder="e.g. Lavender, Blush Pink, Sun Gold"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-500" /> Secondary / Accent Color:
              </label>
              <input
                type="text"
                placeholder="e.g. White wrapping, Sage leaves, Gold ribbon"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-none"
              />
            </div>
          </div>

          {/* Detailed Instructions */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              <span className="text-rose-500">*</span> Design Details & Special Instructions:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe your design, flower stem counts, initial tags, or gift notes in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          {/* Optional Reference Image Link */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Image className="w-3 h-3 text-stone-400" />
              Pinterest / Instagram Reference Image Link (Optional):
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or Pinterest link"
              value={referenceImageUrl}
              onChange={(e) => setReferenceImageUrl(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs outline-none"
            />
          </div>

          {/* Price Estimate Card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Estimated Price Quote</div>
                <div className="text-[11px] text-stone-500">Final price confirmed upon review by artist</div>
              </div>
            </div>
            <div className="text-lg font-black text-amber-900">
              ~₹{getEstimatedPrice()}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Custom Commission Request</span>
          </button>
        </form>
      </div>
    </div>
  );
};
