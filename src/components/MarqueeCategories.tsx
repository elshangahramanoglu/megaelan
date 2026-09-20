"use client";

import React from "react";
import { motion } from "framer-motion";
import { categoriesData } from "@/data/categories";
import Link from "next/link";

export default function MarqueeCategories() {
  // Duplicate categories to make infinite scroll seamless
  const marqueeItems = [...categoriesData, ...categoriesData];

  return (
    <div className="w-full overflow-hidden bg-white py-12 relative flex">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-6 whitespace-nowrap px-6"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          ease: "linear",
          duration: 30, // slow and smooth
          repeat: Infinity,
        }}
      >
        {marqueeItems.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={`${cat.id}-${index}`}
              href={`/kateqoriya/${cat.id}`}
              className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-slate-50 border border-gray-100 rounded-3xl w-[180px] h-[180px] hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Icon className="w-10 h-10 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-800 text-center text-sm whitespace-normal leading-tight group-hover:text-blue-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
