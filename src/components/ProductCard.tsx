import React, { useEffect, useState } from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Star,
  ShoppingBag,
  Eye,
  Clock,
  Heart,
  Check,
  Package,
  Sparkles,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const getColorStyle = (colorName: string) => {
  const color = colorName.toLowerCase();

  if (color.includes('red') || color.includes('maroon')) {
    return 'bg-red-400';
  }

  if (color.includes('pink') || color.includes('rose')) {
    return 'bg-pink-400';
  }

  if (color.includes('orange')) {
    return 'bg-orange-400';
  }

  if (color.includes('yellow') || color.includes('gold')) {
    return 'bg-yellow-300';
  }

  if (color.includes('green')) {
    return 'bg-green-400';
  }

  if (color.includes('blue') || color.includes('navy')) {
    return 'bg-blue-400';
  }

  if (color.includes('purple') || color.includes('violet')) {
    return 'bg-purple-400';
  }

  if (color.includes('brown') || color.includes('beige')) {
    return 'bg-amber-700';
  }

  if (color.includes('black')) {
    return 'bg-black';
  }

  if (color.includes('white') || color.includes('cream')) {
    return 'bg-white border border-gray-300';
  }

  if (color.includes('grey') || color.includes('gray')) {
    return 'bg-gray-400';
  }

  return 'bg-gray-500';
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    products,
    setSelectedProduct,
    setActiveModal,
    addToCart,
    isDarkMode,
  } = useStore();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const latestProduct =
    products.find((item) => item.id === product.id) || product;

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('knot_bloom_wishlist');

      if (savedWishlist) {
        const wishlist: string[] = JSON.parse(savedWishlist);
        setIsWishlisted(wishlist.includes(latestProduct.id));
      }
    } catch {
      setIsWishlisted(false);
    }
  }, [latestProduct.id]);

  const hasDiscount =
    typeof latestProduct.originalPrice === 'number' &&
    latestProduct.originalPrice > latestProduct.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((latestProduct.originalPrice! - latestProduct.price) /
          latestProduct.originalPrice!) *
          100
      )
    : 0;

  const isOutOfStock = latestProduct.stock <= 0;

  const isLowStock =
    latestProduct.stock > 0 &&
    latestProduct.stock <= 5;

  const handleCardClick = () => {
    setSelectedProduct(latestProduct);
    setActiveModal('product');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();

    setSelectedProduct(latestProduct);
    setActiveModal('product');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const savedWishlist = localStorage.getItem('knot_bloom_wishlist');

      let wishlist: string[] = savedWishlist
        ? JSON.parse(savedWishlist)
        : [];

      if (wishlist.includes(latestProduct.id)) {
        wishlist = wishlist.filter(
          (id) => id !== latestProduct.id
        );

        setIsWishlisted(false);
      } else {
        wishlist.push(latestProduct.id);
        setIsWishlisted(true);
      }

      localStorage.setItem(
        'knot_bloom_wishlist',
        JSON.stringify(wishlist)
      );
    } catch {
      // Prevent wishlist errors from breaking the card.
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutOfStock || isAdded) return;

    addToCart(
      latestProduct,
      1,
      latestProduct.colorsAvailable?.[0]
    );

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const currentRating = Number.isFinite(latestProduct.rating)
    ? latestProduct.rating
    : 0;

  return (
    <article
      onClick={handleCardClick}
      style={{
        backgroundColor: isDarkMode ? '#24211f' : '#fffaf2',
        borderColor: isDarkMode ? '#4a3d38' : '#eadfd3',
        opacity: 1,
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }}
      className="
        group
        relative
        z-0
        flex
        h-full
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-solid
        shadow-md
        transition-all
        duration-300
        ease-out
        hover:-translate-y-2
        hover:scale-[1.015]
        hover:shadow-2xl
        hover:shadow-stone-900/20
        hover:border-rose-300
        dark:hover:border-rose-700
        dark:hover:shadow-black/50
      "
    >
      {/* HOVER GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          -inset-2
          -z-10
          rounded-[24px]
          bg-rose-300/0
          opacity-0
          blur-2xl
          transition-all
          duration-300
          ease-out
          group-hover:bg-rose-300/45
          group-hover:opacity-100
          dark:group-hover:bg-rose-900/35
        "
      />

      {/* CARD CONTENT */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl">

        {/* PRODUCT IMAGE */}
        <div
          className="
            relative
            aspect-[3/4]
            w-full
            overflow-hidden
            bg-gray-100
            dark:bg-zinc-900
          "
        >
          <img
            src={
              latestProduct.cardImageUrl ||
              latestProduct.imageUrl
            }
            alt={latestProduct.name}
            className="
              h-full
              w-full
              object-contain
              transition-transform
              duration-500
              group-hover:scale-[1.04]
            "
            loading="lazy"
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/15
              via-transparent
              to-transparent
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          />

          {/* BADGES */}
          <div
            className="
              absolute
              left-2
              top-2
              flex
              max-w-[70%]
              flex-col
              gap-1
              sm:left-3
              sm:top-3
              sm:gap-1.5
            "
          >
            {latestProduct.isPopular && (
              <span
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-1
                  rounded-full
                  bg-white
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  text-rose-600
                  shadow-sm
                  sm:gap-1.5
                  sm:px-2.5
                  sm:py-1
                  sm:text-[10px]
                "
              >
                <Sparkles size={9} className="sm:hidden" />
                <Sparkles size={11} className="hidden sm:block" />
                Bestseller
              </span>
            )}

            {latestProduct.isNew && (
              <span
                className="
                  inline-flex
                  w-fit
                  items-center
                  rounded-full
                  bg-black
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  text-white
                  shadow-sm
                  sm:px-2.5
                  sm:py-1
                  sm:text-[10px]
                "
              >
                New Arrival
              </span>
            )}

            {hasDiscount && (
              <span
                className="
                  inline-flex
                  w-fit
                  items-center
                  rounded-full
                  bg-rose-500
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  text-white
                  shadow-sm
                  sm:px-2.5
                  sm:py-1
                  sm:text-[10px]
                "
              >
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* WISHLIST */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              isWishlisted
                ? `Remove ${latestProduct.name} from wishlist`
                : `Add ${latestProduct.name} to wishlist`
            }
            className={`
              absolute
              right-2
              top-2
              z-10
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              shadow-sm
              transition-all
              duration-200
              sm:right-3
              sm:top-3
              sm:h-9
              sm:w-9
              ${
                isWishlisted
                  ? 'border-rose-200 bg-rose-500 text-white'
                  : isDarkMode
                  ? 'border-stone-600 bg-stone-700 text-stone-200 hover:bg-stone-600 hover:text-rose-300'
                  : 'border-gray-200 bg-white text-gray-700 hover:text-rose-500'
              }
            `}
          >
            <Heart
              size={15}
              className="sm:hidden"
              fill={isWishlisted ? 'currentColor' : 'none'}
            />

            <Heart
              size={17}
              className="hidden sm:block"
              fill={isWishlisted ? 'currentColor' : 'none'}
            />
          </button>

          {/* QUICK VIEW */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              flex
              items-center
              justify-center
              opacity-0
              transition-all
              duration-300
              ease-out
              group-hover:opacity-100
            "
          >
            <button
              type="button"
              onClick={handleQuickView}
              className="
                pointer-events-auto
                group/quick
                flex
                items-center
                justify-center
                gap-1
                rounded-full
                bg-white/95
                px-3
                py-1.5
                text-[10px]
                font-bold
                text-stone-800
                shadow-xl
                ring-1
                ring-black/10
                transition-all
                duration-200
                translate-y-2
                scale-95
                hover:scale-105
                hover:bg-rose-500
                hover:text-white
                hover:shadow-2xl
                active:scale-95
                group-hover:translate-y-0
                group-hover:scale-100
                sm:gap-1.5
                sm:px-4
                sm:py-2
                sm:text-xs
                dark:bg-stone-800/95
                dark:text-stone-100
                dark:ring-white/10
                dark:hover:bg-rose-600
                dark:hover:text-white
              "
            >
              <Eye
                size={12}
                className="
                  transition-transform
                  duration-200
                  sm:hidden
                  group-hover/quick:scale-110
                "
              />

              <Eye
                size={14}
                className="
                  hidden
                  transition-transform
                  duration-200
                  sm:block
                  group-hover/quick:scale-110
                "
              />

              Quick View
            </button>
          </div>
        </div>

        {/* PRODUCT INFORMATION */}
        <div
          className="
            flex
            flex-1
            flex-col
            p-2.5
            sm:p-4
          "
        >

          {/* CATEGORY + STOCK */}
          <div
            className="
              mb-1
              flex
              min-h-[18px]
              items-center
              justify-between
              gap-1
              sm:mb-1.5
              sm:h-6
              sm:gap-2
            "
          >
            <span
              className="
                min-w-0
                max-w-[58%]
                truncate
                px-0.5
                py-0.5
                text-[8px]
                font-bold
                uppercase
                tracking-wide
                text-stone-600
                dark:text-stone-300
                sm:max-w-[65%]
                sm:py-1
                sm:text-[10px]
              "
            >
              {latestProduct.category}
            </span>

            {isOutOfStock ? (
              <span className="shrink-0 text-[8px] font-semibold text-red-500 sm:text-[10px]">
                Out of stock
              </span>
            ) : isLowStock ? (
              <span className="flex shrink-0 items-center gap-0.5 text-[8px] font-semibold text-orange-500 sm:gap-1 sm:text-[10px]">
                <Package size={9} className="sm:hidden" />
                <Package size={11} className="hidden sm:block" />
                Only {latestProduct.stock} left
              </span>
            ) : (
              <span
                className="flex shrink-0 items-center gap-0.5 text-[8px] font-medium sm:gap-1 sm:text-[10px]"
                style={{
                  color: isDarkMode ? '#d6d3d1' : '#6b7280',
                }}
              >
                <Package size={9} className="sm:hidden" />
                <Package size={11} className="hidden sm:block" />
                In stock
              </span>
            )}
          </div>

          {/* TITLE */}
          <div className="min-w-0">
            <h3
              title={latestProduct.name}
              style={{
                color: isDarkMode ? '#ffffff' : '#171717',
              }}
              className="
                overflow-hidden
                text-ellipsis
                whitespace-nowrap
                text-[14px]
                font-extrabold
                leading-[18px]
                tracking-[-0.01em]
                group-hover:text-rose-600
                sm:text-[19px]
                sm:leading-[23px]
              "
            >
              {latestProduct.name}
            </h3>
          </div>

          {/* RATING */}
          <div
            className="
              mt-1
              flex
              min-h-[17px]
              items-center
              gap-1
              sm:h-5
              sm:gap-1.5
            "
          >
            <div className="flex items-center gap-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={10}
                  className={`
                    sm:hidden
                    ${
                      star <= Math.round(currentRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }
                  `}
                />
              ))}

              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={`desktop-${star}`}
                  size={12}
                  className={`
                    hidden
                    sm:block
                    ${
                      star <= Math.round(currentRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }
                  `}
                />
              ))}
            </div>

            <span
              className="text-[9px] font-medium sm:text-[11px]"
              style={{
                color: isDarkMode ? '#d6d3d1' : '#4b5563',
              }}
            >
              {currentRating.toFixed(1)}
            </span>

            <span
              className="text-[9px] sm:text-[11px]"
              style={{
                color: isDarkMode ? '#a8a29e' : '#9ca3af',
              }}
            >
              ({latestProduct.reviewCount})
            </span>
          </div>

          {/* COLORS */}
          <div className="mt-1.5 min-h-[20px] sm:mt-2 sm:h-6">
            {latestProduct.colorsAvailable &&
              latestProduct.colorsAvailable.length > 0 && (
                <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                  <span
                    className="shrink-0 text-[9px] font-medium sm:text-[11px]"
                    style={{
                      color: isDarkMode ? '#d6d3d1' : '#4b5563',
                    }}
                  >
                    Colors
                  </span>

                  <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
                    {latestProduct.colorsAvailable
                      .slice(0, 5)
                      .map((color) => (
                        <span
                          key={color}
                          title={color}
                          className={`
                            h-3
                            w-3
                            shrink-0
                            rounded-full
                            shadow-sm
                            ring-1
                            ring-black/10
                            sm:h-4
                            sm:w-4
                            ${getColorStyle(color)}
                          `}
                        />
                      ))}

                    {latestProduct.colorsAvailable.length > 5 && (
                      <span
                        className="shrink-0 text-[8px] sm:text-[10px]"
                        style={{
                          color: isDarkMode ? '#a8a29e' : '#9ca3af',
                        }}
                      >
                        +{latestProduct.colorsAvailable.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* SHIPPING */}
          <div
            className="
              mt-1
              mb-1
              flex
              min-h-[14px]
              items-center
              gap-1
              sm:mt-2
              sm:mb-1
              sm:h-4
              sm:gap-1.5
            "
          >
            <Clock
              size={10}
              className="shrink-0 sm:hidden"
              style={{
                color: isDarkMode ? '#a8a29e' : '#9ca3af',
              }}
            />

            <Clock
              size={12}
              className="hidden shrink-0 sm:block"
              style={{
                color: isDarkMode ? '#a8a29e' : '#9ca3af',
              }}
            />

            <span
              className="
                min-w-0
                truncate
                text-[8px]
                font-medium
                sm:text-[10px]
              "
              style={{
                color: isDarkMode ? '#d6d3d1' : '#6b7280',
              }}
            >
              Handmade • Ships in {latestProduct.leadTimeDays} day
              {latestProduct.leadTimeDays !== 1 ? 's' : ''}
            </span>
          </div>

          {/* PRICE */}
          <div
            className="
              mb-1.5
              flex
              min-h-[30px]
              items-center
              justify-between
              gap-1
              sm:mb-2
              sm:h-10
              sm:gap-2
            "
          >
            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
              <span
                className="
                  shrink-0
                  text-[16px]
                  font-extrabold
                  tracking-tight
                  sm:text-[20px]
                "
                style={{
                  color: isDarkMode ? '#ffffff' : '#171717',
                }}
              >
                ₹{latestProduct.price.toLocaleString('en-IN')}
              </span>

              {hasDiscount && (
                <span
                  className="
                    truncate
                    text-[9px]
                    font-medium
                    text-gray-400
                    line-through
                    sm:text-xs
                  "
                >
                  ₹
                  {latestProduct.originalPrice!.toLocaleString(
                    'en-IN'
                  )}
                </span>
              )}
            </div>

            {hasDiscount && (
              <span
                className="
                  shrink-0
                  text-[8px]
                  font-semibold
                  text-rose-500
                  sm:text-[10px]
                "
              >
                Save ₹
                {(
                  latestProduct.originalPrice! -
                  latestProduct.price
                ).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* ADD TO CART */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdded}
            className={`
              flex
              h-9
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-lg
              text-[10px]
              font-bold
              transition-all
              duration-200
              sm:h-10
              sm:gap-2
              sm:rounded-xl
              sm:text-sm
              ${
                isOutOfStock
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-rose-500 text-white shadow-sm shadow-rose-500/20 hover:bg-rose-600 hover:shadow-md active:scale-[0.98]'
              }
            `}
          >
            {isOutOfStock ? (
              <>
                <Package size={13} className="sm:hidden" />
                <Package size={16} className="hidden sm:block" />
                Out of Stock
              </>
            ) : isAdded ? (
              <>
                <Check size={13} className="sm:hidden" />
                <Check size={16} className="hidden sm:block" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag size={13} className="sm:hidden" />
                <ShoppingBag size={16} className="hidden sm:block" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};