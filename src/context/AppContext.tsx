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
  views?: number;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  balance?: number;
  avatar?: string;
}

interface AppContextType {
  ads: Ad[];
  favorites: string[];
  toggleFavorite: (adId: string) => void;
  user: User | null;
  isUserLoaded: boolean;
  isLoginOpen: boolean;
  setLoginOpen: (val: boolean) => void;
  loginUser: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addAd: (ad: Ad) => void;
  removeAd: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initialize mock data and fetch real data from Supabase
    const timer = setTimeout(async () => {
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
          setAds(formattedRealAds);
        } else {
          setAds([]);
        }
      } catch (err) {
        setAds([]);
      }
    }, 0);
    
    // Check local storage for user and favorites
    const savedUser = localStorage.getItem("megaelan_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Fetch latest data from Supabase to sync across devices
        if (parsedUser && parsedUser.phone) {
          supabase.from('users').select('*').eq('phone', parsedUser.phone).single()
            .then(({ data, error }) => {
              if (data && !error) {
                const updatedUser = {
                  id: data.id,
                  phone: data.phone,
                  name: data.name || parsedUser.name,
                  balance: data.balance || 0,
                  avatar: data.avatar || ""
                };
                setUser(updatedUser);
                localStorage.setItem("megaelan_user", JSON.stringify(updatedUser));
              }
            });
        }
      } catch (e) {}
    }
    setIsUserLoaded(true);
    
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
    <AppContext.Provider value={{ ads, favorites, toggleFavorite, user, isUserLoaded, isLoginOpen, setLoginOpen, loginUser, logout, updateUser, addAd, removeAd }}>
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
