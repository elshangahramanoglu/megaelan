"use client";

import React, { use } from "react";
import { categoriesData } from "@/data/categories";
import { useAppContext } from "@/context/AppContext";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CategoryPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ sub?: string }> }) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  
  const categoryId = resolvedParams.id;
  const subCategory = resolvedSearchParams.sub;
  
  const { ads } = useAppContext();
  
  const category = categoriesData.find(c => c.id === categoryId);
  
  if (!category) {
    return <div className="text-center py-20 text-xl font-bold">Kateqoriya tapılmadı!</div>;
  }

  // Filter ads for this category
  let categoryAds = ads.filter(ad => ad.categoryId === categoryId);
  // Note: Since mock ads don't have subCategories assigned, all ads for categoryId will show up for now

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">Ana səhifə</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/kateqoriya/${category.id}`} className={`hover:text-blue-600 ${!subCategory ? 'font-medium text-gray-900' : ''}`}>
          {category.name}
        </Link>
        {subCategory && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">{subCategory}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4">
          <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <category.icon className="w-5 h-5 text-blue-600" />
              {category.name}
            </h2>
            <ul className="space-y-2">
              {category.subcategories.map(sub => (
                <li key={sub}>
                  <Link 
                    href={`/kateqoriya/${category.id}?sub=${encodeURIComponent(sub)}`}
                    className={`block py-1 text-sm ${subCategory === sub ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {subCategory ? subCategory : category.name}
            </h1>
            <p className="text-gray-500 mt-2">{categoryAds.length} elan tapıldı</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {categoryAds.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          {categoryAds.length === 0 && (
            <div className="text-center py-20 text-gray-500 bg-slate-50 rounded-2xl">
              Bu kateqoriyada hələlik elan yoxdur.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
