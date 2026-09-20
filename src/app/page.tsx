"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Crown, MapPin, Filter } from "lucide-react";
import MarqueeCategories from "@/components/MarqueeCategories";
import AdCard from "@/components/AdCard";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const CITIES = ["Bütün şəhərlər", "Bakı", "Sumqayıt", "Gəncə", "Xırdalan", "Mingəçevir", "Şirvan", "Quba", "Lənkəran"];

export default function Home_Page({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = use(searchParams);
  const searchQuery = resolvedParams.search?.toLowerCase() || "";
  
  const { ads, user } = useAppContext();
  const [selectedCity, setSelectedCity] = useState("Bütün şəhərlər");
  const router = useRouter();

  let filteredAds = selectedCity === "Bütün şəhərlər" 
    ? ads 
    : ads.filter(ad => ad.city === selectedCity);

  // Apply search query filter if exists (filtering by title)
  if (searchQuery) {
    filteredAds = filteredAds.filter(ad => ad.title.toLowerCase().includes(searchQuery));
  }

  const premiumAds = filteredAds.filter(ad => ad.isPremium).slice(0, 10);
  const normalAds = filteredAds.filter(ad => !ad.isPremium);

  return (
    <div className="flex flex-col gap-0 pb-20 bg-white">
      {/* Marquee Animated Categories */}
      <section className="border-b border-gray-100 overflow-hidden">
        <MarqueeCategories />
      </section>

      {/* Filters Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 md:py-2 rounded-xl border border-gray-200 w-full md:w-auto">
          <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent border-none outline-none text-black font-bold cursor-pointer w-full"
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        {searchQuery && (
          <div className="flex items-center gap-2 text-black font-bold">
            <span className="text-gray-500 font-medium">Axtarış:</span> "{searchQuery}"
            <button onClick={() => router.push("/")} className="text-blue-600 hover:underline text-sm ml-2">Təmizlə</button>
          </div>
        )}
      </section>

      {/* Premium Ads Section */}
      {premiumAds.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-black flex items-center gap-2">
              Premium elanlar
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {premiumAds.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {/* All Ads Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-black">Son elanlar</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {normalAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        
        {normalAds.length === 0 && premiumAds.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-medium text-lg bg-gray-50 rounded-3xl mt-8 border border-gray-200">
            {searchQuery ? "Axtarışınıza uyğun elan tapılmadı." : "Bu şəhər üzrə elan tapılmadı."}
          </div>
        )}
      </section>
    </div>
  );
}
