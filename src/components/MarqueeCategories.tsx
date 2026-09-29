"use client";

import React, { useRef, useEffect, useState } from "react";
import { categoriesData } from "@/data/categories";
import Link from "next/link";
import Image from "next/image";

export default function MarqueeCategories() {
  const marqueeItems = [...categoriesData, ...categoriesData, ...categoriesData, ...categoriesData];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const scrollContainer = scrollRef.current;
    
    const scrollStep = () => {
      if (scrollContainer && !isPaused) {
        scrollContainer.scrollLeft += 1;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <div className="w-full overflow-hidden bg-white py-8 md:py-12 relative flex">
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div ref={scrollRef}
        className="flex gap-4 md:gap-6 whitespace-nowrap px-4 w-max overflow-x-auto hide-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}>
        {marqueeItems.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <Link 
              key={`${cat.id}-${index}`}
              href={`/kateqoriya/${cat.id}`}
              className="flex-shrink-0 flex flex-col items-center justify-start p-4 md:p-6 bg-slate-50 border border-gray-100 rounded-3xl w-[110px] h-[130px] md:w-[180px] md:h-[180px] hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-2 md:mb-4 shadow-sm group-hover:scale-110 transition-transform overflow-hidden relative">
                {(cat.image.includes('.png') || cat.image.includes('http')) ? (
                  <Image src={cat.image} fill sizes="96px" className="object-cover rounded-2xl" alt={cat.name} />
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
