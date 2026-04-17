"use client";

import { motion } from "framer-motion";
import { Scissors, Copy, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { supabase } from "@/lib/supabase";

export default function DiscountsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch active discount codes
      const { data: discountData } = await supabase
        .from('discounts')
        .select('*')
        .eq('is_active', true);
      
      // Fetch sale products (compare_at_price > price)
      const { data: productData } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .gt('compare_at_price', 0)
        .eq('is_active', true);

      if (discountData) setDiscounts(discountData);
      if (productData) {
        setSaleProducts(productData
          .filter(p => p.compare_at_price > p.price)
          .map(p => ({
            ...p,
            images: p.product_images || []
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching discount page data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6"
          >
            Exclusive <span className="text-accent">Offers</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Discover our latest promotions and discount codes to bring luxury into your home for less.
          </motion.p>
        </div>

        {/* Promo Codes */}
        {discounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {discounts.map((promo, idx) => (
              <motion.div 
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-secondary p-8 rounded-2xl border border-border border-dashed relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 bg-accent text-primary text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg tracking-widest">
                  Promo Code
                </div>
                <Scissors className="w-6 h-6 text-muted-foreground mb-4 opacity-30" />
                <h3 className="text-xl font-serif font-bold mb-2 uppercase">{promo.code}</h3>
                <p className="text-sm text-muted-foreground flex-1 mb-6">
                  {promo.discount_type === 'percentage' ? `${promo.discount_value}% off` : `$${promo.discount_value} off`} your order.
                  {promo.min_purchase_amount > 0 && ` Applicable on orders above $${promo.min_purchase_amount}.`}
                </p>
                
                <div className="flex items-center gap-2 mt-auto">
                  <div className="flex-1 bg-background border border-border py-3 px-4 rounded-lg font-mono font-bold text-center tracking-wider text-xl">
                    {promo.code}
                  </div>
                  <button 
                    onClick={() => handleCopy(promo.code)}
                    className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center min-w-[48px]"
                  >
                    {copiedCode === promo.code ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-24 bg-secondary/50 rounded-2xl border border-border">
            <p className="text-muted-foreground">No promo codes available at the moment. Check back soon!</p>
          </div>
        )}

        {/* Highlighted Sale Products */}
        {saleProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold">Special Deals</h2>
              <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                View All Products
              </Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
