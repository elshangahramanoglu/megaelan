"use client";

import React from "react";
import { motion } from "framer-motion";
import { categoriesData } from "@/data/categories";
import Link from "next/link";

export default function MarqueeCategories() {
  const marqueeItems = categoriesData;

  return (
    <div className="w-full overflow-hidden bg-white py-8 md:py-12 relative flex">
      
      
      
      <div
        className="flex gap-4 md:gap-6 px-4 md:px-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 pt-2"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {marqueeItems.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={`${cat.id}-${index}`}
              href={`/kateqoriya/${cat.id}`}
              className="flex-shrink-0 flex flex-col items-center justify-start pt-4 px-2 pb-2 bg-slate-50/50 border border-gray-100 rounded-2xl w-[90px] h-[110px] md:w-[140px] md:h-[160px] hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group snap-start"
            >
              <div className="w-14 h-14 md:w-24 md:h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-2 md:mb-4 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                {(cat.image.includes('.png') || cat.image.includes('http')) ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Icon className="w-6 h-6 md:w-10 md:h-10 text-blue-600" />
                )}
              </div>
              <span className="font-bold text-gray-800 text-center text-[10px] md:text-sm whitespace-normal leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 w-full">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
