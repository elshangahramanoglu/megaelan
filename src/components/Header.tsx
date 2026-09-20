"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Menu, 
  Search, 
  Heart, 
  MessageCircle, 
  User,
  LayoutGrid,
  ChevronRight
} from "lucide-react";
import { categoriesData } from "@/data/categories";
import LoginModal from "./LoginModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-4 md:px-8 py-3">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-gray-600 hover:text-blue-600">
                <Menu className="w-6 h-6" />
              </button>
              <Link href="/" className="text-2xl font-black tracking-tight text-blue-600 flex items-center gap-1">
                MegaElan
              </Link>
            </div>

            {/* Catalog Button */}
            <button 
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className="hidden lg:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            >
              <LayoutGrid className="w-5 h-5" />
              Kataloq
            </button>

            {/* Search Bar */}
            <div className="flex-1 hidden md:flex items-center bg-gray-100 rounded-lg border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all overflow-hidden">
              <input 
                type="text" 
                placeholder="Əşya və ya xidmət axtarışı" 
                className="w-full px-4 py-2.5 bg-transparent outline-none text-gray-700"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 font-medium transition-colors">
                Tap
              </button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">
                <MessageCircle className="w-6 h-6" />
              </button>
              
              <Link href="/yeni-elan" className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
                <span className="text-xl leading-none">+</span> Yeni elan
              </Link>

              <button 
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center justify-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {isCatalogOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCatalogOpen(false)}
                className="fixed inset-0 top-[73px] bg-black/20 z-30"
              />
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 w-full bg-white border-b border-gray-200 shadow-xl z-40"
              >
                <div className="w-full max-w-7xl mx-auto flex h-[500px]">
                  {/* Categories List */}
                  <div className="w-1/3 border-r border-gray-100 overflow-y-auto py-4">
                    {categoriesData.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onMouseEnter={() => setActiveCategory(cat)}
                          onClick={() => setActiveCategory(cat)}
                          className={`w-full flex items-center justify-between px-8 py-3 transition-colors ${
                            isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-0"}`} />
                        </button>
                      );
                    })}
                  </div>
                  {/* Subcategories */}
                  <div className="w-2/3 p-8 overflow-y-auto bg-slate-50">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <activeCategory.icon className="w-6 h-6 text-blue-600" />
                      {activeCategory.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {activeCategory.subcategories.map((sub, idx) => (
                        <Link 
                          key={idx} 
                          href="#"
                          onClick={() => setIsCatalogOpen(false)}
                          className="text-gray-600 hover:text-blue-600 hover:underline p-2"
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
      </header>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
