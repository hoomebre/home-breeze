"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Footer() {
  const [contact, setContact] = useState({
    address: "123 Luxury Avenue, Design District, Karachi, Pakistan",
    phone: "+92 300 1234567",
    email: "hello@homebreeze.com"
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const [contactRes, logoRes] = await Promise.all([
        supabase.from('site_settings').select('value').eq('key', 'contact').single(),
        supabase.from('site_settings').select('value').eq('key', 'logo').single(),
      ]);
      if (contactRes.data?.value) setContact(contactRes.data.value);
      if (logoRes.data?.value?.url) setLogoUrl(logoRes.data.value.url);
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-border/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="inline-block relative h-20 w-20 -ml-1">
              <Image 
                src={logoUrl || "/logo.png"} 
                alt="Home Breeze" 
                fill 
                className="object-contain" 
              />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-sm">
              Elevate your spaces with our premium collection of sanitary products. 
              We blend luxury, exceptional quality, and modern design to transform your bathroom experience.
            </p>
            <div className="flex gap-4 text-sm font-medium">
              <a href="#" className="hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link href="/products" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">All Products</Link>
              </li>
              <li>
                <Link href="/discounts" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Special Offers</Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6">Categories</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/products?category=showers" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Luxury Showers</Link>
              </li>
              <li>
                <Link href="/products?category=taps" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Premium Taps</Link>
              </li>
              <li>
                <Link href="/products?category=vanities" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Vanities</Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Bathroom Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/70 text-sm">
                <MapPin className="w-5 h-5 shrink-0 text-accent" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <Phone className="w-5 h-5 shrink-0 text-accent" />
                <span>{contact.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <Mail className="w-5 h-5 shrink-0 text-accent" />
                <span>{contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            &copy; {new Date().getFullYear()} Home Breeze Sanitary Fittings. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-primary-foreground/50 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-primary-foreground/50 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
