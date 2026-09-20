"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { categoriesData } from "@/data/categories";
import { supabase } from "@/lib/supabase";

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
  images?: string[];
  description: string;
  contactName: string;
  contactPhone: string;
  details?: Record<string, string>;
  user_id?: string;
  status?: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
}

interface AppContextType {
  ads: Ad[];
  favorites: string[];
  toggleFavorite: (adId: string) => void;
  user: User | null;
  isLoginOpen: boolean;
  setLoginOpen: (val: boolean) => void;
  loginUser: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addAd: (ad: Ad) => void;
  removeAd: (id: string) => void;
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
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initialize mock data and fetch real data from Supabase
    const timer = setTimeout(async () => {
      const mockAds = generateMockAds();
      
      try {
        const { data: realAds, error } = await supabase
          .from('ads')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
          
        if (!error && realAds) {
          // Convert Supabase ads to our local Ad type
          const formattedRealAds = realAds.map(dbAd => ({
            id: dbAd.id,
            title: dbAd.title,
            price: dbAd.price,
            currency: dbAd.currency || "AZN",
            city: dbAd.city,
            date: new Date(dbAd.created_at).toLocaleDateString(),
            categoryId: dbAd.category_id,
            subCategory: dbAd.sub_category,
            isPremium: dbAd.is_premium || false,
            imagePlaceholder: dbAd.images && dbAd.images.length > 0 ? dbAd.images[0] : "Şəkil",
            images: dbAd.images || [],
            description: dbAd.description,
            contactName: dbAd.contact_name,
            contactPhone: dbAd.contact_phone,
            details: dbAd.details || {}
          }));
          
          // Combine real ads (top) with mock ads (bottom)
          setAds([...formattedRealAds, ...mockAds]);
        } else {
          setAds(mockAds);
        }
      } catch (err) {
        setAds(mockAds);
      }
    }, 0);
    
    // Check local storage for user and favorites
    const savedUser = localStorage.getItem("megaelan_user");
    // eslint-disable-next-line
    if (savedUser) {
      setTimeout(() => setUser(JSON.parse(savedUser)), 0);
    }
    
    const savedFavs = localStorage.getItem("megaelan_favs");
    // eslint-disable-next-line
    if (savedFavs) {
      setTimeout(() => setFavorites(JSON.parse(savedFavs)), 0);
    }

    return () => clearTimeout(timer);
  }, []);

  // Prevent rendering children until mounted to avoid hydration mismatches 
  // on any component that uses context data immediately
  

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("megaelan_favs", JSON.stringify(newFavs));
      return newFavs;
    });
  };
  const loginUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("megaelan_user", JSON.stringify(userData));
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

  const removeAd = (id: string) => {
    setAds(prev => prev.filter(ad => ad.id !== id));
  };

  return (
    <AppContext.Provider value={{ ads, favorites, toggleFavorite, user, isLoginOpen, setLoginOpen, loginUser, logout, updateUser, addAd, removeAd }}>
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
