import React from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Star,
  ShoppingBag,
  Eye,
  Clock
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

/**
 * Returns styling based on the color name.
 * This makes each color option visually match its label.
 */
const getColorStyle = (colorName: string) => {
  const color = colorName.toLowerCase().trim();

  if (
    color.includes('red') ||
    color.includes('crimson') ||
    color.includes('scarlet')
  ) {
    return 'bg-red-500 border-red-600 text-white';
  }

  if (
    color.includes('pink') ||
    color.includes('rose') ||
    color.includes('blush')
  ) {
    return 'bg-pink-400 border-pink-500 text-white';
  }

  if (
    color.includes('orange') ||
    color.includes('peach') ||
    color.includes('coral')
  ) {
    return 'bg-orange-400 border-orange-500 text-white';
  }

  if (
    color.includes('yellow') ||
    color.includes('mustard')
  ) {
    return 'bg-yellow-300 border-yellow-500 text-stone-900';
  }

  if (
    color.includes('green') ||
    color.includes('olive') ||
    color.includes('mint') ||
    color.includes('sage')
  ) {
    return 'bg-green-500 border-green-600 text-white';
  }

  if (
    color.includes('blue') ||
    color.includes('navy') ||
    color.includes('sky')
  ) {
    return 'bg-blue-500 border-blue-600 text-white';
  }

  if (
    color.includes('purple') ||
    color.includes('violet') ||
    color.includes('lavender')
  ) {
    return 'bg-purple-500 border-purple-600 text-white';
  }

  if (
    color.includes('brown') ||
    color.includes('chocolate') ||
    color.includes('coffee')
  ) {
    return 'bg-amber-800 border-amber-900 text-white';
  }

  if (
    color.includes('black') ||
    color.includes('charcoal')
  ) {
    return 'bg-black border-stone-700 text-white';
  }

  if (
    color.includes('white') ||
    color.includes('ivory') ||
    color.includes('cream')
  ) {
    return 'bg-white border-stone-300 text-stone-800';
  }

  if (
    color.includes('gray') ||
    color.includes('grey') ||
    color.includes('silver')
  ) {
    return 'bg-gray-400 border-gray-500 text-white';
  }

  if (
    color.includes('beige') ||
    color.includes('tan')
  ) {
    return 'bg-[#D8C3A5] border-[#B8A184] text-stone-800';
  }

  if (
    color.includes('teal') ||
    color.includes('turquoise')
  ) {
    return 'bg-teal-500 border-teal-600 text-white';
  }

  if (color.includes('gold')) {
    return 'bg-yellow-500 border-yellow-600 text-white';
  }

  return 'bg-stone-100 border-stone-300 text-stone-700';
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  const {
    products,
    addToCart,
    setSelectedProduct,
    setActiveModal
  } = useStore();

  /*
   * Always use the newest version of the product
   * from StoreContext.
   */
  const latestProduct =
    products.find(
      p => p.id === product.id
    ) || product;

  /*
   * Opens the product drawer.
   */
  const handleCardClick = () => {
    setSelectedProduct(latestProduct);
    setActiveModal('product');
  };

  const isOutOfStock =
    latestProduct.stock <= 0;

  const isLowStock =
    latestProduct.stock > 0 &&
    latestProduct.stock <= 5;

  const currentRating =
    Number(latestProduct.rating ?? 0);

  const currentReviewCount =
    Number(latestProduct.reviewCount ?? 0);

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="
        group
        glass-card
        rounded-3xl
        overflow-hidden
        transition-all
        duration-300
        hover:shadow-xl
        hover:-translate-y-1
        flex
        flex-col
        justify-between
        border
        border-[var(--border-color)]
        cursor-pointer
      "
    >
      {/* Product Image Container */}
      <div
        className="
          relative
          aspect-[3/4]
          w-full
          overflow-hidden
          bg-stone-100
          dark:bg-stone-900
        "
      >
        <img
          src={latestProduct.cardImageUrl || latestProduct.imageUrl}
          alt={latestProduct.name}
          className="
            w-full
            h-full
            object-cover
            object-center
            group-hover:scale-105
            transition-transform
            duration-500
          "
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="
          absolute
          top-3
          left-3
          flex
          flex-col
          gap-1.5
          items-start
        ">
          {latestProduct.isPopular && (
            <span className="
              bg-rose-500
              text-white
              font-bold
              text-[10px]
              sm:text-xs
              px-2.5
              py-1
              rounded-full
              shadow-sm
            ">
              ✨ Bestseller
            </span>
          )}

          {latestProduct.isNew && (
            <span className="
              bg-amber-400
              text-stone-900
              font-bold
              text-[10px]
              sm:text-xs
              px-2.5
              py-1
              rounded-full
              shadow-sm
            ">
              🌟 New Arrival
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="
          absolute
          top-3
          right-3
        ">
          {isOutOfStock ? (
            <span className="
              bg-stone-900/90
              text-stone-200
              font-semibold
              text-[10px]
              sm:text-xs
              px-2.5
              py-1
              rounded-full
              backdrop-blur-sm
            ">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="
              bg-amber-500
              text-white
              font-semibold
              text-[10px]
              sm:text-xs
              px-2.5
              py-1
              rounded-full
              shadow-sm
              animate-pulse-subtle
            ">
              Only {latestProduct.stock} left
            </span>
          ) : (
            <span className="
              bg-emerald-500/90
              text-white
              font-medium
              text-[10px]
              sm:text-xs
              px-2.5
              py-1
              rounded-full
              backdrop-blur-sm
            ">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="
          absolute
          inset-0
          bg-stone-900/20
          opacity-0
          group-hover:opacity-100
          transition-opacity
          flex
          items-center
          justify-center
          pointer-events-none
        ">
          <div className="
            bg-white/95
            text-stone-800
            font-semibold
            text-xs
            px-4
            py-2
            rounded-full
            shadow-lg
            flex
            items-center
            gap-1.5
            transform
            translate-y-2
            group-hover:translate-y-0
            transition-all
          ">
            <Eye className="w-3.5 h-3.5" />

            <span>
              Quick View
            </span>
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="
        p-4
        sm:p-5
        flex-1
        flex
        flex-col
        justify-between
        space-y-3
      ">
        <div>
          {/* Category & Lead Time */}
          <div className="
            flex
            items-center
            justify-between
            text-xs
            text-[var(--text-secondary)]
            mb-1
          ">
            <span className="
              font-semibold
              text-rose-500
              uppercase
              tracking-wider
              text-[10px]
            ">
              {latestProduct.category}
            </span>

            <span className="
              flex
              items-center
              gap-1
              text-[11px]
            ">
              <Clock
                className="
                  w-3
                  h-3
                  text-[var(--text-secondary)]
                "
              />

              {latestProduct.leadTimeDays}d lead
            </span>
          </div>

          {/* Product Name */}
          <h3 className="
            font-bold
            text-[var(--text-primary)]
            text-base
            sm:text-lg
            leading-snug
            hover:text-rose-600
            transition-colors
            line-clamp-1
          ">
            {latestProduct.name}
          </h3>

          {/* Live Star Rating */}
          <div className="
            flex
            items-center
            gap-1.5
            text-xs
            mt-1
          ">
            <div className="
              flex
              items-center
              gap-0.5
            ">
              <Star
                className="
                  w-3.5
                  h-3.5
                  fill-amber-400
                  text-amber-400
                "
              />
            </div>

            <span className="
              font-bold
              text-[var(--text-primary)]
            ">
              {currentRating.toFixed(1)}
            </span>

            <span className="
              text-[var(--text-secondary)]
            ">
              ({currentReviewCount})
            </span>
          </div>
        </div>

        {/* Color Palette Indicators */}
        <div className="
          flex
          items-center
          gap-1.5
          pt-1
        ">
          <span className="
            text-[11px]
            text-[var(--text-secondary)]
            mr-1
          ">
            Colors:
          </span>

          {latestProduct.colorsAvailable
            .slice(0, 4)
            .map((color, idx) => (
              <span
                key={idx}
                className={`
                  text-[10px]
                  font-semibold
                  px-2
                  py-0.5
                  rounded-md
                  truncate
                  max-w-[80px]
                  border
                  shadow-sm
                  transition-all
                  hover:scale-105
                  ${getColorStyle(color)}
                `}
                title={color}
              >
                {color}
              </span>
            ))}

          {latestProduct.colorsAvailable.length > 4 && (
            <span className="
              text-[10px]
              text-[var(--text-secondary)]
            ">
              +
              {latestProduct.colorsAvailable.length - 4}
            </span>
          )}
        </div>

        {/* Price & Add To Cart Bar */}
        <div className="
          flex
          items-center
          justify-between
          pt-2
          border-t
          border-[var(--border-color)]
        ">
          <div>
            <div className="
              flex
              items-baseline
              gap-1.5
            ">
              <span className="
                text-lg
                sm:text-xl
                font-extrabold
                text-[var(--text-primary)]
              ">
                ₹{latestProduct.price}
              </span>

              {latestProduct.originalPrice && (
                <span className="
                  text-xs
                  text-[var(--text-secondary)]
                  line-through
                ">
                  ₹{latestProduct.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add To Cart */}
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              if (isOutOfStock) {
                return;
              }

              addToCart(
                latestProduct,
                1
              );
            }}
            disabled={isOutOfStock}
            className={`
              px-3.5
              py-2
              rounded-full
              font-bold
              text-xs
              sm:text-sm
              flex
              items-center
              gap-1.5
              transition-all

              ${
                isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed dark:bg-stone-800 dark:text-stone-500'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 active:scale-95'
              }
            `}
          >
            <ShoppingBag className="w-4 h-4" />

            <span>
              {isOutOfStock
                ? 'Sold Out'
                : 'Add'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};