"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { categoriesData } from "@/data/categories";

export interface Ad {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  date: string;
  categoryId: string;
  subCategory?: string;
  isPremium: boolean;
  imagePlaceholder: string;
  description: string;
  contactName: string;
  contactPhone: string;
  details?: Record<string, string>;
}

interface User {
  phone: string;
  firstName: string;
  lastName: string;
}

interface AppContextType {
  ads: Ad[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  user: User | null;
  login: (phone: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addAd: (ad: Ad) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate 100 mock ads
const generateMockAds = (): Ad[] => {
  const cities = ["Bakı", "Sumqayıt", "Gəncə", "Xırdalan", "Mingəçevir", "Şirvan", "Quba", "Lənkəran"];
  
  // 1. First, create exactly one ad for every category
  const guaranteedAds: Ad[] = categoriesData.map((cat, i) => {
    return {
      id: (i + 1).toString(),
      title: `${cat.name} üçün əla təklif`,
      price: i % 5 === 0 ? 0 : Math.floor(Math.random() * 5000) + 10,
      currency: "AZN",
      city: cities[Math.floor(Math.random() * cities.length)],
      date: `Bu gün, ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      categoryId: cat.id,
      isPremium: i % 8 === 0,
      imagePlaceholder: `Şəkil ${i + 1}`,
      description: `Bu elan xüsusi olaraq ${cat.name} kateqoriyası üçün yaradılmışdır. Əla vəziyyətdədir.`,
      contactName: "İstifadəçi " + (i + 1),
      contactPhone: "+994 50 123 45 67"
    };
  });

  // 2. Then fill the rest up to 100 ads
  const randomAds: Ad[] = Array.from({ length: Math.max(0, 100 - categoriesData.length) }).map((_, i) => {
    const cat = categoriesData[Math.floor(Math.random() * categoriesData.length)];
    const actualIndex = categoriesData.length + i + 1;
    const isFree = Math.random() > 0.85;
    return {
      id: actualIndex.toString(),
      title: `${cat.name} - Əla vəziyyətdə ${actualIndex}`,
      price: isFree ? 0 : Math.floor(Math.random() * 1000) + 10,
      currency: "AZN",
      city: cities[Math.floor(Math.random() * cities.length)],
      date: `Bu gün, ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      categoryId: cat.id,
      isPremium: actualIndex % 12 === 0,
      imagePlaceholder: `Şəkil ${actualIndex}`,
      description: "Bu elan yalnız test məqsədi ilə yaradılmışdır. Əslində belə bir məhsul yoxdur, ancaq MegaElan saytının görünüşünü və funksionallığını yoxlamaq üçün əlavə edilib.",
      contactName: "İstifadəçi " + actualIndex,
      contactPhone: "+994 50 123 45 67"
    };
  });

  return [...guaranteedAds, ...randomAds];
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Client-side initialization to avoid hydration errors with random data
    setAds(generateMockAds());
    
    // Check local storage for user and favorites
    const savedUser = localStorage.getItem("megaelan_user");
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedFavs = localStorage.getItem("megaelan_favs");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("megaelan_favs", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const login = (phone: string) => {
    const newUser = { phone, firstName: "", lastName: "" };
    setUser(newUser);
    localStorage.setItem("megaelan_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("megaelan_user");
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem("megaelan_user", JSON.stringify(updated));
      return updated;
    });
  };

  const addAd = (ad: Ad) => {
    setAds(prev => [ad, ...prev]);
  };

  return (
    <AppContext.Provider value={{ ads, favorites, toggleFavorite, user, login, logout, updateUser, addAd }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
