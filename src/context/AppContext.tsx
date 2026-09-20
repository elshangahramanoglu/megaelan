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
  const generated: Ad[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const isPremium = i <= 10;
    const categoryId = (Math.floor(Math.random() * 15) + 1).toString();
    const isFree = Math.random() > 0.85; // 15% chance of being 0 AZN
    
    generated.push({
      id: i.toString(),
      title: `Nümunəvi Elan Başlığı ${i} - Əla Vəziyyətdə`,
      price: isFree ? 0 : Math.floor(Math.random() * 1000) + 10,
      currency: "AZN",
      city: cities[Math.floor(Math.random() * cities.length)],
      date: `Bu gün, ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      categoryId,
      isPremium,
      imagePlaceholder: `Şəkil ${i}`,
      description: "Bu elan yalnız test məqsədi ilə yaradılmışdır. Əslində belə bir məhsul yoxdur, ancaq MegaElan saytının görünüşünü və funksionallığını yoxlamaq üçün əlavə edilib.",
      contactName: "İstifadəçi " + i,
      contactPhone: "+994 50 123 45 67"
    });
  }
  return generated;
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
