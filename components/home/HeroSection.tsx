"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState({
    image_url: "",
    title: "Transform Your",
    subtitle: "Bathroom Dreams",
    button_text: "Shop Collection"
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero').single();
        if (data?.value) {
          setHeroData(data.value);
        }
      } catch (_) {
        // keep defaults if fetch fails
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();

    if (!heroRef.current || !containerRef.current) return;

    const handleScroll = () => {
      // Robust touch device check - mobile browsers cannot handle JS parallax smoothly
      const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      
      // Disable parallax completely on touch devices or rubber-band negative scrolling
      if (isTouchDevice || window.innerWidth < 1024 || window.scrollY < 0) return;

      const scrolled = window.scrollY;
      gsap.to(containerRef.current, {
        y: scrolled * 0.3,
        duration: 0.1,
        ease: "none",
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-primary"
    >
      <div 
        ref={containerRef}
        className="absolute inset-x-0 -top-[30vh] -bottom-[30vh] z-0 origin-center"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Only render the background image after data is loaded to prevent demo image flash */}
        <div 
          className="absolute inset-0 bg-cover transition-opacity duration-700 bg-[center_top]"
          style={{ 
            backgroundImage: heroData.image_url ? `url('${heroData.image_url}')` : 'none',
            opacity: isLoading ? 0 : 1
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30 z-10" />
      </div>

      <div className="container relative z-20 mx-auto px-4 md:px-6 pt-20">
        <motion.div 
          className="max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <span className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-white/90 text-sm font-medium tracking-wide bg-white/5 backdrop-blur-md">
              Collection 2026
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] tracking-tight mb-6"
          >
            {heroData.title} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
              {heroData.subtitle}
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed font-light"
          >
            Premium luxury products for your home, curated for those who value elegance and function.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              {heroData.button_text}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 overflow-hidden relative">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-1/2 bg-accent absolute top-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
