"use client";

import React, { use, useState } from "react";
import { categoriesData } from "@/data/categories";
import { useAppContext } from "@/context/AppContext";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import { ChevronRight, ArrowUpDown } from "lucide-react";

export default function CategoryPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ sub?: string }> }) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  
  const categoryId = resolvedParams.id;
  const subCategory = resolvedSearchParams.sub;
  
  const [sortOrder, setSortOrder] = useState<"newest" | "cheapest" | "expensive">("newest");
  
  const { ads } = useAppContext();
  
  const category = categoriesData.find(c => c.id === categoryId);
  
  if (!category) {
    return <div className="text-center py-20 text-xl font-bold">Kateqoriya tapılmadı!</div>;
  }

  // Filter ads for this category
  let categoryAds = ads.filter(ad => ad.categoryId === categoryId);
  
  // Sort ads
  if (sortOrder === "cheapest") {
    categoryAds.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "expensive") {
    categoryAds.sort((a, b) => b.price - a.price);
  } else {
    // "newest" sorting logic based on ID string assuming it was created sequentially
    // In a real app we'd sort by date
    categoryAds.sort((a, b) => parseInt(b.id.replace('new-', '')) - parseInt(a.id.replace('new-', '')));
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Ana səhifə</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/kateqoriya/${category.id}`} className={`hover:text-blue-600 ${!subCategory ? 'font-medium text-black' : ''}`}>
          {category.name}
        </Link>
        {subCategory && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-black">{subCategory}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <category.icon className="w-5 h-5 text-blue-600" />
              {category.name}
            </h2>
            <ul className="space-y-2">
              {category.subcategories.map(sub => (
                <li key={sub}>
                  <Link 
                    href={`/kateqoriya/${category.id}?sub=${encodeURIComponent(sub)}`}
                    className={`block py-1.5 text-sm ${subCategory === sub ? 'text-blue-600 font-bold' : 'text-gray-700 font-medium hover:text-blue-600'}`}
                  >
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-black">
                {subCategory ? subCategory : category.name}
              </h1>
              <p className="text-gray-500 font-medium mt-2">{categoryAds.length} elan tapıldı</p>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-transparent border-none outline-none text-black font-bold cursor-pointer text-sm"
              >
                <option value="newest">Ən yenilər</option>
                <option value="cheapest">Ucuzdan bahaya</option>
                <option value="expensive">Bahadan ucuza</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {categoryAds.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          {categoryAds.length === 0 && (
            <div className="text-center py-20 text-gray-500 bg-slate-50 rounded-3xl font-medium">
              Bu kateqoriyada hələlik elan yoxdur.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
