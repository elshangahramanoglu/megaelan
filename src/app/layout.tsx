import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";

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
        <Header />

        {/* Main Content */}
        <main className="flex-1 w-full bg-white">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-gray-200 mt-20">
          <div className="w-full px-4 md:px-8 max-w-7xl mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <Link href="/" className="text-2xl font-black text-blue-600 flex items-center gap-2 mb-4">
                  MegaElan
                </Link>
                <p className="text-gray-500 text-sm mb-6">
                  Azərbaycanda ən geniş və rahat elanlar platforması. İndi tap və ya sat!
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">MegaElan</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li><Link href="/haqqimizda" className="hover:text-blue-600">Haqqımızda</Link></li>
                  <li><Link href="/elaqe" className="hover:text-blue-600">Əlaqə</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Kömək</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li><Link href="/qaydalar" className="hover:text-blue-600">Qaydalar</Link></li>
                  <li><Link href="/suallar" className="hover:text-blue-600">Tez-tez verilən suallar</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Hüquqi</h3>
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
