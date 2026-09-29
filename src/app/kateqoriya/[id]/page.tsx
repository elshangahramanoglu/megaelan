"use client";

import React, { use, useState, useEffect } from "react";
import { categoriesData } from "@/data/categories";
import { useAppContext } from "@/context/AppContext";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import { ChevronRight, ArrowUpDown, Filter } from "lucide-react";
import { AZERBAIJAN_CITIES } from "@/data/cities";

export default function CategoryPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ sub?: string }> }) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  
  const categoryId = resolvedParams.id;
  const initialSubCategory = resolvedSearchParams.sub;
  
  const { ads, isUserLoaded, isAdsLoaded } = useAppContext();
  
  const [mounted, setMounted] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "cheapest" | "expensive">("newest");
  
  // Filters state
  const [subCategory, setSubCategory] = useState(initialSubCategory || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState("Bütün şəhərlər");
  const [sellerType, setSellerType] = useState("Bütün");
  const [delivery, setDelivery] = useState("Fərqi yoxdur");

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Sync URL subCategory with state if it changes
  useEffect(() => {
    if (initialSubCategory !== undefined) {
      setSubCategory(initialSubCategory);
    }
  }, [initialSubCategory]);

  if (!mounted || !isUserLoaded || !isAdsLoaded) return <div className="h-screen flex items-center justify-center text-blue-600"><span className="animate-pulse font-bold text-lg">Yüklənir...</span></div>;

  const category = categoriesData.find(c => c.id === categoryId);
  
  if (!category) {
    return <div className="text-center py-20 text-xl font-bold">Kateqoriya tapılmadı!</div>;
  }

  // Filter ads for this category + advanced filters
  const categoryAds = ads.filter(ad => {
    if (ad.categoryId !== categoryId) return false;
    
    // Subcategory filter
    if (subCategory && ad.subCategory !== subCategory) return false;
    
    // Price filter
    if (minPrice && ad.price < Number(minPrice)) return false;
    if (maxPrice && ad.price > Number(maxPrice)) return false;
    
    // City filter
    if (city !== "Bütün şəhərlər" && ad.city !== city) return false;
    
    // Seller Type filter
    if (sellerType !== "Bütün") {
      const adSellerType = ad.details?.sellerType || "Fərdi";
      if (adSellerType !== sellerType) return false;
    }
    
    // Delivery filter
    if (delivery !== "Fərqi yoxdur") {
      const adDelivery = ad.details?.delivery === "Var";
      if (delivery === "Çatdırılma var" && !adDelivery) return false;
      if (delivery === "Çatdırılma yoxdur" && adDelivery) return false;
    }

    return true;
  });
  
  // Sort ads (Premium > VIP > Regular, then by selected sort order)
  categoryAds.sort((a, b) => {
    // 1. Premium ads always first
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    
    // 2. VIP ads second
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    
    // 3. Then selected sort order
    if (sortOrder === "cheapest") {
      return a.price - b.price;
    } else if (sortOrder === "expensive") {
      return b.price - a.price;
    } else {
      return parseInt(b.id.replace('new-', '')) - parseInt(a.id.replace('new-', ''));
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600 font-medium">Ana səhifə</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/kateqoriya/${category.id}`} onClick={() => setSubCategory("")} className={`hover:text-blue-600 font-medium ${!subCategory ? 'text-black font-bold' : ''}`}>
          {category.name}
        </Link>
        {subCategory && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="font-bold text-black">{subCategory}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 flex flex-col gap-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6 sticky top-24">
            
            {/* Subcategories */}
            <div>
              <h2 className="text-lg font-black text-black mb-4 flex items-center gap-2">
                <category.icon className="w-5 h-5 text-blue-600" />
                {category.name}
              </h2>
              <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                <li>
                  <button 
                    onClick={() => setSubCategory("")}
                    className={`block py-1 text-sm text-left w-full ${!subCategory ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium hover:text-blue-600'}`}
                  >
                    Bütün alt kateqoriyalar
                  </button>
                </li>
                {category.subcategories.map(sub => (
                  <li key={sub}>
                    <button 
                      onClick={() => setSubCategory(sub)}
                      className={`block py-1 text-sm text-left w-full ${subCategory === sub ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium hover:text-blue-600'}`}
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-gray-200" />

            {/* Advanced Filters */}
            <div>
              <h3 className="text-base font-black text-gray-800 flex items-center gap-2 mb-4"><Filter className="w-4 h-4" /> Əlavə filtrlər</h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Şəhər</label>
                  <select value={city} onChange={e => setCity(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800 text-sm">
                    {AZERBAIJAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Qiymət (AZN)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2 p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium text-sm" />
                    <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2 p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Satıcı növü</label>
                  <select value={sellerType} onChange={e => setSellerType(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800 text-sm">
                    <option value="Bütün">Fərqi yoxdur</option>
                    <option value="Fərdi">Fərdi</option>
                    <option value="Mağaza">Mağaza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Çatdırılma</label>
                  <select value={delivery} onChange={e => setDelivery(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-gray-200 outline-none focus:border-blue-500 font-medium text-gray-800 text-sm">
                    <option value="Fərqi yoxdur">Fərqi yoxdur</option>
                    <option value="Çatdırılma var">Çatdırılma var</option>
                    <option value="Çatdırılma yoxdur">Çatdırılma yoxdur</option>
                  </select>
                </div>

                <button 
                  onClick={() => { setMinPrice(""); setMaxPrice(""); setCity("Bütün şəhərlər"); setSellerType("Bütün"); setDelivery("Fərqi yoxdur"); }}
                  className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors mt-2 text-sm"
                >
                  Filtrləri təmizlə
                </button>
              </div>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-black">
                {subCategory ? subCategory : category.name}
              </h1>
              <p className="text-gray-500 font-medium mt-2">Bu kriteriyalara uyğun {categoryAds.length} elan tapıldı</p>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'cheapest' | 'expensive')}
                className="bg-transparent border-none outline-none text-black font-bold cursor-pointer text-sm"
              >
                <option value="newest">Ən yenilər</option>
                <option value="cheapest">Ucuzdan bahaya</option>
                <option value="expensive">Bahadan ucuza</option>
              </select>
            </div>
          </div>

          {categoryAds.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {categoryAds.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Filter className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">Heç nə tapılmadı</h2>
              <p className="text-gray-500 font-medium">Bu filtrlərə uyğun elan yoxdur. Filtrləri dəyişdirib yenidən yoxlayın.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
