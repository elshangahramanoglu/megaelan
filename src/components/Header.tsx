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
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]);
  
  const { user, setLoginOpen, favorites = [], ads = [] } = useAppContext();
  const router = useRouter();

  const handleProfileClick = () => {
    if (user) {
      router.push("/kabinet");
    } else {
      setLoginOpen(true);
    }
  };

  
  const searchResults = searchQuery.trim().length > 1 
    ? ads.filter(ad => ad.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileSearchOpen(false);
      setIsSearchFocused(false);
      router.push(`/axtaris?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-3 flex items-center justify-between">
          
          {/* Mobile Menu Toggle (Left on Mobile) */}
          <div className="flex md:hidden flex-1 justify-start">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-black hover:text-blue-600"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>

          {/* Logo (Centered on Mobile, Left on Desktop) */}
          <div className="flex flex-1 md:flex-none md:w-[25%] justify-center md:justify-start">
            <Link 
              href="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center flex-shrink-0"
            >
              {/* Desktop View: Icon + Text */}
              <div className="hidden md:flex items-center gap-2">
                <Image src="/LogoMobilBrauzer.png" alt="MegaElan Logo" width={200} height={200} className="w-auto h-8 lg:h-10 object-contain" priority quality={100} unoptimized />
                <Image 
                  src="/LogoMobilBrauzerText.png" 
                  alt="MegaElan Text" 
                  width={150} height={40} 
                  className="w-auto h-6 lg:h-8 object-contain" 
                  priority 
                />
              </div>

              {/* Mobile View: Icon + Text */}
              <div className="flex md:hidden items-center gap-1.5">
                <Image src="/LogoMobilBrauzer.png" alt="MegaElan Logo" width={150} height={150} className="w-auto h-7 object-contain" priority quality={100} unoptimized />
                <Image 
                  src="/LogoMobilBrauzerText.png" 
                  alt="MegaElan" 
                  width={140} height={40} 
                  className="w-auto h-6 object-contain" 
                  priority 
                />
              </div>
            </Link>
          </div>

          {/* Search Bar (Centered on Desktop, Hidden on Mobile) */}
          <div className={`${isMobileSearchOpen ? "absolute top-full left-0 w-full bg-white p-4 shadow-xl border-t border-gray-100 flex z-50 animate-in slide-in-from-top-4 fade-in duration-300" : "hidden md:flex"} flex-1 justify-center md:px-4 max-w-3xl`}>
            <div className="w-full relative group">
            <form onSubmit={handleSearchSubmit} className="w-full flex items-center bg-gray-100 rounded-xl border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all overflow-hidden relative z-50">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
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
            
            {/* Live Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 1 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map(ad => (
                      <Link 
                        key={ad.id} 
                        href={`/elan/${ad.id}`}
                        onClick={() => { setIsSearchFocused(false); setSearchQuery(""); }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {ad.images?.[0] ? (
                            <Image src={ad.images[0]} alt={ad.title} fill className="object-cover" sizes="48px" priority={true} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Yoxdur</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 truncate">{ad.title}</p>
                          <p className="text-blue-600 font-bold text-xs">{ad.price} {ad.currency}</p>
                        </div>
                      </Link>
                    ))}
                    <button 
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-center text-sm text-blue-600 font-bold hover:bg-blue-50 transition-colors bg-gray-50/50"
                    >
                      Bütün nəticələrə bax
                    </button>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 font-medium">
                    Heç nə tapılmadı
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          {/* Right Icons (Right aligned on Mobile and Desktop) */}
          <div className="flex flex-1 md:flex-none md:w-[25%] items-center justify-end gap-3 sm:gap-5">
              <Link href="/beyendiklerim" className="p-2 text-black hover:text-blue-600 transition-colors hidden sm:block">
                <div className="relative">
                  <Heart className="w-6 h-6" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </div>
              </Link>
              <Link href="/mesajlar" className="p-2 text-black hover:text-blue-600 transition-colors hidden sm:block">
                <MessageCircle className="w-6 h-6" />
              </Link>
              
              <Link href="/yeni-elan" className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-bold transition-colors">
                <span className="text-xl leading-none">+</span> Yeni elan
              </Link>

              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="flex md:hidden items-center justify-center p-2.5 text-black bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              <button 
                onClick={handleProfileClick}
                className="hidden md:flex items-center justify-center p-2 text-black hover:text-blue-600 transition-colors"
                title={user ? "Şəxsi kabinet" : "Giriş"}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden relative">
                  {user?.avatar ? <Image src={user.avatar} priority fill sizes="40px" className="object-cover" alt="Profil" /> : <User className="w-5 h-5" />}
                </div>
              </button>
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
                      {activeCategory.image.includes('.png') ? (
                          <img src={activeCategory.image} className="w-6 h-6 object-contain" />
                        ) : (
                          <activeCategory.icon className="w-6 h-6 text-blue-600" />
                        )}
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
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 bg-white z-50 flex flex-col h-[100dvh] overflow-hidden lg:hidden"
            >
              <div className="flex items-center justify-center p-4 border-b border-gray-100 relative">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="flex items-center gap-1.5"
                >
                  <Image src="/LogoMobilBrauzer.png" alt="MegaElan Logo" width={150} height={150} className="h-7 w-auto object-contain" priority quality={100} unoptimized />
                  <Image src="/LogoMobilBrauzerText.png" alt="MegaElan" width={120} height={35} className="h-5 w-auto object-contain" />
                </button>
                <button onClick={() => setIsMobileMenuOpen(false)} className="absolute right-4 p-2 text-black bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              
              <div className="flex-1 overflow-y-auto pb-20">
                <div className="p-4 flex flex-col gap-3 border-b border-gray-100">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-2" onClick={() => { setIsMobileMenuOpen(false); handleProfileClick(); }}>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden relative shadow-sm border border-gray-200">
                      {user?.avatar ? <Image src={user.avatar} priority fill sizes="48px" className="object-cover" alt="Profil" /> : <User className="w-6 h-6 text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-black text-lg">{user ? (user.name || "İstifadəçi") : "Giriş / Qeydiyyat"}</p>
                      <p className="text-gray-500 text-sm font-medium">{user ? "Şəxsi kabinet" : "Hesabınıza daxil olun"}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                  
                  <Link href="/yeni-elan" onClick={() => setIsMobileMenuOpen(false)} className="bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-lg">
                    <span className="text-2xl leading-none">+</span> Yeni elan
                  </Link>
                  <div className="flex gap-3">
                    <Link href="/beyendiklerim" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-gray-100 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                      <div className="relative">
                        <Heart className="w-5 h-5" />
                        {favorites.length > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                            {favorites.length}
                          </span>
                        )}
                      </div> Bəyəndiklərim
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
                            {(cat.image.includes('.png') || cat.image.includes('http')) ? (
                              <img src={cat.image} className="w-5 h-5 object-contain" />
                            ) : (
                              <cat.icon className="w-5 h-5 text-blue-600" />
                            )}
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
      
      
    </>
  );
}
