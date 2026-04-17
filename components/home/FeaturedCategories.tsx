"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(3);
        
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (loading) return (
    <div className="py-24 bg-background flex justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-4">
            Curated Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore our meticulously crafted categories designed to turn your bathroom into a personal sanctuary.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((category) => (
            <motion.div 
              key={category.id} 
              variants={itemVariants}
              className="group"
            >
              <Link href={`/products?category=${category.slug}`} className="block relative overflow-hidden rounded-2xl aspect-[4/5]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${category.image_url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-start text-white">
                  <h3 className="text-2xl font-serif font-medium mb-2 transform transition-transform duration-300 group-hover:-translate-y-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-sm max-w-xs line-clamp-2">
                    {category.description}
                  </p>
                  
                  <span className="mt-4 inline-flex items-center gap-2 text-accent font-medium opacity-0 transform translate-y-4 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0 text-sm">
                    Discover <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link href="/products" className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
