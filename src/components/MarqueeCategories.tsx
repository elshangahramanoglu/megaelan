"use client";

import React from "react";
import { motion } from "framer-motion";
import { categoriesData } from "@/data/categories";
import Link from "next/link";

export default function MarqueeCategories() {
  const marqueeItems = [...categoriesData, ...categoriesData];

  return (
    <div className="w-full overflow-hidden bg-white py-8 md:py-12 relative flex">
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-4 md:gap-6 whitespace-nowrap px-4"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          ease: "linear",
          duration: 40,
          repeat: Infinity,
        }}
      >
        {marqueeItems.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={`${cat.id}-${index}`}
              href={`/kateqoriya/${cat.id}`}
              className="flex-shrink-0 flex flex-col items-center justify-center p-4 md:p-6 bg-slate-50 border border-gray-100 rounded-3xl w-[120px] h-[120px] md:w-[180px] md:h-[180px] hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-2 md:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 md:w-10 md:h-10 text-blue-600" />
              </div>
              <span className="font-bold text-black text-center text-xs md:text-sm whitespace-normal leading-tight group-hover:text-blue-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
