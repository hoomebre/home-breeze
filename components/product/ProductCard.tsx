"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const discountPercent = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.image_url || '/placeholder.jpg',
      quantity: 1
    });

    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <div 
      className="group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border transition-shadow hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col relative outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {discountPercent > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="relative aspect-square w-full bg-muted overflow-hidden">
          <Image
            src={product.images[0]?.image_url || '/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-accent text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? "text-accent" : "text-muted"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({product.review_count})</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-serif font-semibold mb-1 line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.short_description}
          </p>

          {/* Price & Spacer */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
              {product.compare_at_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Action */}
      <div className="px-5 pb-5 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={!product.stock_quantity || isAdding}
          className="relative w-full h-11 flex items-center justify-center gap-2 rounded-lg font-medium transition-all overflow-hidden"
          style={{
            backgroundColor: isAdding ? "var(--color-success, #10b981)" : "var(--color-primary)",
            color: "var(--color-primary-foreground)"
          }}
        >
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex items-center gap-2 text-white"
              >
                <Check className="w-4 h-4" /> Added to Cart
              </motion.span>
            ) : product.stock_quantity ? (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </motion.span>
            ) : (
              <motion.span
                key="out"
                className="text-muted-foreground"
              >
                Out of Stock
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
