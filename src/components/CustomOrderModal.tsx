
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Sparkles,
  Send,
  Palette,
  Calendar,
  Image,
  Phone,
  MapPin,
  Calculator,
} from 'lucide-react';

export const CustomOrderModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    createCustomRequest,
    settings,
  } = useStore();

  if (activeModal !== 'customOrder') return null;

  const [studentName, setStudentName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [dormOrBuilding, setDormOrBuilding] = useState<string>('');
  const [itemType, setItemType] = useState<string>(
    'Custom Flower Bouquet'
  );
  const [primaryColor, setPrimaryColor] = useState<string>(
    'Soft Pink & Cream'
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    'Sage Green Leaves'
  );
  const [targetDate, setTargetDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3)
      .toISOString()
      .split('T')[0]
  );
  const [description, setDescription] = useState<string>('');
  const [referenceImageUrl, setReferenceImageUrl] =
    useState<string>('');

  const getEstimatedPrice = () => {
    switch (itemType) {
      case 'Custom Flower Bouquet':
        return 550;
      case 'Custom Amigurumi Mascot':
        return 480;
      case 'Custom Crochet Bag':
        return 750;
      case 'Matching Couple Keychains':
        return 260;
      default:
        return 350;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !studentName.trim() ||
      !phone.trim() ||
      !description.trim()
    ) {
      return;
    }

    createCustomRequest({
      studentName,
      phone,
      dormOrBuilding,
      itemType,
      primaryColor,
      secondaryColor,
      targetDate,
      description,
      referenceImageUrl:
        referenceImageUrl.trim() || undefined,
      quotedPrice: getEstimatedPrice(),
    });

    setActiveModal(null);
  };

  const handleCancel = () => {
    setActiveModal(null);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        p-4
        bg-black/65
        backdrop-blur-sm
        overflow-y-auto
      "
    >
      <div
        className="
          relative
          w-full
          max-w-2xl
          bg-white
          dark:bg-stone-900
          rounded-3xl
          shadow-2xl
          overflow-hidden
          my-8
          max-h-[90vh]
          flex
          flex-col
          border
          border-stone-200
          dark:border-stone-700
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div
          className="
            relative
            p-6
            text-white
            bg-gradient-to-r
            from-rose-600
            via-pink-600
            to-amber-500
          "
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleCancel}
            className="
              absolute
              top-4
              right-4
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-full
              bg-black/20
              hover:bg-black/40
              text-white
              transition-all
              duration-200
              hover:scale-105
            "
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Badge */}
          <div
            className="
              inline-flex
              items-center
              gap-1.5
              bg-white/25
              text-white
              px-3
              py-1
              rounded-full
              text-xs
              font-bold
              mb-3
              backdrop-blur-sm
            "
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Custom Crochet Commission Studio</span>
          </div>

          {/* Heading */}
          <h2
            className="
              text-2xl
              sm:text-3xl
              font-extrabold
              text-white
              pr-10
            "
          >
            Design Your Custom Crochet Gift 🌸
          </h2>

          {/* Description */}
          <p
            className="
              text-xs
              sm:text-sm
              font-medium
              text-white
              opacity-100
              mt-2
              max-w-xl
              leading-relaxed
            "
          >
            Have a unique Pinterest design or personalized
            color palette in mind? Tell us your idea and
            we'll hand-crochet it for you!
          </p>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}
        <form
          onSubmit={handleSubmit}
          className="
            p-6
            overflow-y-auto
            space-y-4
            bg-white
            dark:bg-stone-900
          "
        >
          {/* =====================================================
              CUSTOMER CONTACT DETAILS
          ====================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-stone-800
                  dark:text-stone-100
                  mb-1
                "
              >
                <span className="text-rose-600">*</span>{' '}
                Your Full Name:
              </label>

              <input
                type="text"
                required
                placeholder="e.g. Sanya Sharma"
                value={studentName}
                onChange={(e) =>
                  setStudentName(e.target.value)
                }
                className="
                  w-full
                  bg-stone-50
                  dark:bg-stone-800
                  border
                  border-stone-300
                  dark:border-stone-600
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-xs
                  font-medium
                  text-stone-900
                  dark:text-white
                  placeholder:text-stone-400
                  dark:placeholder:text-stone-500
                  outline-none
                  focus:ring-2
                  focus:ring-rose-400
                  focus:border-rose-400
                  transition-all
                "
              />
            </div>

            {/* Phone */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-stone-800
                  dark:text-stone-100
                  mb-1
                "
              >
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3 text-rose-600" />
                  <span className="text-rose-600">*</span>
                  Phone / WhatsApp:
                </span>
              </label>

              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="
                  w-full
                  bg-stone-50
                  dark:bg-stone-800
                  border
                  border-stone-300
                  dark:border-stone-600
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-xs
                  font-medium
                  text-stone-900
                  dark:text-white
                  placeholder:text-stone-400
                  dark:placeholder:text-stone-500
                  outline-none
                  focus:ring-2
                  focus:ring-rose-400
                  focus:border-rose-400
                  transition-all
                "
              />
            </div>
          </div>

          {/* =====================================================
              PICKUP LOCATION
          ====================================================== */}
          <div>
            <label
              className="
                block
                text-xs
                font-bold
                text-stone-800
                dark:text-stone-100
                mb-1
              "
            >
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-600" />
                Dorm / Campus Pickup Spot:
              </span>
            </label>

            <input
              type="text"
              placeholder={`e.g. Hostel 4 Room 201 or ${settings.pickupLocation}`}
              value={dormOrBuilding}
              onChange={(e) =>
                setDormOrBuilding(e.target.value)
              }
              className="
                w-full
                bg-stone-50
                dark:bg-stone-800
                border
                border-stone-300
                dark:border-stone-600
                rounded-xl
                px-3.5
                py-2.5
                text-xs
                font-medium
                text-stone-900
                dark:text-white
                placeholder:text-stone-400
                dark:placeholder:text-stone-500
                outline-none
                focus:ring-2
                focus:ring-rose-400
                focus:border-rose-400
                transition-all
              "
            />
          </div>

          {/* =====================================================
              ITEM TYPE + DATE
          ====================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Item Type */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-stone-800
                  dark:text-stone-100
                  mb-1
                "
              >
                Item Category:
              </label>

              <select
                value={itemType}
                onChange={(e) =>
                  setItemType(e.target.value)
                }
                className="
                  w-full
                  bg-stone-50
                  dark:bg-stone-800
                  border
                  border-stone-300
                  dark:border-stone-600
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-xs
                  font-semibold
                  text-stone-900
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-rose-400
                  focus:border-rose-400
                  transition-all
                "
              >
                <option value="Custom Flower Bouquet">
                  Custom Flower Bouquet
                </option>

                <option value="Custom Amigurumi Mascot">
                  Custom Amigurumi Mascot / Plushie
                </option>

                <option value="Custom Crochet Bag">
                  Custom Crochet Bag / Tote
                </option>

                <option value="Matching Couple Keychains">
                  Matching Couple Keychains
                </option>

                <option value="Other Special Craft">
                  Other Special Craft
                </option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-stone-800
                  dark:text-stone-100
                  mb-1
                "
              >
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-rose-600" />
                  Needed By Date on Campus:
                </span>
              </label>

              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) =>
                  setTargetDate(e.target.value)
                }
                className="
                  w-full
                  bg-stone-50
                  dark:bg-stone-800
                  border
                  border-stone-300
                  dark:border-stone-600
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-xs
                  font-semibold
                  text-stone-900
                  dark:text-white
                  outline-none
                  focus:ring-2
                  focus:ring-rose-400
                  focus:border-rose-400
                  transition-all
                "
              />
            </div>
          </div>

          {/* =====================================================
              COLOR PREFERENCES
          ====================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-stone-800
                  dark:text-stone-100
                  mb-1
                "
              >
                <span className="inline-flex items-center gap-1">
                  <Palette className="w-3 h-3 text-rose-600" />
                  Primary Yarn Color:
                </span>
              </label>

              <input
                type="text"
                placeholder="e.g. Lavender, Blush Pink, Sun Gold"
                value={primaryColor}
                onChange={(e) =>
                  setPrimaryColor(e.target.value)
                }
                className="
                  w-full
                  bg-stone-50
                  dark:bg-stone-800
                  border
                  border-stone-300
                  dark:border-stone-600
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-xs
                  font-medium
                  text-stone-900
                  dark:text-white
                  placeholder:text-stone-400
                  dark:placeholder:text-stone-500
                  outline-none
                  focus:ring-2
                  focus:ring-rose-400
                  focus:border-rose-400
                  transition-all
                "
              />
            </div>

            {/* Secondary */}
            <div>
              <label
                className="
                  block
                  text-xs
                  font-bold
                  text-stone-800
                  dark:text-stone-100
                  mb-1
                "
              >
                <span className="inline-flex items-center gap-1">
                  <Palette className="w-3 h-3 text-amber-600" />
                  Secondary / Accent Color:
                </span>
              </label>

              <input
                type="text"
                placeholder="e.g. White wrapping, Sage leaves, Gold ribbon"
                value={secondaryColor}
                onChange={(e) =>
                  setSecondaryColor(e.target.value)
                }
                className="
                  w-full
                  bg-stone-50
                  dark:bg-stone-800
                  border
                  border-stone-300
                  dark:border-stone-600
                  rounded-xl
                  px-3.5
                  py-2.5
                  text-xs
                  font-medium
                  text-stone-900
                  dark:text-white
                  placeholder:text-stone-400
                  dark:placeholder:text-stone-500
                  outline-none
                  focus:ring-2
                  focus:ring-rose-400
                  focus:border-rose-400
                  transition-all
                "
              />
            </div>
          </div>

          {/* =====================================================
              DESIGN DETAILS
          ====================================================== */}
          <div>
            <label
              className="
                block
                text-xs
                font-bold
                text-stone-800
                dark:text-stone-100
                mb-1
              "
            >
              <span className="text-rose-600">*</span>{' '}
              Design Details & Special Instructions:
            </label>

            <textarea
              required
              rows={3}
              placeholder="Describe your design, flower stem counts, initial tags, or gift notes in detail..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="
                w-full
                bg-stone-50
                dark:bg-stone-800
                border
                border-stone-300
                dark:border-stone-600
                rounded-xl
                px-3.5
                py-2.5
                text-xs
                font-medium
                text-stone-900
                dark:text-white
                placeholder:text-stone-400
                dark:placeholder:text-stone-500
                outline-none
                resize-y
                focus:ring-2
                focus:ring-rose-400
                focus:border-rose-400
                transition-all
              "
            />
          </div>

          {/* =====================================================
              REFERENCE IMAGE
          ====================================================== */}
          <div>
            <label
              className="
                block
                text-xs
                font-bold
                text-stone-800
                dark:text-stone-100
                mb-1
              "
            >
              <span className="inline-flex items-center gap-1">
                <Image className="w-3 h-3 text-rose-600" />
                Pinterest / Instagram Reference Image
                Link (Optional):
              </span>
            </label>

            <input
              type="url"
              placeholder="https://images.unsplash.com/... or Pinterest link"
              value={referenceImageUrl}
              onChange={(e) =>
                setReferenceImageUrl(e.target.value)
              }
              className="
                w-full
                bg-stone-50
                dark:bg-stone-800
                border
                border-stone-300
                dark:border-stone-600
                rounded-xl
                px-3.5
                py-2.5
                text-xs
                font-medium
                text-stone-900
                dark:text-white
                placeholder:text-stone-400
                dark:placeholder:text-stone-500
                outline-none
                focus:ring-2
                focus:ring-rose-400
                focus:border-rose-400
                transition-all
              "
            />
          </div>

          {/* =====================================================
              PRICE ESTIMATE
          ====================================================== */}
          <div
            className="
              bg-amber-50
              dark:bg-amber-950/40
              border
              border-amber-200
              dark:border-amber-800
              rounded-2xl
              p-4
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div className="flex items-center gap-2">
              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-amber-100
                  dark:bg-amber-900/60
                  flex
                  items-center
                  justify-center
                  text-amber-800
                  dark:text-amber-300
                  flex-shrink-0
                "
              >
                <Calculator className="w-4 h-4" />
              </div>

              <div>
                <div
                  className="
                    text-xs
                    font-bold
                    text-stone-900
                    dark:text-white
                  "
                >
                  Estimated Price Quote
                </div>

                <div
                  className="
                    text-[11px]
                    text-stone-600
                    dark:text-stone-300
                    mt-0.5
                  "
                >
                  Final price confirmed upon review by artist
                </div>
              </div>
            </div>

            <div
              className="
                text-lg
                font-black
                text-amber-800
                dark:text-amber-300
                whitespace-nowrap
              "
            >
              ~₹{getEstimatedPrice()}
            </div>
          </div>

          {/* =====================================================
              ACTION BUTTONS
          ====================================================== */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
            {/* Cancel */}
            <button
              type="button"
              onClick={handleCancel}
              className="
                flex-1
                bg-stone-100
                hover:bg-stone-200
                dark:bg-stone-800
                dark:hover:bg-stone-700
                border
                border-stone-300
                dark:border-stone-600
                text-stone-800
                dark:text-white
                font-bold
                py-3.5
                px-6
                rounded-2xl
                text-sm
                transition-all
                duration-200
                active:scale-[0.98]
              "
            >
              Cancel
            </button>

            {/* Submit */}
            <button
              type="submit"
              className="
                flex-[2]
                bg-gradient-to-r
                from-rose-500
                to-pink-600
                hover:from-rose-600
                hover:to-pink-700
                text-white
                font-bold
                py-3.5
                px-6
                rounded-2xl
                shadow-lg
                shadow-rose-500/20
                flex
                items-center
                justify-center
                gap-2
                text-sm
                transition-all
                duration-200
                active:scale-[0.98]
              "
            >
              <Send className="w-4 h-4 text-white" />
              <span>Submit Custom Commission Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
