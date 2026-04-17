"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const displayImages = images.length > 0 
    ? images 
    : [{ image_url: "/placeholder.jpg", is_primary: true }];
    
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Desktop Thumbnails */}
      <div className="hidden md:flex flex-col gap-4 w-24 shrink-0 overflow-y-auto pr-2 custom-scrollbar">
        {displayImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={`relative aspect-square w-full rounded-xl overflow-hidden border-2 transition-all ${
              activeImage === i 
                ? "border-accent opacity-100" 
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img.image_url}
              alt={`${productName} thumbnail ${i + 1}`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative aspect-square md:aspect-auto md:h-[600px] bg-muted rounded-2xl overflow-hidden group">
        {/* Mobile Swiper */}
        <div className="md:hidden w-full h-full">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            className="w-full h-full"
            onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
          >
            {displayImages.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full">
                  <Image
                    src={img.image_url}
                    alt={`${productName} view ${i + 1}`}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Main Image with AnimatePresence */}
        <div className="hidden md:block absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={displayImages[activeImage].image_url}
                alt={`${productName} main view`}
                fill
                priority
                sizes="(max-width: 1200px) 50vw, 40vw"
                className="object-cover object-center cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
