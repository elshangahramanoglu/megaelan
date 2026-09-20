"use client";

import React from "react";
import Link from "next/link";
import { Heart, Crown } from "lucide-react";
import { Ad, useAppContext } from "@/context/AppContext";

export default function AdCard({ ad }: { ad: Ad }) {
  const { favorites, toggleFavorite } = useAppContext();
  const isFav = favorites.includes(ad.id);

  return (
    <Link 
      href={`/elan/${ad.id}`} 
      className="group cursor-pointer bg-white rounded-2xl flex flex-col hover:shadow-lg transition-shadow border border-gray-100 h-[320px] overflow-hidden"
    >
      <div className="h-44 bg-gray-100 relative w-full flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium group-hover:scale-105 transition-transform duration-500">
          {ad.imagePlaceholder}
        </div>
        {ad.isPremium && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
            <Crown className="w-3 h-3" /> Premium
          </div>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(ad.id);
          }}
          className="absolute top-2 right-2 p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors z-10"
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-xl text-gray-900 mb-1">
            {ad.price} <span className="text-sm font-normal">{ad.currency}</span>
          </h3>
          <p className="text-gray-700 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {ad.title}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-400 text-xs truncate max-w-[80%]">{ad.city}, {ad.date}</p>
          {ad.isPremium && <Crown className="w-4 h-4 text-orange-500 flex-shrink-0" />}
        </div>
      </div>
    </Link>
  );
}
