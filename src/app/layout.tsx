import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Search } from "lucide-react";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900 min-h-screen flex flex-col`}
      >
        {/* Navbar */}
        <header className="border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <span className="text-3xl text-blue-500">❖</span>
              MegaElan
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 font-medium">
              <Link href="/haqqimizda" className="text-gray-600 hover:text-blue-600 transition-colors">
                Haqqımızda
              </Link>
              <Link href="/giris" className="text-gray-600 hover:text-blue-600 transition-colors">
                Giriş
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-gray-500">
                <Search className="w-5 h-5" />
              </button>
              <Link href="/yeni-elan" className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors items-center gap-2">
                <span className="text-lg leading-none">+</span> Elan yerləşdir
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-gray-200 mt-20">
          <div className="container mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2 mb-4">
                  <span className="text-3xl text-blue-500">❖</span>
                  MegaElan
                </Link>
                <p className="text-gray-500 text-sm mb-6">
                  Azərbaycanda ən geniş və rahat elanlar platforması. İndi tap və ya sat!
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">MegaElan</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li><Link href="/haqqimizda" className="hover:text-blue-600">Haqqımızda</Link></li>
                  <li><Link href="/elaqe" className="hover:text-blue-600">Əlaqə</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Kömək</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li><Link href="/qaydalar" className="hover:text-blue-600">Qaydalar</Link></li>
                  <li><Link href="/suallar" className="hover:text-blue-600">Tez-tez verilən suallar</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Hüquqi</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li><Link href="/mexfilik" className="hover:text-blue-600">Məxfilik siyasəti</Link></li>
                  <li><Link href="/istifade" className="hover:text-blue-600">İstifadəçi razılaşması</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
              <p>Copyright © {new Date().getFullYear()} MegaElan. Bütün hüquqlar qorunur.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
