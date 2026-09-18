import React from 'react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingBag, Eye, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, setActiveModal } = useStore();

  const handleCardClick = () => {
    setSelectedProduct(product);
    setActiveModal('product');
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group glass-card rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between border border-stone-200/80">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer" onClick={handleCardClick}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy" 
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isPopular && (
            <span className="bg-rose-500 text-white font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-sm">
              ✨ Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-amber-400 text-stone-900 font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-sm">
              🌟 New Arrival
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="bg-stone-900/90 text-stone-200 font-semibold text-[10px] sm:text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500 text-white font-semibold text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-sm animate-pulse-subtle">
              Only {product.stock} left
            </span>
          ) : (
            <span className="bg-emerald-500/90 text-white font-medium text-[10px] sm:text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={handleCardClick}
            className="bg-white/95 text-stone-800 font-semibold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-rose-50 hover:text-rose-600 transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Lead Time */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold text-rose-500 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-stone-400" />
              {product.leadTimeDays}d lead
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={handleCardClick}
           className="font-bold text-[var(--text-primary)] text-base sm:text-lg leading-snug cursor-pointer hover:text-rose-600 transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 text-xs mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
           <span className="font-bold text-[var(--text-primary)]">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Color Palette Indicators */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-[11px] text-stone-400 mr-1">Colors:</span>
          {product.colorsAvailable.slice(0, 4).map((color, idx) => (
            <span 
              key={idx} 
              className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md truncate max-w-[80px]"
              title={color}
            >
              {color}
            </span>
          ))}
          {product.colorsAvailable.length > 4 && (
            <span className="text-[10px] text-stone-400">+{product.colorsAvailable.length - 4}</span>
          )}
        </div>

        {/* Price & Add To Cart Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isOutOfStock 
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
