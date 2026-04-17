"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, PenTool, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const fadeInUp = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-100px" },
    variants: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80"
            alt="Luxury bathroom"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </div>
        
        <div className="container relative z-20 mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light"
          >
            Redefining luxury living through impeccable sanitary design and flawless craftsmanship since 2010.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div {...fadeInUp} className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">A Decade of Excellence</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Home Breeze was born out of a simple vision: that the bathroom should not be a purely functional space, but a personal sanctuary. What started as a small boutique curating premium taps has grown into a comprehensive destination for luxury sanitary products.
                </p>
                <p>
                  We travel the world to source materials and designs that combine aesthetic brilliance with technological innovation. Every product in our collection is subjected to rigorous quality control ensuring that it meets the highest standards of durability and functionality.
                </p>
                <p>
                  Today, Home Breeze is proud to be the trusted partner of renowned interior designers, architects, and discerning homeowners who refuse to compromise on quality.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeInUp} 
              className="order-1 md:order-2 relative aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl"
            >
              <Image 
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80"
                alt="Craftsmanship"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Sparkles className="w-8 h-8"/>, title: "Uncompromising Quality", desc: "We use only solid brass, premium ceramics, and high-grade finishes." },
              { icon: <PenTool className="w-8 h-8"/>, title: "Timeless Design", desc: "Aesthetics that outlast fleeting trends, blending perfectly with any architectural style." },
              { icon: <Leaf className="w-8 h-8"/>, title: "Sustainability", desc: "Water-saving technologies engineered to protect our most precious resource." },
              { icon: <ShieldCheck className="w-8 h-8"/>, title: "Customer Trust", desc: "Transparent pricing, authentic products, and dedicated post-purchase support." },
            ].map((val, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="whileInView"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
                }}
                className="bg-background p-8 rounded-2xl shadow-sm text-center"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 text-accent">
                  {val.icon}
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">{val.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
            <path d="M0 100 C 20 0 50 0 100 100 Z" />
          </svg>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-6">Ready to transform your space?</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Explore our curated collections and find the perfect pieces to complete your vision.
          </p>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Shop the Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
