"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Visual Side */}
      <div className="hidden lg:block relative h-full bg-primary overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80"
          alt="Luxury Bathroom"
          fill
          className="object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between">
          <Link href="/" className="font-serif text-3xl font-bold text-white tracking-tight">
            Home Breeze<span className="text-accent"></span>
          </Link>
          <div className="text-white max-w-md">
            <h2 className="text-4xl font-serif mb-4 leading-tight">Admin<br/> Control Panel</h2>
            <p className="text-white/80 font-light">Manage products, orders, and customer experiences with precision and style.</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:hidden">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight">
              Home Breeze<span className="text-accent"></span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                  placeholder="admin@homebreeze.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center h-12"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Test credentials: admin@homebreeze.com / admin123
          </p>
        </motion.div>
      </div>
    </div>
  );
}
