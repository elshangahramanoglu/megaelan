"use client";

import { useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import AdCard from "@/components/AdCard";
import { Search, PackageOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const { ads, isUserLoaded } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isUserLoaded) return <div className="h-screen flex items-center justify-center text-gray-500 font-bold">Yüklənir...</div>;

  const searchResults = q.trim()
    ? ads.filter(ad => 
        ad.title.toLowerCase().includes(q.toLowerCase()) && 
        ad.status === 'active'
      )
    : [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8 bg-blue-50 text-blue-700 p-6 rounded-3xl border border-blue-100"
      >
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Search className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Axtarış nəticələri</h1>
          <p className="font-medium mt-1">"{q}" üçün {searchResults.length} nəticə tapıldı</p>
        </div>
      </motion.div>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
          {searchResults.map((ad, idx) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <AdCard ad={ad as any} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
            <PackageOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Heç nə tapılmadı</h2>
          <p className="text-gray-500 font-medium">Başqa sözlərlə axtarış etməyi yoxlayın və ya kateqoriyalara göz atın.</p>
        </motion.div>
      )}
    </div>
  );
}

export default function AxtarisPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-gray-500 font-bold">Yüklənir...</div>}>
      <SearchContent />
    </Suspense>
  );
}
