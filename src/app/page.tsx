"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Crown, MapPin, Filter } from "lucide-react";
import MarqueeCategories from "@/components/MarqueeCategories";
import AdCard from "@/components/AdCard";
import { useAppContext } from "@/context/AppContext";

const CITIES = ["Bütün şəhərlər", "Bakı", "Sumqayıt", "Gəncə", "Xırdalan", "Mingəçevir", "Şirvan", "Quba", "Lənkəran"];

export default function Home_Page() {
  const { ads } = useAppContext();
  const [selectedCity, setSelectedCity] = useState("Bütün şəhərlər");

  const filteredAds = selectedCity === "Bütün şəhərlər" 
    ? ads 
    : ads.filter(ad => ad.city === selectedCity);

  const premiumAds = filteredAds.filter(ad => ad.isPremium).slice(0, 10); // show some premium
  const normalAds = filteredAds.filter(ad => !ad.isPremium);

  return (
    <div className="flex flex-col gap-0 pb-20 bg-white">
      {/* Marquee Animated Categories */}
      <section className="border-b border-gray-100">
        <MarqueeCategories />
      </section>

      {/* Filters Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <MapPin className="w-5 h-5 text-gray-500" />
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-700 cursor-pointer font-medium"
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
          <Filter className="w-5 h-5" /> Ətraflı axtarış
        </button>
      </section>

      {/* Premium Ads Section */}
      {premiumAds.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Premium elanlar
            </h2>
            <Link href="/premium" className="text-blue-600 font-medium hover:underline text-sm md:text-base">
              Hamısına bax
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {/* Promote Box */}
            <div className="group cursor-pointer bg-blue-50 rounded-2xl flex flex-col items-center justify-center p-6 border border-blue-100 hover:border-blue-400 transition-colors h-[320px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Crown className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-4 text-center">Elanı Premium et!</h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors w-full">
                Premium et
              </button>
            </div>

            {premiumAds.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {/* All Ads Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Son elanlar</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {normalAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        
        {normalAds.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Bu şəhər üzrə elan tapılmadı.
          </div>
        )}
      </section>
    </div>
  );
}
