"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h3 className="text-2xl font-serif font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any products matching your current filters. Try adjusting them or clear all filters.
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants} className="h-full">
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
