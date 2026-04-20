import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home Breeze — Premium Sanitary Fittings",
  description: "Experience excellence with Home Breeze. Premium sanitary products that combine luxury, functionality, and timeless design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full scroll-smooth antialiased overflow-x-hidden`}
    >
      <body className="min-h-screen min-h-[100dvh] flex flex-col font-sans selection:bg-blue-600 selection:text-white pt-[76px] lg:pt-0 overflow-x-hidden">
        <LayoutWrapper>
          <PageTransition>
            <main className="flex-1 flex flex-col w-full">{children}</main>
          </PageTransition>
        </LayoutWrapper>
      </body>
    </html>
  );
}
