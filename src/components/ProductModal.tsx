import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Clock, Check } from 'lucide-react';

/**
 * Returns styling based on the actual color name.
 */
const getColorStyle = (colorName: string, isSelected: boolean) => {
  const color = colorName.toLowerCase().trim();

  let baseStyle = '';

  if (
    color.includes('maroon') ||
    color.includes('burgundy') ||
    color.includes('wine')
  ) {
    baseStyle = 'bg-[#800000] border-[#660000] text-white';
  } else if (
    color.includes('red') ||
    color.includes('crimson') ||
    color.includes('scarlet')
  ) {
    baseStyle = 'bg-red-500 border-red-600 text-white';
  } else if (
    color.includes('pink') ||
    color.includes('rose') ||
    color.includes('blush')
  ) {
    baseStyle = 'bg-pink-400 border-pink-500 text-white';
  } else if (
    color.includes('orange') ||
    color.includes('peach') ||
    color.includes('coral')
  ) {
    baseStyle = 'bg-orange-400 border-orange-500 text-white';
  } else if (
    color.includes('yellow') ||
    color.includes('mustard')
  ) {
    baseStyle = 'bg-yellow-300 border-yellow-500 text-stone-900';
  } else if (
    color.includes('green') ||
    color.includes('olive') ||
    color.includes('mint') ||
    color.includes('sage')
  ) {
    baseStyle = 'bg-green-500 border-green-600 text-white';
  } else if (
    color.includes('blue') ||
    color.includes('navy') ||
    color.includes('sky')
  ) {
    baseStyle = 'bg-blue-500 border-blue-600 text-white';
  } else if (
    color.includes('purple') ||
    color.includes('violet') ||
    color.includes('lavender')
  ) {
    baseStyle = 'bg-purple-500 border-purple-600 text-white';
  } else if (
    color.includes('brown') ||
    color.includes('chocolate') ||
    color.includes('coffee')
  ) {
    baseStyle = 'bg-amber-800 border-amber-900 text-white';
  } else if (
    color.includes('black') ||
    color.includes('charcoal')
  ) {
    baseStyle = 'bg-black border-stone-700 text-white';
  } else if (
    color.includes('white') ||
    color.includes('ivory') ||
    color.includes('cream')
  ) {
    baseStyle = 'bg-white border-stone-300 text-stone-800';
  } else if (
    color.includes('gray') ||
    color.includes('grey') ||
    color.includes('silver')
  ) {
    baseStyle = 'bg-gray-400 border-gray-500 text-white';
  } else if (
    color.includes('beige') ||
    color.includes('tan')
  ) {
    baseStyle = 'bg-[#D8C3A5] border-[#B8A184] text-stone-800';
  } else if (
    color.includes('teal') ||
    color.includes('turquoise')
  ) {
    baseStyle = 'bg-teal-500 border-teal-600 text-white';
  } else if (color.includes('gold')) {
    baseStyle = 'bg-yellow-500 border-yellow-600 text-white';
  } else {
    baseStyle = 'bg-stone-100 border-stone-300 text-stone-700';
  }

  return `${baseStyle} ${
    isSelected
      ? 'ring-2 ring-rose-500 ring-offset-1 shadow-md scale-[1.02]'
      : 'hover:scale-[1.02] hover:shadow-sm'
  }`;
};

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setActiveModal,
    addToCart,
    reviews,
    addReview,
    isDarkMode,
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);

  const [selectedColor, setSelectedColor] =
    useState<string>('Default');

  const [giftNote, setGiftNote] = useState<string>('');

  const [activeTab, setActiveTab] =
    useState<'details' | 'reviews'>('details');

  const [reviewerName, setReviewerName] =
    useState<string>('');

  const [ratingVal, setRatingVal] =
    useState<number>(5);

  const [reviewComment, setReviewComment] =
    useState<string>('');

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(1);

      setSelectedColor(
        selectedProduct.colorsAvailable[0] || 'Default'
      );

      setGiftNote('');
      setActiveTab('details');
      setReviewerName('');
      setRatingVal(5);
      setReviewComment('');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const productReviews = reviews.filter(
    r => r.productName === selectedProduct.name
  );

  const handleAddToCart = () => {
    addToCart(
      selectedProduct,
      quantity,
      selectedColor,
      undefined,
      giftNote
    );

    setSelectedProduct(null);
    setActiveModal(null);
  };

  const handleReviewSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !reviewerName.trim() ||
      !reviewComment.trim()
    ) {
      return;
    }

    addReview({
      productName: selectedProduct.name,
      customerName: reviewerName,
      rating: ratingVal,
      comment: reviewComment,
    });

    setReviewerName('');
    setReviewComment('');
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        w-full
        h-full
        max-w-[100vw]
        overflow-hidden
        bg-stone-900/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-2
        sm:p-4
      "
    >
      {/* =====================================================
          MODAL
      ====================================================== */}

      <div
        className={`
          relative
          w-full
          max-w-4xl
          max-h-[96dvh]
          sm:max-h-[92vh]
          rounded-2xl
          sm:rounded-3xl
          shadow-2xl
          overflow-hidden
          flex
          flex-col
          md:flex-row
          border
          min-w-0

          ${
            isDarkMode
              ? 'bg-stone-900 text-stone-100 border-stone-700'
              : 'bg-white text-stone-900 border-stone-200'
          }
        `}
      >
        {/* =====================================================
            CLOSE BUTTON
        ====================================================== */}

        <button
          onClick={() => {
            setSelectedProduct(null);
            setActiveModal(null);
          }}
          className={`
            absolute
            top-2
            right-2
            sm:top-4
            sm:right-4
            z-30
            p-2
            rounded-full
            shadow-md
            backdrop-blur-md
            transition-all

            ${
              isDarkMode
                ? 'bg-stone-800/95 text-stone-200 hover:bg-stone-700'
                : 'bg-white/95 text-stone-700 hover:bg-stone-100'
            }
          `}
          aria-label="Close product"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =====================================================
            LEFT IMAGE SECTION
        ====================================================== */}

        <div
          className={`
            relative
            w-full
            md:w-1/2
            flex-shrink-0
            h-[260px]
            sm:h-[340px]
            md:h-auto
            md:min-h-[500px]
            overflow-hidden
            min-w-0

            ${
              isDarkMode
                ? 'bg-stone-800'
                : 'bg-white'
            }
          `}
        >
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            className="
              block
              w-full
              h-full
              object-cover
              object-center
              max-w-full
            "
          />

          {/* IMAGE INFORMATION */}

          <div
            className={`
              absolute
              bottom-2
              left-2
              right-2
              sm:bottom-4
              sm:left-4
              sm:right-4
              backdrop-blur-md
              rounded-xl
              sm:rounded-2xl
              p-2
              sm:p-3
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-2
              border
              shadow-lg
              min-w-0

              ${
                isDarkMode
                  ? 'bg-stone-900/90 border-stone-700'
                  : 'bg-white/95 border-stone-200'
              }
            `}
          >
            {/* LEAD TIME */}

            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-4 h-4 text-rose-500 flex-shrink-0" />

              <span
                className={`
                  text-[10px]
                  sm:text-xs
                  font-semibold
                  truncate

                  ${
                    isDarkMode
                      ? 'text-stone-200'
                      : 'text-stone-700'
                  }
                `}
              >
                Hand-Knitted in ~
                {selectedProduct.leadTimeDays} Days
              </span>
            </div>

            {/* STOCK */}

            <span
              className={`
                self-start
                sm:self-auto
                flex-shrink-0
                text-[10px]
                sm:text-xs
                font-bold
                px-2.5
                py-1
                rounded-full
                whitespace-nowrap

                ${
                  selectedProduct.stock > 0
                    ? isDarkMode
                      ? 'text-emerald-300 bg-emerald-950/60'
                      : 'text-emerald-700 bg-emerald-50'
                    : isDarkMode
                      ? 'text-red-300 bg-red-950/60'
                      : 'text-red-700 bg-red-50'
                }
              `}
            >
              {selectedProduct.stock > 0
                ? `In Stock (${selectedProduct.stock})`
                : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* =====================================================
            RIGHT CONTENT
        ====================================================== */}

        <div
          className={`
            w-full
            md:w-1/2
            min-w-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-4
            sm:p-6
            md:p-8
            flex
            flex-col

            ${
              isDarkMode
                ? 'bg-stone-900'
                : 'bg-white'
            }
          `}
        >
          <div className="w-full min-w-0">

            {/* CATEGORY + RATING */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
                mb-2
                min-w-0
                pr-8
              "
            >
              <span
                className={`
                  text-[10px]
                  sm:text-xs
                  font-bold
                  px-2.5
                  py-1
                  rounded-full
                  uppercase
                  tracking-wider
                  max-w-full
                  truncate

                  ${
                    isDarkMode
                      ? 'text-rose-300 bg-rose-950/60'
                      : 'text-rose-600 bg-rose-50'
                  }
                `}
              >
                {selectedProduct.category}
              </span>

              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold flex-shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

                <span>
                  {selectedProduct.rating.toFixed(1)}
                </span>

                <span
                  className={
                    isDarkMode
                      ? 'text-stone-500'
                      : 'text-stone-400'
                  }
                >
                  ({selectedProduct.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* PRODUCT NAME */}

            <h2
              className={`
                text-xl
                sm:text-2xl
                md:text-3xl
                font-extrabold
                mb-2
                break-words
                min-w-0
                pr-6

                ${
                  isDarkMode
                    ? 'text-white'
                    : 'text-stone-900'
                }
              `}
            >
              {selectedProduct.name}
            </h2>

            {/* PRICE */}

            <div
              className="
                flex
                flex-wrap
                items-baseline
                gap-x-2
                gap-y-1
                mb-4
                min-w-0
              "
            >
              <span className="text-2xl font-black text-rose-600 flex-shrink-0">
                ₹{selectedProduct.price}
              </span>

              {selectedProduct.originalPrice && (
                <span className="text-stone-400 line-through text-sm flex-shrink-0">
                  ₹{selectedProduct.originalPrice}
                </span>
              )}

              <span
                className={`
                  text-[10px]
                  sm:text-xs
                  ml-0
                  sm:ml-2
                  break-words

                  ${
                    isDarkMode
                      ? 'text-stone-400'
                      : 'text-stone-500'
                  }
                `}
              >
                Inclusive of all campus delivery taxes
              </span>
            </div>

            {/* =====================================================
                TABS
            ====================================================== */}

            <div
              className={`
                flex
                overflow-x-auto
                no-scrollbar
                border-b
                mb-4
                min-w-0
                gap-5

                ${
                  isDarkMode
                    ? 'border-stone-700'
                    : 'border-stone-200'
                }
              `}
            >
              <button
                onClick={() => setActiveTab('details')}
                className={`
                  flex-shrink-0
                  pb-2
                  text-xs
                  sm:text-sm
                  font-bold
                  border-b-2
                  transition-all
                  whitespace-nowrap

                  ${
                    activeTab === 'details'
                      ? 'border-rose-500 text-rose-600'
                      : isDarkMode
                        ? 'border-transparent text-stone-500 hover:text-stone-200'
                        : 'border-transparent text-stone-400 hover:text-stone-600'
                  }
                `}
              >
                Customization & Details
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`
                  flex-shrink-0
                  pb-2
                  text-xs
                  sm:text-sm
                  font-bold
                  border-b-2
                  transition-all
                  whitespace-nowrap

                  ${
                    activeTab === 'reviews'
                      ? 'border-rose-500 text-rose-600'
                      : isDarkMode
                        ? 'border-transparent text-stone-500 hover:text-stone-200'
                        : 'border-transparent text-stone-400 hover:text-stone-600'
                  }
                `}
              >
                Customer Reviews ({productReviews.length})
              </button>
            </div>

            {/* =====================================================
                DETAILS TAB
            ====================================================== */}

            {activeTab === 'details' ? (
              <div className="space-y-4 min-w-0">

                {/* DESCRIPTION */}

                <p
                  className={`
                    text-sm
                    leading-relaxed
                    break-words
                    min-w-0

                    ${
                      isDarkMode
                        ? 'text-stone-300'
                        : 'text-stone-600'
                    }
                  `}
                >
                  {selectedProduct.description}
                </p>

                {/* COLOR SELECTION */}

                <div className="min-w-0">
                  <label
                    className={`
                      block
                      text-[10px]
                      sm:text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      mb-2

                      ${
                        isDarkMode
                          ? 'text-stone-200'
                          : 'text-stone-800'
                      }
                    `}
                  >
                    Select Yarn Color Variant:
                  </label>

                  <div className="flex flex-wrap gap-2 min-w-0">
                    {selectedProduct.colorsAvailable.map(
                      color => {
                        const isSelected =
                          selectedColor === color;

                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() =>
                              setSelectedColor(color)
                            }
                            className={`
                              px-3
                              py-1.5
                              rounded-xl
                              text-xs
                              font-semibold
                              border
                              transition-all
                              flex
                              items-center
                              gap-1.5
                              max-w-full
                              min-w-0

                              ${getColorStyle(
                                color,
                                isSelected
                              )}
                            `}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 flex-shrink-0" />
                            )}

                            <span className="truncate">
                              {color}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* GIFT NOTE */}

                <div className="min-w-0">
                  <label
                    className={`
                      block
                      text-[10px]
                      sm:text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      mb-1

                      ${
                        isDarkMode
                          ? 'text-stone-200'
                          : 'text-stone-800'
                      }
                    `}
                  >
                    Free Gift Message Card (Optional):
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Happy Birthday Riya! Best roomie ever 💕"
                    value={giftNote}
                    onChange={e =>
                      setGiftNote(e.target.value)
                    }
                    className={`
                      w-full
                      max-w-full
                      min-w-0
                      border
                      rounded-xl
                      px-3
                      py-2
                      text-xs
                      focus:outline-none
                      focus:ring-2
                      focus:ring-rose-400

                      ${
                        isDarkMode
                          ? 'bg-stone-800 border-stone-700 text-white placeholder:text-stone-500'
                          : 'bg-white border-stone-300 text-stone-900 placeholder:text-stone-400'
                      }
                    `}
                  />
                </div>

                {/* PRODUCT HIGHLIGHTS */}

                <div
                  className={`
                    rounded-2xl
                    p-3
                    border
                    text-xs
                    space-y-1
                    min-w-0
                    overflow-hidden

                    ${
                      isDarkMode
                        ? 'bg-amber-950/30 border-amber-900/50 text-stone-300'
                        : 'bg-amber-50/60 border-amber-100 text-stone-700'
                    }
                  `}
                >
                  <div
                    className={`
                      font-bold
                      mb-1

                      ${
                        isDarkMode
                          ? 'text-amber-300'
                          : 'text-amber-900'
                      }
                    `}
                  >
                    Product Highlights:
                  </div>

                  {selectedProduct.features.map(
                    (feat, idx) => (
                      <div
                        key={idx}
                        className="
                          flex
                          items-start
                          gap-1.5
                          min-w-0
                        "
                      >
                        <span className="text-amber-500 flex-shrink-0">
                          ✦
                        </span>

                        <span className="break-words min-w-0">
                          {feat}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (

              /* =====================================================
                  REVIEWS TAB
              ====================================================== */

              <div
                className="
                  space-y-4
                  max-h-[300px]
                  overflow-y-auto
                  overflow-x-hidden
                  pr-1
                  min-w-0
                "
              >
                {productReviews.length === 0 ? (
                  <p
                    className={`
                      text-xs
                      italic

                      ${
                        isDarkMode
                          ? 'text-stone-500'
                          : 'text-stone-400'
                      }
                    `}
                  >
                    No reviews yet for this product. Be the first
                    student to review!
                  </p>
                ) : (
                  productReviews.map(rev => (
                    <div
                      key={rev.id}
                      className={`
                        rounded-2xl
                        p-3
                        border
                        text-xs
                        min-w-0
                        overflow-hidden

                        ${
                          isDarkMode
                            ? 'bg-stone-800 border-stone-700'
                            : 'bg-white border-stone-200'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 min-w-0">
                        <span
                          className={`
                            font-bold
                            truncate

                            ${
                              isDarkMode
                                ? 'text-stone-100'
                                : 'text-stone-800'
                            }
                          `}
                        >
                          {rev.customerName}
                        </span>

                        <span className="text-amber-500 font-bold flex-shrink-0">
                          ★ {rev.rating}/5
                        </span>
                      </div>

                      <p
                        className={`
                          text-[11px]
                          mb-1
                          break-words

                          ${
                            isDarkMode
                              ? 'text-stone-300'
                              : 'text-stone-600'
                          }
                        `}
                      >
                        {rev.comment}
                      </p>

                      <span
                        className={`
                          text-[10px]

                          ${
                            isDarkMode
                              ? 'text-stone-500'
                              : 'text-stone-400'
                          }
                        `}
                      >
                        {rev.date} • Verified Student
                      </span>
                    </div>
                  ))
                )}

                {/* REVIEW FORM */}

                <form
                  onSubmit={handleReviewSubmit}
                  className={`
                    pt-3
                    border-t
                    space-y-2
                    min-w-0

                    ${
                      isDarkMode
                        ? 'border-stone-700'
                        : 'border-stone-200'
                    }
                  `}
                >
                  <div
                    className={`
                      font-bold
                      text-xs

                      ${
                        isDarkMode
                          ? 'text-stone-200'
                          : 'text-stone-800'
                      }
                    `}
                  >
                    Leave a Student Review:
                  </div>

                  <input
                    type="text"
                    placeholder="Your Name & Hostel"
                    value={reviewerName}
                    onChange={e =>
                      setReviewerName(e.target.value)
                    }
                    className={`
                      w-full
                      max-w-full
                      min-w-0
                      border
                      rounded-xl
                      px-3
                      py-1.5
                      text-xs
                      outline-none
                      focus:border-rose-400

                      ${
                        isDarkMode
                          ? 'bg-stone-800 border-stone-700 text-white placeholder:text-stone-500'
                          : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400'
                      }
                    `}
                    required
                  />

                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        text-xs

                        ${
                          isDarkMode
                            ? 'text-stone-400'
                            : 'text-stone-500'
                        }
                      `}
                    >
                      Rating:
                    </span>

                    <select
                      value={ratingVal}
                      onChange={e =>
                        setRatingVal(
                          Number(e.target.value)
                        )
                      }
                      className={`
                        border
                        rounded-lg
                        px-2
                        py-1
                        text-xs
                        max-w-full

                        ${
                          isDarkMode
                            ? 'bg-stone-800 border-stone-700 text-white'
                            : 'bg-white border-stone-200 text-stone-900'
                        }
                      `}
                    >
                      <option value={5}>
                        5 ★★★★★
                      </option>

                      <option value={4}>
                        4 ★★★★☆
                      </option>

                      <option value={3}>
                        3 ★★★☆☆
                      </option>
                    </select>
                  </div>

                  <textarea
                    placeholder="Write your review comments..."
                    value={reviewComment}
                    onChange={e =>
                      setReviewComment(e.target.value)
                    }
                    className={`
                      w-full
                      max-w-full
                      min-w-0
                      border
                      rounded-xl
                      px-3
                      py-1.5
                      text-xs
                      outline-none
                      focus:border-rose-400
                      h-16
                      resize-none

                      ${
                        isDarkMode
                          ? 'bg-stone-800 border-stone-700 text-white placeholder:text-stone-500'
                          : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400'
                      }
                    `}
                    required
                  />

                  <button
                    type="submit"
                    className={`
                      w-full
                      text-white
                      text-xs
                      font-bold
                      py-2
                      rounded-xl
                      transition-colors

                      ${
                        isDarkMode
                          ? 'bg-stone-700 hover:bg-stone-600'
                          : 'bg-stone-900 hover:bg-stone-800'
                      }
                    `}
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* =====================================================
              BOTTOM ACTION BAR
          ====================================================== */}

          <div
            className={`
              pt-4
              mt-6
              flex
              flex-col
              sm:flex-row
              items-stretch
              sm:items-center
              gap-3
              border-t
              min-w-0

              ${
                isDarkMode
                  ? 'border-stone-700'
                  : 'border-stone-200'
              }
            `}
          >
            {/* QUANTITY */}

            <div
              className={`
                flex
                items-center
                justify-center
                border
                rounded-2xl
                p-1
                flex-shrink-0
                self-start

                ${
                  isDarkMode
                    ? 'border-stone-700 bg-stone-800'
                    : 'border-stone-300 bg-white'
                }
              `}
            >
              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    Math.max(1, quantity - 1)
                  )
                }
                className={`
                  w-8
                  h-8
                  rounded-xl
                  font-bold
                  flex
                  items-center
                  justify-center
                  transition-colors

                  ${
                    isDarkMode
                      ? 'bg-stone-700 hover:bg-stone-600 text-white'
                      : 'bg-white hover:bg-stone-100 text-stone-700'
                  }
                `}
              >
                -
              </button>

              <span
                className={`
                  w-10
                  text-center
                  font-extrabold
                  text-sm

                  ${
                    isDarkMode
                      ? 'text-white'
                      : 'text-stone-900'
                  }
                `}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                className={`
                  w-8
                  h-8
                  rounded-xl
                  font-bold
                  flex
                  items-center
                  justify-center
                  transition-colors

                  ${
                    isDarkMode
                      ? 'bg-stone-700 hover:bg-stone-600 text-white'
                      : 'bg-white hover:bg-stone-100 text-stone-700'
                  }
                `}
              >
                +
              </button>
            </div>

            {/* ADD TO CART */}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedProduct.stock <= 0}
              className={`
                w-full
                sm:flex-1
                min-w-0
                font-bold
                text-sm
                py-3
                px-4
                sm:px-6
                rounded-2xl
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                transition-all
                overflow-hidden

                ${
                  selectedProduct.stock <= 0
                    ? isDarkMode
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/20 active:scale-95'
                }
              `}
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />

              <span className="truncate">
                {selectedProduct.stock <= 0
                  ? 'Out of Stock'
                  : `Add to Cart • ₹${
                      selectedProduct.price *
                      quantity
                    }`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};