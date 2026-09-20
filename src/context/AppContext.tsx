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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate 100 mock ads
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fetch real data from Supabase (No more mock ads)
    const fetchAds = async () => {
      try {
        const { data: realAds, error } = await supabase
          .from('ads')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && realAds) {
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
          setAds(formattedRealAds);
        } else {
          setAds([]);
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
        setAds([]);
      }
    };
    
    fetchAds();
    
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

  return (
    <AppContext.Provider value={{ ads, favorites, toggleFavorite, user, isLoginOpen, setLoginOpen, loginUser, logout, updateUser, addAd }}>
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
