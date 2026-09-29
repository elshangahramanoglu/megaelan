"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Crown, MapPin, Filter } from "lucide-react";
import MarqueeCategories from "@/components/MarqueeCategories";
import AdCard from "@/components/AdCard";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { AZERBAIJAN_CITIES } from "@/data/cities";
import { categoriesData } from "@/data/categories";

export default function Home_Page({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = use(searchParams);
  const searchQuery = resolvedParams.search?.toLowerCase() || "";
  
  const { ads, user } = useAppContext();
  const router = useRouter();

  // Filters state
  const [selectedCity, setSelectedCity] = useState("Bütün şəhərlər");
  const [category, setCategory] = useState("Bütün kateqoriyalar");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sellerType, setSellerType] = useState("Bütün");
  const [delivery, setDelivery] = useState("Vacib deyil");
  const [showFilters, setShowFilters] = useState(false);

  let filteredAds = ads.filter(ad => {
    // City filter
    if (selectedCity !== "Bütün şəhərlər" && ad.city !== selectedCity) return false;
    
    // Search query
    if (searchQuery && !ad.title.toLowerCase().includes(searchQuery) && !ad.description.toLowerCase().includes(searchQuery)) return false;

    // Category filter
    if (category !== "Bütün kateqoriyalar" && ad.categoryId !== category) return false;
    
    // Price filter
    if (minPrice && ad.price < Number(minPrice)) return false;
    if (maxPrice && ad.price > Number(maxPrice)) return false;
    
    // Seller Type filter
    if (sellerType !== "Bütün") {
      const adSellerType = ad.details?.sellerType || "Fərdi";
      if (adSellerType !== sellerType) return false;
    }
    
    // Delivery filter
    if (delivery !== "Vacib deyil") {
      const adDelivery = ad.details?.delivery === "Var";
      if (delivery === "Çatdırılma var" && !adDelivery) return false;
      if (delivery === "Çatdırılma yoxdur" && adDelivery) return false;
    }

    return true;
  });

  const premiumAds = filteredAds.filter(ad => ad.isPremium).slice(0, 10);
  const vipAds = filteredAds.filter(ad => ad.isVip && !ad.isPremium).slice(0, 15);
  const normalAds = filteredAds.filter(ad => !ad.isPremium && !ad.isVip);

  return (
    <div className="flex flex-col gap-0 pb-20 bg-white">
      {/* Marquee Animated Categories */}
      <section className="border-b border-gray-100 overflow-hidden">
        <MarqueeCategories />
      </section>

      {/* Filters Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-col gap-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 md:py-2 rounded-xl border border-gray-200 flex-grow md:flex-grow-0">
              <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent border-none outline-none text-black font-bold cursor-pointer w-full"
              >
                {AZERBAIJAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 md:py-2 rounded-xl border font-bold transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              <Filter className="w-5 h-5" />
              Filtrlər
            </button>

            {searchQuery && (
              <div className="flex items-center gap-2 text-black font-bold px-4 py-2">
                <span className="text-gray-500 font-medium">Axtarış:</span> &quot;{searchQuery}&quot;
                <button onClick={() => router.push("/")} className="text-blue-600 hover:underline text-sm ml-2">Təmizlə</button>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kateqoriya</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800">
                <option value="Bütün kateqoriyalar">Bütün kateqoriyalar</option>
                {categoriesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Qiymət (AZN)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2 p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2 p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Satıcı</label>
              <select value={sellerType} onChange={e => setSellerType(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800">
                <option value="Bütün">Vacib deyil</option>
                <option value="Fərdi">Fərdi</option>
                <option value="Mağaza">Mağaza</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Çatdırılma</label>
              <select value={delivery} onChange={e => setDelivery(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800">
                <option value="Vacib deyil">Vacib deyil</option>
                <option value="Çatdırılma var">Çatdırılma var</option>
                <option value="Çatdırılma yoxdur">Çatdırılma yoxdur</option>
              </select>
            </div>
            
            <div className="lg:col-span-4 flex justify-end mt-2">
              <button 
                onClick={() => { setMinPrice(""); setMaxPrice(""); setCategory("Bütün kateqoriyalar"); setSellerType("Bütün"); setDelivery("Vacib deyil"); }}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors text-sm"
              >
                Filtrləri təmizlə
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Premium Ads Section */}
      {premiumAds.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-black flex items-center gap-2">
                <Crown className="w-5 h-5 md:w-6 md:h-6 text-orange-500" /> Premium elanlar
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
              {premiumAds.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
        </section>
      )}

      {/* VIP / Önə çıxan Ads Section */}
      {vipAds.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-black flex items-center gap-2">
                Önə çıxan elanlar
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
              {vipAds.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
        </section>
      )}

      {/* All Ads Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-black text-black">Elanlar</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {normalAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        
        {normalAds.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-medium text-base bg-gray-50 rounded-3xl mt-6 border border-gray-200">
            {searchQuery || showFilters ? "Axtarışınıza uyğun elan tapılmadı." : "Bu şəhər üzrə elan tapılmadı."}
          </div>
        )}
      </section>
    </div>
  );
}
