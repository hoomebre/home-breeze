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
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent text-white py-6"
            : "bg-primary text-primary-foreground py-3 shadow-md border-b border-white/10"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 relative z-50">
              <div className="relative h-14 w-14 md:h-16 md:w-16">
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
