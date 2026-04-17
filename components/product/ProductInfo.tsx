"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check, ShieldCheck, Truck } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const discountPercent = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock_quantity) setQuantity(q => q + 1);
  };

  const handleAddToCart = () => {
    if (!product.stock_quantity) return;
    
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.image_url || '/placeholder.jpg',
      quantity
    });

    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <div className="flex flex-col">
      {/* Title & Rating */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-4 leading-tight">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="flex text-accent">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < Math.floor(product.rating) ? "text-accent" : "text-muted"}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm font-medium ml-2">{product.rating}</span>
            <span className="text-sm text-muted-foreground underline ml-1 cursor-pointer hover:text-foreground transition-colors">
              ({product.review_count} reviews)
            </span>
          </div>
          
          <span className="text-muted-foreground text-sm">SKU: {product.sku}</span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-end gap-3 mb-2">
          <span className="text-4xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-xl text-muted-foreground line-through mb-1">
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-destructive/10 text-destructive text-sm font-bold px-2 py-1 rounded-md ml-2 mb-1">
              Save {discountPercent}%
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {product.stock_quantity > 0 ? (
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              In Stock ({product.stock_quantity} available)
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-destructive font-medium">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="prose prose-sm md:prose-base text-muted-foreground mb-8">
        <p>{product.description}</p>
      </div>

      {/* Add to Cart Area */}
      <div className="border-y border-border py-6 mb-8 mt-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between border border-border rounded-lg h-14 w-full sm:w-36 bg-background">
            <button 
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="w-12 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-50 rounded-l-lg"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium text-lg min-w-[20px] text-center w-full">{quantity}</span>
            <button 
              onClick={handleIncrease}
              disabled={quantity >= product.stock_quantity}
              className="w-12 h-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-50 rounded-r-lg"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.stock_quantity || isAdding}
            className="flex-1 h-14 rounded-lg font-medium transition-all text-lg overflow-hidden relative"
            style={{
              backgroundColor: isAdding ? "var(--color-success, #10b981)" : "var(--color-primary)",
              color: "var(--color-primary-foreground)"
            }}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex items-center justify-center gap-2 bg-green-500 text-white"
                >
                  <Check className="w-6 h-6" /> Added to Cart
                </motion.div>
              ) : product.stock_quantity ? (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 flex items-center justify-center gap-2 hover:bg-primary/90"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </motion.div>
              ) : (
                <motion.div
                  key="out"
                  className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted"
                >
                  Out of Stock
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
          <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Secure Checkout</span>
            <span className="text-xs text-muted-foreground">Pay safely with COD</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
          <Truck className="w-6 h-6 text-accent shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Fast Delivery</span>
            <span className="text-xs text-muted-foreground">Nationwide shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
}
