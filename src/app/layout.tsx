import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";
import { AppProvider } from "@/context/AppContext";
import Image from "next/image";
import { Share2, Mail } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MegaElan - Pulsuz Elanlar Saytı",
  description: "Azərbaycanda ən geniş elanlar şəbəkəsi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 min-h-screen flex flex-col`}
      >
        <AppProvider>
          <Header />

          {/* Main Content */}
          <main className="flex-1 w-full bg-white flex flex-col">
            {children}
          </main>

          {/* Footer - No borders above it, pure clean layout */}
          <footer className="bg-slate-50 pt-16 pb-8 mt-20">
            <div className="w-full px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
              {/* Left Side: Logo, Slogan, Socials */}
              <div className="flex flex-col items-start gap-4 md:max-w-sm">
                <Link href="/" className="inline-block mix-blend-multiply">
                  <Image 
                    src="/logo.png" 
                    alt="MegaElan" 
                    width={200} 
                    height={200} 
                    className="object-contain -ml-4"
                  />
                </Link>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Azərbaycanda ən geniş və rahat elanlar platforması. İndi tap və ya sat!
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors font-bold">
                    FB
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-colors font-bold">
                    IG
                  </a>
                </div>
              </div>

              {/* Right Side: Links */}
              <div className="flex flex-wrap gap-12 md:gap-24 md:justify-end">
                <div>
                  <h3 className="font-bold text-lg text-black mb-6">MegaElan</h3>
                  <ul className="space-y-4 text-gray-600 font-medium">
                    <li><Link href="/haqqimizda" className="hover:text-blue-600 transition-colors">Haqqımızda</Link></li>
                    <li><Link href="/elaqe" className="hover:text-blue-600 transition-colors">Əlaqə</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black mb-6">Qaydalar & Hüquqi</h3>
                  <ul className="space-y-4 text-gray-600 font-medium">
                    <li><Link href="/qaydalar" className="hover:text-blue-600 transition-colors">Qaydalar və Tariflər</Link></li>
                    <li><Link href="/suallar" className="hover:text-blue-600 transition-colors">Tez-tez verilən suallar</Link></li>
                    <li><Link href="/mexfilik" className="hover:text-blue-600 transition-colors">Məxfilik siyasəti</Link></li>
                    <li><Link href="/istifade" className="hover:text-blue-600 transition-colors">İstifadəçi razılaşması</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-gray-200">
              <p className="text-gray-500 font-medium text-sm text-center md:text-left">
                Copyright © {new Date().getFullYear()} MegaElan. Bütün hüquqlar qorunur.
              </p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
