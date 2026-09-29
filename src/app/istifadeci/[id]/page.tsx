"use client";

import React, { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User as UserIcon, Calendar, Phone, PackageOpen, Loader2 } from "lucide-react";
import AdCard from "@/components/AdCard";
import { useAppContext } from "@/context/AppContext";

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const { ads: globalAds } = useAppContext();
  
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userAds, setUserAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, avatar, phone, created_at')
          .eq('id', userId)
          .single();
          
        if (userData) {
          setProfileUser(userData);
          // Get user ads
          const filteredAds = globalAds.filter(a => (a as any).user_id === userId);
          setUserAds(filteredAds);
        }
      } catch(e) {}
      finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId, globalAds]);

  if (isLoading) return <div className="py-32 flex justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
  if (!profileUser) return <div className="py-32 text-center text-xl font-bold text-gray-500">İstifadəçi tapılmadı!</div>;

  const joinDate = profileUser.created_at && !isNaN(new Date(profileUser.created_at).getTime()) 
    ? new Date(profileUser.created_at).toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
    : '29.09.2026';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-[24px] shadow-lg border border-gray-100 p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-gray-50 flex-shrink-0 shadow-md">
          {profileUser.avatar ? (
            <img src={profileUser.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-black text-gray-900">{profileUser.name || 'İstifadəçi'}</h1>
            <svg className="w-6 h-6 text-blue-500 mt-1" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-4 text-gray-600 font-medium">
            <div className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 px-4 py-2 rounded-xl">
              <Phone className="w-5 h-5 text-blue-500" />
              <span>{profileUser.phone}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 px-4 py-2 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Qeydiyyat: {joinDate}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 bg-gray-50 px-4 py-2 rounded-xl">
              <PackageOpen className="w-5 h-5 text-blue-500" />
              <span>{userAds.length} aktiv elan</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-black mb-6">İstifadəçinin elanları</h2>
      
      {userAds.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {userAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
          <PackageOpen className="w-16 h-16 mx-auto mb-3 opacity-20" />
          <p className="font-bold text-lg">Bu istifadəçinin aktiv elanı yoxdur</p>
        </div>
      )}
    </div>
  );
}
