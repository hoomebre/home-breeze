"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  if (!isMounted) {
    return (
      <div className="relative p-2">
        <ShoppingBag className="w-5 h-5" />
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger className="relative p-2 hover:bg-accent/10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-primary text-[10px] font-bold flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-white/10 bg-primary text-primary-foreground">
        <SheetHeader className="p-6 border-b border-white/10 text-left">
          <SheetTitle className="font-serif text-2xl flex items-center justify-between text-white">
            Your Cart
            <span className="text-sm font-sans text-white/60 font-normal">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-accent opacity-50" />
              </div>
              <div>
                <p className="text-lg font-serif font-medium mb-2 text-white">Your cart is empty</p>
                <p className="text-white/60 text-sm max-w-[250px] mx-auto">
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 group border-b border-white/5 pb-4"
                  >
                    {/* Item Image */}
                    <div className="relative w-20 h-24 md:w-24 md:h-28 rounded-md overflow-hidden bg-muted shrink-0 border border-border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-sm md:text-base line-clamp-2 pr-4">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-white/40 hover:text-red-400 transition-colors shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-end justify-between mt-auto">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded-md h-8">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <span className="font-semibold text-sm md:text-base text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 bg-primary-foreground/5">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-serif font-semibold text-lg text-white pt-3 border-t border-white/10">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full flex items-center justify-center py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
