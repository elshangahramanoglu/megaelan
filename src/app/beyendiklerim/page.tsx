"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import AdCard from "@/components/AdCard";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { ads, favorites } = useAppContext();
  
  const favoriteAds = ads.filter(ad => favorites.includes(ad.id));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold text-gray-900">Bəyəndiklərim</h1>
      </div>

      {favoriteAds.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {favoriteAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-gray-100">
          <Heart className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Bəyəndiyiniz elan yoxdur</h2>
          <p className="text-gray-500 mb-6 max-w-md text-center">
            Bəyəndiyiniz elanları yadda saxlamaq üçün ürək ikonuna klikləyin. Onlar burada görünəcək.
          </p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors">
            Elan axtar
          </Link>
        </div>
      )}
    </div>
  );
}
