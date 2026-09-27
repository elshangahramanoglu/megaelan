"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { User, LogOut, CheckCircle, Trash2, ExternalLink, Loader2, Edit3, CreditCard, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function KabinetPage() {
  const { user, updateUser, logout, removeAd } = useAppContext();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'elanlar' | 'balans'>('profil');
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [isProcessingBalance, setIsProcessingBalance] = useState(false);
  const [adStatusTab, setAdStatusTab] = useState<'active' | 'pending' | 'rejected' | 'expired'>('active');
  const [myAds, setMyAds] = useState<any[]>([]);
  const [isLoadingAds, setIsLoadingAds] = useState(false);

  const fetchMyAds = async () => {
    if (!user) return;
    setIsLoadingAds(true);
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setMyAds(data || []);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setIsLoadingAds(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'elanlar') {
      fetchMyAds();
    }
  }, [activeTab]);

  


  const handleDeleteAd = async (adId: string) => {
    const previousAds = [...myAds];
    // Optimistic UI update: instantly remove from screen
    setMyAds(prev => prev.filter(ad => ad.id !== adId));
    
    try {
      // Delete from database silently
      const { error } = await supabase.from('ads').delete().eq('id', adId);
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      // Also remove from global context so it instantly disappears from home page
      removeAd(adId);
      
    } catch (err) {
      console.error('Error deleting ad:', err);
      // Revert UI if RLS failed
      setMyAds(previousAds);
      alert("Xəta: Elanı silmək mümkün olmadı. (Böyük ehtimal Supabase icazəsi yoxdur)");
    }
  };

  React.useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const imageUrl = data.data.url;
        setAvatar(imageUrl);
        if (user) {
          const { error } = await supabase.from('users').update({ avatar: imageUrl }).eq('id', user.id);
          if (error) console.error("Avatar db error:", error);
          updateUser({ avatar: imageUrl });
        }
      } else {
        alert("Şəkil yüklənmədi. Yenidən cəhd edin.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Xəta baş verdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await supabase.from('users').update({ name }).eq('id', user.id);
        updateUser({ name });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Xəta baş verdi");
    }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) return alert('Düzgün məbləğ daxil edin');
    
    setIsProcessingBalance(true);
    setTimeout(async () => {
      try {
        if (!user) return;
        const newBalance = (user.balance || 0) + amount;
        
        // Try to update DB. If it fails (e.g. column missing), we just update context
        const { error } = await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
        if (error) {
          console.warn('DB update failed, using local context only.', error);
        }
        
        updateUser({ balance: newBalance });
        setBalanceAmount('');
        alert(`Balansınız uğurla ${amount.toFixed(2)} AZN artırıldı!`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessingBalance(false);
      }
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : <User className="w-8 h-8" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Şəxsi Kabinet</h1>
          <p className="text-gray-500">Məlumatlarınızı buradan idarə edə bilərsiniz.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar menu */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-gray-100 p-6">
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Qeydiyyat nömrəsi</p>
            <p className="font-bold text-gray-900">+994 {user.phone}</p>
          </div>
          
          <nav className="flex flex-row md:flex-col gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('profil')}
              className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profil' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Şəxsi məlumatlar
            </button>
            <button 
              onClick={() => setActiveTab('elanlar')}
              className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'elanlar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Mənim elanlarım
            </button>
            <button 
              onClick={() => setActiveTab('balans')}
              className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'balans' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Balansım ({(user?.balance || 0).toFixed(2)} AZN)
            </button>
            <div className="h-px bg-gray-200 my-2"></div>
            <button 
              onClick={handleLogout}
              className="text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Çıxış et
            </button>
          </nav>
        </div>

        {/* Form area */}
        <div className="w-full md:w-2/3 p-6 md:p-8">

          {activeTab === 'balans' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Balansım</h2>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-blue-100 font-medium mb-1">Cari balansınız</p>
                  <h3 className="text-4xl font-black">{(user?.balance || 0).toFixed(2)} <span className="text-2xl font-bold">AZN</span></h3>
                </div>
                <CreditCard className="w-16 h-16 opacity-80" />
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Balansı artır</h3>
                <form onSubmit={handleTopUp} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Məbləğ (AZN)</label>
                    <input 
                      type="number" 
                      step="0.10"
                      min="1"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      placeholder="Məsələn: 10.00"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none text-black font-black text-xl"
                      required
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                    * Ödəniş et düyməsinə basdıqdan sonra bank səhifəsinə yönləndiriləcəksiniz (Test rejimi).
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessingBalance || !balanceAmount}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessingBalance ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ödəniş et"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'profil' ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Şəxsi məlumatlar</h2>
              
              {isSaved && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Məlumatlarınız uğurla yadda saxlanıldı!
                </div>
              )}

              <form onSubmit={handleSave} className="flex flex-col gap-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-32 h-32 rounded-full border-4 border-gray-100 shadow-md bg-gray-50 flex items-center justify-center overflow-hidden mb-3">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    ) : avatar ? (
                      <img src={avatar} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-300" />
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploading} />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Profil şəklinizi dəyişin</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                    <input 
                      type="text" 
                      value={name.split(' ')[0] || ''}
                      onChange={(e) => {
                        const [, ...rest] = name.split(' ');
                        setName(`${e.target.value} ${rest.join(' ')}`.trim());
                      }}
                      placeholder="Adınızı daxil edin"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                    <input 
                      type="text" 
                      value={name.split(' ').slice(1).join(' ') || ''}
                      onChange={(e) => {
                        const [first] = name.split(' ');
                        setName(`${first || ''} ${e.target.value}`.trim());
                      }}
                      placeholder="Soyadınızı daxil edin"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobil nömrə (Dəyişdirilə bilməz)</label>
                  <input 
                    type="text" 
                    value={`+994 ${user.phone}`}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
                  >
                    Yadda saxla
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Mənim elanlarım</h2>
                <Link href="/yeni-elan" className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition-colors">
                  + Yeni
                </Link>
              </div>

              {/* Status Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
                <button onClick={() => setAdStatusTab('active')} className={`px-6 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-colors ${adStatusTab === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Qəbul edilən (Aktiv)</button>
                <button onClick={() => setAdStatusTab('pending')} className={`px-6 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-colors ${adStatusTab === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Gözləmədə</button>
                <button onClick={() => setAdStatusTab('rejected')} className={`px-6 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-colors ${adStatusTab === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Qəbul edilməyən</button>
                <button onClick={() => setAdStatusTab('expired')} className={`px-6 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-colors ${adStatusTab === 'expired' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Müddəti bitmiş</button>
              </div>
              
              {isLoadingAds ? (
                <div className="flex items-center justify-center py-20 text-blue-600">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
              ) : myAds.filter(ad => ad.status === adStatusTab).length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="font-medium text-lg mb-2">Bu bölmədə elanınız yoxdur.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {myAds.filter(ad => ad.status === adStatusTab).map(ad => (
                    <div key={ad.id} className="flex flex-col md:flex-row gap-6 p-6 border border-gray-200 rounded-3xl bg-white shadow-md items-center md:items-start transition-all hover:shadow-lg">
                      <div className="w-full md:w-48 h-48 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden relative">
                        {ad.images && ad.images.length > 0 ? (
                          <img src={ad.images[0]} className="w-full h-full object-cover" alt="Elan" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-bold">Şəkil yoxdur</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-2xl text-black line-clamp-2 mb-2">{ad.title}</h3>
                        <p className="text-blue-600 font-black text-xl mb-2">{ad.price} {ad.currency}</p>
                        <p className="text-sm text-gray-500">{new Date(ad.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={`/elan/${ad.id}`} className="flex-1 md:flex-none p-3 flex justify-center items-center bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors" title="Elana bax">
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link href={`/redakte/${ad.id}`} className="flex-1 md:flex-none p-3 flex justify-center items-center bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors" title="Redaktə et">
                          <Edit3 className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDeleteAd(ad.id)} className="flex-1 md:flex-none p-3 flex justify-center items-center bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors" title="Sil">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
