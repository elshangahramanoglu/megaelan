"use client";

import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import AdCard from "@/components/AdCard";
import { Search, PackageOpen, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { AZERBAIJAN_CITIES } from "@/data/cities";
import { categoriesData } from "@/data/categories";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const { ads, isUserLoaded, isAdsLoaded } = useAppContext();
  const [mounted, setMounted] = useState(false);

  // Filters state
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState("Bütün şəhərlər");
  const [category, setCategory] = useState("Bütün kateqoriyalar");
  const [sellerType, setSellerType] = useState("Bütün");
  const [delivery, setDelivery] = useState("Vacib deyil");

  // Reset all filters when search query changes
  useEffect(() => {
    setMinPrice(""); setMaxPrice(""); setCity("Bütün şəhərlər");
    setCategory("Bütün kateqoriyalar"); setSellerType("Bütün"); setDelivery("Vacib deyil");
  }, [q]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isUserLoaded || !isAdsLoaded) return <div className="h-screen flex items-center justify-center text-blue-600"><span className="animate-pulse font-bold text-lg">Axtarış edilir...</span></div>;

  const searchResults = ads.filter(ad => {
    // Text search
    if (q.trim() && !ad.title.toLowerCase().includes(q.toLowerCase()) && !ad.description.toLowerCase().includes(q.toLowerCase())) return false;
    
    // Price filter
    if (minPrice && ad.price < Number(minPrice)) return false;
    if (maxPrice && ad.price > Number(maxPrice)) return false;
    
    // City filter
    if (city !== "Bütün şəhərlər" && ad.city !== city) return false;
    
    // Category filter
    if (category !== "Bütün kateqoriyalar" && ad.categoryId !== category) return false;
    
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

  // Sort search results (Premium > VIP > Regular)
  searchResults.sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    return parseInt(b.id.replace('new-', '')) - parseInt(a.id.replace('new-', ''));
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 min-h-[70vh] flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="w-full md:w-1/4 flex flex-col gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
        <h2 className="text-xl font-black text-black flex items-center gap-2 mb-2"><Filter className="w-5 h-5 text-blue-600"/> Filtrlər</h2>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Kateqoriya</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800">
            <option value="Bütün kateqoriyalar">Bütün kateqoriyalar</option>
            {categoriesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Şəhər</label>
          <select value={city} onChange={e => setCity(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800">
            {AZERBAIJAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Qiymət (AZN)</label>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2 p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 font-medium" />
            <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2 p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Satıcı</label>
          <select value={sellerType} onChange={e => setSellerType(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800">
            <option value="Bütün">Vacib deyil</option>
            <option value="Fərdi">Fərdi</option>
            <option value="Mağaza">Mağaza</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Çatdırılma</label>
          <select value={delivery} onChange={e => setDelivery(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800">
            <option value="Vacib deyil">Vacib deyil</option>
            <option value="Çatdırılma var">Çatdırılma var</option>
            <option value="Çatdırılma yoxdur">Çatdırılma yoxdur</option>
          </select>
        </div>
        
        <button 
          onClick={() => { setMinPrice(""); setMaxPrice(""); setCity("Bütün şəhərlər"); setCategory("Bütün kateqoriyalar"); setSellerType("Bütün"); setDelivery("Vacib deyil"); }}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors mt-2"
        >
          Filtrləri təmizlə
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 bg-blue-50 text-blue-700 p-6 rounded-3xl border border-blue-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Axtarış nəticələri</h1>
              {q ? <p className="font-medium mt-1">"{q}" üçün {searchResults.length} nəticə tapıldı</p> : <p className="font-medium mt-1">Ümumi {searchResults.length} nəticə tapıldı</p>}
            </div>
          </div>
        </motion.div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {searchResults.map((ad, idx) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <AdCard ad={ad as any} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <PackageOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Heç nə tapılmadı</h2>
            <p className="text-gray-500 font-medium">Filtrləri dəyişdirərək yenidən yoxlayın.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AxtarisPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-gray-500 font-bold">Yüklənir...</div>}>
      <SearchContent />
    </Suspense>
  );
}
