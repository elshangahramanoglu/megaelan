"use client";

import React, { use } from "react";
import { useAppContext } from "@/context/AppContext";
import { categoriesData } from "@/data/categories";
import { Heart, Share2, MapPin, Phone, MessageCircle, AlertTriangle, ChevronRight, Crown } from "lucide-react";
import Link from "next/link";
import AdCard from "@/components/AdCard";

export default function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const adId = resolvedParams.id;
  const { ads, favorites, toggleFavorite } = useAppContext();
  
  const ad = ads.find(a => a.id === adId);
  const isFav = favorites.includes(adId);

  if (!ad) {
    return <div className="text-center py-20 text-xl font-bold">Elan tapılmadı!</div>;
  }

  const category = categoriesData.find(c => c.id === ad.categoryId);
  
  // Get similar ads (same category)
  const similarAds = ads.filter(a => a.categoryId === ad.categoryId && a.id !== ad.id).slice(0, 5);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Ana səhifə</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/kateqoriya/${category?.id}`} className="hover:text-blue-600">
          {category?.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900 line-clamp-1">{ad.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* Image Gallery (Placeholder) */}
          <div className="bg-gray-100 rounded-3xl aspect-[4/3] flex items-center justify-center text-gray-400 text-2xl font-medium border border-gray-200 relative overflow-hidden">
            {ad.imagePlaceholder}
            {ad.isPremium && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-md">
                <Crown className="w-4 h-4" /> Premium
              </div>
            )}
          </div>

          {/* Title and Details */}
          <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{ad.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {ad.city}</span>
                  <span>{ad.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleFavorite(ad.id)}
                  className={`p-3 rounded-full border transition-colors ${isFav ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-red-500'}`}
                >
                  <Heart className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:text-blue-600 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="text-3xl font-bold text-blue-600">
              {ad.price} <span className="text-xl font-medium">{ad.currency}</span>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-lg mb-3">Məzmun</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {ad.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Contact Box */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                {ad.contactName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{ad.contactName}</h3>
                <p className="text-gray-500 text-sm">MegaElan istifadəçisi</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a href={`tel:${ad.contactPhone}`} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl transition-colors">
                <Phone className="w-5 h-5" />
                {ad.contactPhone}
              </a>
              
              <Link href="/mesajlar" className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl transition-colors">
                <MessageCircle className="w-5 h-5" />
                Mesaj yaz
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 cursor-pointer transition-colors gap-2 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Şikayət et
            </div>
          </div>
          
          {/* Promo Box */}
          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-md text-center">
            <Crown className="w-10 h-10 mx-auto text-orange-400 mb-4" />
            <h3 className="font-bold text-xl mb-2">Daha çox müştəri!</h3>
            <p className="text-blue-100 mb-6 text-sm">Elanınızı Premium edərək daha çox insanın görməsini təmin edin.</p>
            <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Premium et
            </button>
          </div>
        </div>
      </div>

      {/* Similar Ads */}
      {similarAds.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Bənzər elanlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {similarAds.map(similarAd => (
              <AdCard key={similarAd.id} ad={similarAd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
