"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, 
  Search, 
  Heart, 
  MessageCircle, 
  User,
  LayoutGrid,
  ChevronRight,
  ChevronDown,
  X,
  Filter
} from "lucide-react";
import { categoriesData } from "@/data/categories";
import LoginModal from "./LoginModal";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]);
  
  const { user } = useAppContext();
  const router = useRouter();

  const handleProfileClick = () => {
    if (user) {
      router.push("/kabinet");
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-4 md:px-8 py-3">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-black hover:text-blue-600"
              >
                <Menu className="w-7 h-7" />
              </button>
              <Link href="/" className="inline-block mix-blend-multiply flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="MegaElan" 
                  width={140} 
                  height={40} 
                  className="object-contain w-auto h-8 md:h-12"
                />
              </Link>
            </div>

            {/* Catalog Button */}
            <button 
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className="hidden lg:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-colors"
            >
              <LayoutGrid className="w-5 h-5" />
              Kataloq
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 hidden md:flex items-center bg-gray-100 rounded-xl border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all overflow-hidden relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Elanın başlığını yazın..." 
                className="w-full pl-4 pr-32 py-3 bg-transparent outline-none text-black font-medium placeholder-gray-500"
              />
              <button type="button" onClick={() => setIsFilterOpen(true)} className="absolute right-14 text-gray-500 hover:text-blue-600 px-3 font-medium flex items-center gap-1 border-l border-gray-300">
                <Filter className="w-4 h-4" /> Ətraflı
              </button>
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              <Link href="/beyendiklerim" className="p-2 text-black hover:text-blue-600 transition-colors hidden sm:block">
                <Heart className="w-6 h-6" />
              </Link>
              <Link href="/mesajlar" className="p-2 text-black hover:text-blue-600 transition-colors hidden sm:block">
                <MessageCircle className="w-6 h-6" />
              </Link>
              
              <Link href="/yeni-elan" className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-bold transition-colors">
                <span className="text-xl leading-none">+</span> Yeni elan
              </Link>

              <button 
                onClick={handleProfileClick}
                className="flex items-center justify-center p-2 text-black hover:text-blue-600 transition-colors"
                title={user ? "Şəxsi kabinet" : "Giriş"}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown (Desktop) */}
        <AnimatePresence>
          {isCatalogOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCatalogOpen(false)}
                className="fixed inset-0 top-[76px] bg-black/40 z-30"
              />
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 w-full bg-white border-b border-gray-200 shadow-2xl z-40"
              >
                <div className="w-full max-w-7xl mx-auto flex h-[500px]">
                  {/* Categories List */}
                  <div className="w-1/3 border-r border-gray-100 overflow-y-auto py-4 custom-scrollbar">
                    {categoriesData.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onMouseEnter={() => setActiveCategory(cat)}
                          onClick={() => {
                            setActiveCategory(cat);
                            router.push(`/kateqoriya/${cat.id}`);
                            setIsCatalogOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-8 py-3 transition-colors ${
                            isActive ? "bg-blue-50 text-blue-700" : "text-black hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-400"}`} />
                            <span className="font-bold text-sm md:text-base">{cat.name}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-0"}`} />
                        </button>
                      );
                    })}
                  </div>
                  {/* Subcategories */}
                  <div className="w-2/3 p-8 overflow-y-auto bg-slate-50 custom-scrollbar">
                    <h3 className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                      <activeCategory.icon className="w-6 h-6 text-blue-600" />
                      <Link href={`/kateqoriya/${activeCategory.id}`} onClick={() => setIsCatalogOpen(false)} className="hover:underline hover:text-blue-600">
                        {activeCategory.name}
                      </Link>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {activeCategory.subcategories.map((sub, idx) => (
                        <Link 
                          key={idx} 
                          href={`/kateqoriya/${activeCategory.id}?sub=${encodeURIComponent(sub)}`}
                          onClick={() => setIsCatalogOpen(false)}
                          className="text-black font-medium hover:text-blue-600 hover:bg-white p-3 rounded-lg border border-transparent hover:border-blue-100 transition-all shadow-sm hover:shadow-md"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Menu & Subcategories */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 bg-white z-50 flex flex-col h-[100dvh] overflow-hidden lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <Image src="/logo.png" alt="MegaElan" width={120} height={35} className="object-contain mix-blend-multiply" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-black bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pb-20">
                <div className="p-4 flex flex-col gap-3 border-b border-gray-100">
                  <Link href="/yeni-elan" onClick={() => setIsMobileMenuOpen(false)} className="bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-lg">
                    <span className="text-2xl leading-none">+</span> Yeni elan
                  </Link>
                  <div className="flex gap-3">
                    <Link href="/beyendiklerim" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-gray-100 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" /> Seçilmişlər
                    </Link>
                    <Link href="/mesajlar" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-gray-100 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" /> Mesajlar
                    </Link>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-black text-xl text-black mb-4">Kataloq</h3>
                  <div className="flex flex-col gap-2">
                    {categoriesData.map(cat => (
                      <div key={cat.id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                        <button 
                          onClick={() => setActiveMobileCategory(activeMobileCategory === cat.id ? null : cat.id)}
                          className="w-full p-4 flex items-center justify-between font-bold text-black"
                        >
                          <div className="flex items-center gap-3">
                            <cat.icon className="w-5 h-5 text-blue-600" />
                            {cat.name}
                          </div>
                          <ChevronDown className={`w-5 h-5 transition-transform ${activeMobileCategory === cat.id ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
                        </button>
                        
                        <AnimatePresence>
                          {activeMobileCategory === cat.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-white border-t border-gray-100 flex flex-col"
                            >
                              <Link 
                                href={`/kateqoriya/${cat.id}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-4 font-bold text-blue-600 border-b border-gray-50"
                              >
                                Bütün {cat.name} elanları
                              </Link>
                              {cat.subcategories.map(sub => (
                                <Link 
                                  key={sub}
                                  href={`/kateqoriya/${cat.id}?sub=${encodeURIComponent(sub)}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="p-4 font-medium text-gray-700 border-b border-gray-50 hover:bg-gray-50"
                                >
                                  {sub}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Advanced Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl font-black text-black">Ətraflı Axtarış</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-black">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-black font-bold mb-2">Kateqoriya</label>
                    <select className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-black font-medium">
                      <option value="">Bütün kateqoriyalar</option>
                      {categoriesData.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black font-bold mb-2">Min Qiymət</label>
                      <input type="number" placeholder="0" className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-black font-medium" />
                    </div>
                    <div>
                      <label className="block text-black font-bold mb-2">Max Qiymət</label>
                      <input type="number" placeholder="0" className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-black font-medium" />
                    </div>
                  </div>
                  {/* Dynamic inputs simulation */}
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 font-medium">
                    Kateqoriya seçdikdən sonra həmin kateqoriyaya uyğun əlavə filtrlər (Marka, Model, Vəziyyət və s.) burada avtomatik görünəcək.
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-4">
                <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-4 font-bold text-black bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Təmizlə
                </button>
                <button onClick={() => setIsFilterOpen(false)} className="flex-[2] py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/30">
                  Göstər
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
