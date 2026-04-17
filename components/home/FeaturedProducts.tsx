"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(*)')
          .eq('is_featured', true)
          .eq('is_active', true)
          .limit(10);
        
        if (error) throw error;

        const mapped = data.map(p => ({
          ...p,
          images: p.product_images || []
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) return (
    <div className="py-24 bg-secondary flex justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover our most sought-after pieces, handpicked for their exceptional design and unparalleled quality.
            </p>
          </div>
          
          <div className="flex items-center gap-2 hidden md:flex">
            <button className="swiper-button-prev-custom w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="swiper-button-next-custom w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="-mx-4 px-4 pb-12 md:mx-0 md:px-0">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1.2}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination-custom',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="!pb-12"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="h-auto">
                  <div className="h-full pt-4">
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="swiper-pagination-custom flex justify-center mt-4 !static" />
        </motion.div>
      </div>
    </section>
  );
}
