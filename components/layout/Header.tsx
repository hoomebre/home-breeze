"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { MobileMenu } from "./MobileMenu";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useCartStore((state) => state.totalItems); // to avoid hydration mismatch, ideally use a small wrapper, but fine for now
  const [isMounted, setIsMounted] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'logo').single();
      if (data?.value?.url) setLogoUrl(data.value.url);
    };
    fetchLogo();
  }, []);

  // Handle transparent header logic primarily for the home page hero
  const isHomePage = pathname === "/";

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = useCartStore((state) => state.totalItems());

  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  return (
    <>
      <header
        className={`fixed z-50 transition-all duration-500 will-change-transform ${
          isTransparent
            ? "top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent text-white py-4 px-4 md:px-8"
            : "top-3 left-3 right-3 md:top-5 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[90%] md:max-w-6xl rounded-2xl bg-primary/95 backdrop-blur-xl text-primary-foreground py-3 px-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-white/10"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 relative z-50">
              <div className={`relative transition-all duration-300 ${isTransparent ? 'h-14 w-14 md:h-16 md:w-16' : 'h-11 w-11 md:h-14 md:w-14'}`}>
                <Image 
                  src={logoUrl || "/logo.png"} 
                  alt="Home Breeze" 
                  fill 
                  className="object-contain" 
                  priority
                />
              </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-medium hover:text-accent transition-colors">Products</Link>
            <Link href="/discounts" className="text-sm font-medium hover:text-accent transition-colors">Offers</Link>
            <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">About</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 relative z-50">
            <CartDrawer />

            {/* Mobile Toggle */}
            <button
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isTransparent ? "hover:bg-white/10" : "hover:bg-black/5"
              }`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* <CartDrawer /> */}
    </>
  );
}
