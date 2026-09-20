import React from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import MarqueeCategories from "@/components/MarqueeCategories";

export default function Home_Page() {
  return (
    <div className="flex flex-col gap-0 pb-20 bg-white">
      {/* Marquee Animated Categories */}
      <section className="border-b border-gray-100">
        <MarqueeCategories />
      </section>

      {/* Premium Ads Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Premium elanlar
          </h2>
          <Link href="/premium" className="text-blue-600 font-medium hover:underline text-sm md:text-base">
            Hamısına bax
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Promote Box */}
          <div className="group cursor-pointer bg-blue-50 rounded-2xl flex flex-col items-center justify-center p-6 border border-blue-100 hover:border-blue-400 transition-colors h-[320px]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Crown className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-4 text-center">Elanı Premium et!</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors w-full">
              Premium et
            </button>
          </div>

          {/* Premium Ad Card Skeletons */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group cursor-pointer bg-white rounded-2xl flex flex-col hover:shadow-lg transition-shadow border border-gray-100 h-[320px] overflow-hidden">
              <div className="h-44 bg-gray-100 relative w-full">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                  Şəkil
                </div>
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Mağaza
                </div>
                <div className="absolute top-2 right-2 p-1.5 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
                  <HeartIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{(Math.random() * 1000 + 100).toFixed()} <span className="text-sm font-normal">AZN</span></h3>
                  <p className="text-gray-700 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    Nümunə Premium Elan Başlığı - Çox əla vəziyyətdədir
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-400 text-xs truncate max-w-[80%]">Bakı, bu gün 14:32</p>
                  <Crown className="w-4 h-4 text-orange-500 flex-shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Ads Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Son elanlar</h2>
          <Link href="/elanlar" className="text-blue-600 font-medium hover:underline text-sm md:text-base">
            Hamısına bax
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Normal Ad Card Skeletons */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div key={item} className="group cursor-pointer bg-white rounded-2xl flex flex-col hover:shadow-lg transition-shadow border border-gray-100 h-[320px] overflow-hidden">
              <div className="h-44 bg-gray-100 relative w-full">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                  Şəkil
                </div>
                <div className="absolute top-2 right-2 p-1.5 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
                  <HeartIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{(Math.random() * 500 + 50).toFixed()} <span className="text-sm font-normal">AZN</span></h3>
                  <p className="text-gray-700 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    Nümunə Adi Elan Başlığı - Yaxşı vəziyyətdə
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-gray-400 text-xs">Bakı, dünən 09:15</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function HeartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
