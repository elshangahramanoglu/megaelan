"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { User, LogOut, CheckCircle, Trash2, ExternalLink, Loader2, Edit3, CreditCard, Camera, Bell, Shield, ChevronRight, Eye, MessageCircle, Clock, Check, Crown, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function KabinetPage() {
  const { user, isUserLoaded, updateUser, logout, removeAd } = useAppContext();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState((user?.name || "").split(' ')[0] || "");
  const [lastName, setLastName] = useState((user?.name || "").split(' ').slice(1).join(' ') || "");
  
    useEffect(() => {
    if (user?.name) {
      setFirstName(user.name.split(' ')[0] || "");
      setLastName(user.name.split(' ').slice(1).join(' ') || "");
    }
    if (user?.avatar !== undefined) {
      setAvatar(user.avatar || "");
    }
  }, [user?.name, user?.avatar]);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'elanlar' | 'balans'>('profil');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'elanlar' || tab === 'balans') setActiveTab(tab);
    }
  }, []);
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [isProcessingBalance, setIsProcessingBalance] = useState(false);
  const [adStatusTab, setAdStatusTab] = useState<'active' | 'pending' | 'rejected' | 'expired' | 'deleted'>('active');
  const [myAds, setMyAds] = useState<any[]>([]);
  const [isLoadingAds, setIsLoadingAds] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
      
      let adsData = data || [];
      
      // Auto-approve pending ads older than 1 minute
      const now = new Date().getTime();
      let hasUpdates = false;
      
      for (const ad of adsData) {
        if (ad.status === 'pending') {
          const adTime = new Date(ad.created_at).getTime();
          const diffMinutes = (now - adTime) / (1000 * 60);
          
          if (diffMinutes >= 1) {
            // Auto approve
            const { error: updateError } = await supabase
              .from('ads')
              .update({ status: 'active' })
              .eq('id', ad.id);
              
            if (!updateError) {
              ad.status = 'active';
              hasUpdates = true;
            }
          }
        }
      }
      
      setMyAds([...adsData]);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setIsLoadingAds(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'elanlar') fetchMyAds();
  }, [activeTab]);

  const handleDeleteAd = async (adId: string) => {
    try {
      const { error } = await supabase.from('ads').update({ status: 'deleted' }).eq('id', adId);
      if (error) throw error;
      setMyAds(prev => prev.map(ad => ad.id === adId ? { ...ad, status: 'deleted' } : ad));
      removeAd(adId); // Remove from global context so it doesn't show in home
      toast.success('Elan silindi.');
    } catch (err) {
      console.error('Error deleting ad:', err);
      toast.error("Xəta: Elanı silmək mümkün olmadı.");
    }
  };
  
  const handleRestoreAd = async (adId: string) => {
    try {
      const { error } = await supabase.from('ads').update({ status: 'pending' }).eq('id', adId);
      if (error) throw error;
      setMyAds(prev => prev.map(ad => ad.id === adId ? { ...ad, status: 'pending' } : ad));
      toast.success('Elan bərpa edildi və yoxlanışa göndərildi.');
    } catch (err) {
      console.error('Error restoring ad:', err);
      toast.error("Xəta: Elanı bərpa etmək mümkün olmadı.");
    }
  };

  const handlePermanentDeleteAd = async (adId: string) => {
    try {
      const { error } = await supabase.from('ads').delete().eq('id', adId);
      if (error) throw error;
      setMyAds(prev => prev.filter(ad => ad.id !== adId));
      removeAd(adId);
      toast.success('Elan kökündən silindi.');
    } catch (err) {
      console.error('Error permanently deleting ad:', err);
      toast.error("Xəta: Elanı silmək mümkün olmadı.");
    }
  };

  React.useEffect(() => {
    if (isUserLoaded && !user) router.push("/");
  }, [user, isUserLoaded, router]);

  if (!isUserLoaded) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  if (!user) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { toast.error("Şəkilin həcmi 15 MB-dan böyük ola bilməz!"); return; }
    
    // INSTANT UI UPDATE using local blob URL
    const localUrl = URL.createObjectURL(file);
    setAvatar(localUrl);
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        const imageUrl = data.data.url;
        setAvatar(imageUrl); // switch to permanent URL
        if (user) {
          const { error } = await supabase.from('users').update({ avatar: imageUrl }).eq('id', user.id);
          if (error) console.error("Avatar db error:", error);
          updateUser({ avatar: imageUrl });
        }
      } else { 
        toast.error("Şəkil yüklənmədi. Yenidən cəhd edin."); 
        setAvatar(user?.avatar || ""); // revert on fail
      }
    } catch (err) { 
      console.error("Upload error:", err); 
      toast.error("Xəta baş verdi");
      setAvatar(user?.avatar || ""); // revert on fail
    }
    finally { setIsUploading(false); }
  };

  const handleDeleteAvatar = async () => {
    if (!user || !avatar) return;
    setAvatar("");
    try {
      const { error } = await supabase.from('users').update({ avatar: null }).eq('id', user.id);
      if (error) console.error("Avatar delete db error:", error);
      updateUser({ avatar: undefined });
    } catch (err) { console.error(err); }
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        const fullName = `${firstName} ${lastName}`.trim();
        await supabase.from('users').update({ name: fullName }).eq('id', user.id);
        await supabase.from('ads').update({ contactName: fullName }).eq('user_id', user.id);
        updateUser({ name: fullName });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) { console.error(err); toast.error("Xəta baş verdi"); }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) return toast.error('Düzgün məbləğ daxil edin');
    setIsProcessingBalance(true);
    setTimeout(async () => {
      try {
        if (!user) return;
        const newBalance = (user.balance || 0) + amount;
        const { error } = await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
        if (error) console.warn('DB update failed, using local context only.', error);
        updateUser({ balance: newBalance });
        setBalanceAmount('');
        toast.success(`Balansınız uğurla ${amount.toFixed(2)} AZN artırıldı!`);
      } catch (err) { console.error(err); }
      finally { setIsProcessingBalance(false); }
    }, 2000);
  };

  const handleLogout = () => { logout(); router.push("/"); };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeletingAccount(true);
    try {
      const { error } = await supabase.from('users').delete().eq('id', user.id);
      if (error) throw error;
      
      // Clear local storage and logout
      logout();
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error('Hesabı silərkən xəta baş verdi.');
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteAccountModal(false);
    }
  };

  
  const formattedPhone = user.phone.startsWith("+994") ? user.phone : user.phone.startsWith("994") ? "+" + user.phone : "+994 " + user.phone;

  const sidebarItems = [
    { key: 'profil', label: 'Şəxsi məlumatlar', icon: User },
    { key: 'elanlar', label: 'Mənim elanlarım', icon: Bell },
    { key: 'balans', label: 'Balansım', icon: CreditCard },
  ] as const;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-14">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-[280px] bg-gradient-to-b from-slate-50 to-gray-50 border-r border-gray-100 p-6 flex flex-col gap-2 flex-shrink-0">


          {sidebarItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); router.push(`/kabinet?tab=${key}`, { scroll: false }); }}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-base transition-all ${
                activeTab === key 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {activeTab === key && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
          
          <div className="h-px bg-gray-200 my-3" />
          
          <button 
            onClick={handleLogout}
            className="w-full hidden md:flex items-center gap-3 px-5 py-4 text-orange-500 hover:bg-orange-50 rounded-2xl font-bold transition-all mb-2"
          >
            <LogOut className="w-5 h-5" /> Çıxış et
          </button>
          
          <button 
            onClick={() => setShowDeleteAccountModal(true)}
            className="w-full hidden md:flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all"
          >
            <Trash2 className="w-5 h-5" /> Hesabı sil
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
            {activeTab === 'profil' && (
              <motion.div
                key="profil"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" /> Şəxsi məlumatlar
                </h2>
                
                {isSaved && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-2 font-medium">
                    <CheckCircle className="w-5 h-5" /> Məlumatlarınız uğurla yadda saxlanıldı!
                  </div>
                )}

                <form onSubmit={handleSave} className="flex flex-col gap-7">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                      {isUploading 
                        ? <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        : avatar 
                          ? <Image unoptimized src={avatar} priority fill sizes="128px" className="object-cover" alt="Profil" />
                          : <User className="w-16 h-16 text-gray-300" />}
                      <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity gap-1">
                        <Camera className="w-8 h-8 text-white" />
                        <span className="text-white text-xs font-bold">Dəyiş</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploading} />
                      </label>
                    </div>
                    <div className="text-center">
                      <div className="inline-block bg-blue-100 text-blue-700 font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-blue-200">
                        Fərdi Hesab
                      </div>
                      {avatar && (
                        <button type="button" onClick={handleDeleteAvatar} className="text-xs text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-all mt-2 inline-block">
                          Şəkli sil
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Name fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Ad</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Adınızı daxil edin"
                        className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-black font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Soyad</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Soyadınızı daxil edin"
                        className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-black font-medium transition-all"
                      />
                    </div>
                  </div>
                  
                  {/* Phone (readonly) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobil nömrə (Dəyişdirilə bilməz)</label>
                    <input 
                      type="text" 
                      value={formattedPhone}
                      disabled
                      className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-400 outline-none font-medium"
                    />
                  </div>

                  <div className="pt-2 flex flex-col md:flex-row justify-between items-center gap-4">
                    <button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-lg py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-600/25"
                    >
                      Yadda saxla
                    </button>
                    <div className="flex items-center gap-1.5 text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      Qeydiyyat: {user.created_at ? new Date(user.created_at).toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' }) : '29 sentyabr 2026'}
                      <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center ml-1">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'elanlar' && (
              <motion.div
                key="elanlar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-black text-black">Mənim elanlarım</h2>
                  <Link href="/yeni-elan" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md w-full md:w-auto">
                    <span className="text-xl leading-none">+</span> Yeni elan
                  </Link>
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 w-full">
                  {([
                    { key: 'active', label: 'Aktiv', color: 'green' },
                    { key: 'pending', label: 'Gözləmədə', color: 'orange' },
                    { key: 'rejected', label: 'Rədd edilən', color: 'red' },
                    { key: 'expired', label: 'Müddəti bitmiş', color: 'gray' },
                    { key: 'deleted', label: 'Silinmiş', color: 'gray' },
                  ] as const).map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() => setAdStatusTab(key)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all flex-grow md:flex-grow-0 text-center ${
                        adStatusTab === key 
                          ? color === 'green' ? 'bg-green-500 text-white shadow-md' 
                          : color === 'orange' ? 'bg-orange-500 text-white shadow-md'
                          : color === 'red' ? 'bg-red-500 text-white shadow-md'
                          : 'bg-gray-800 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label} ({myAds.filter(a => key === 'rejected' ? (a.status === 'rejected' || a.status === 'blocked') : a.status === key).length})
                    </button>
                  ))}
                </div>

                {isLoadingAds ? (
                  <div className="flex items-center justify-center py-24 text-blue-600">
                    <Loader2 className="w-12 h-12 animate-spin" />
                  </div>
                ) : myAds.filter(ad => adStatusTab === 'rejected' ? (ad.status === 'rejected' || ad.status === 'blocked') : ad.status === adStatusTab).length === 0 ? (
                  <div className="text-center py-24 text-gray-400">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="font-bold text-lg text-gray-500">Bu bölmədə elanınız yoxdur.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {myAds.filter(ad => adStatusTab === 'rejected' ? (ad.status === 'rejected' || ad.status === 'blocked') : ad.status === adStatusTab).map((ad, i) => (
                      <motion.div
                        key={ad.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex flex-col md:flex-row gap-4 p-4 border-2 border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-lg hover:border-blue-100 transition-all"
                      >
                        <div className="w-full md:w-40 h-48 md:h-32 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden relative">
                          {ad.images && ad.images.length > 0 
                            ? <Image unoptimized src={ad.images[0]} fill sizes="(max-width: 768px) 100vw, 160px" className="object-cover" alt={ad.title} />
                            : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">Şəkil yoxdur</div>}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="font-black text-lg md:text-xl text-black line-clamp-2 mb-1 md:mb-2">{ad.title}</h3>
                            <p className="text-blue-600 font-black text-base md:text-lg mb-2">{ad.price} {ad.currency}</p>
                            <p className="text-xs md:text-sm text-gray-400 font-medium">{new Date(ad.created_at).toLocaleString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '')}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <span className="flex items-center gap-1 text-[11px] bg-gray-100 px-2 py-1 rounded-md text-gray-600 font-bold"><Eye className="w-3 h-3" /> {ad.views || 0}</span>
                              <span className="flex items-center gap-1 text-[11px] bg-blue-50 px-2 py-1 rounded-md text-blue-600 font-bold"><MessageCircle className="w-3 h-3" /> {ad.contacts_count || 0}</span>
                              <span className="flex items-center gap-1 text-[11px] bg-orange-50 px-2 py-1 rounded-md text-orange-600 font-bold"><Clock className="w-3 h-3" /> {Math.max(0, 30 - Math.floor((Date.now() - new Date(ad.created_at).getTime()) / (1000 * 60 * 60 * 24)))} gün qaldı</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap md:flex-col gap-2 flex-shrink-0 mt-3 md:mt-0">
                          <Link href={`/elan/${ad.id}`} className="p-2.5 flex-1 md:flex-none flex justify-center items-center bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-all" title="Elana bax">
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          {ad.status === 'blocked' ? (
                            <div className="p-2.5 flex justify-center items-center bg-red-100 text-red-600 rounded-xl font-bold text-sm" title="Qadağan olunub">
                              <Lock className="w-5 h-5 mr-1" /> Bloklanıb
                            </div>
                          ) : (
                            <>
                              <div className="p-2.5 flex-1 md:flex-none flex justify-center items-center gap-2 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed" title="Ödəniş sistemi tezliklə aktiv olacaq">
                                <Crown className="w-5 h-5" />
                              </div>
                              <Link href={`/redakte/${ad.id}`} className="p-2.5 flex-1 md:flex-none flex justify-center items-center bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all" title="Redaktə et">
                                <Edit3 className="w-5 h-5" />
                              </Link>
                              {ad.status === 'deleted' ? (
                                <>
                                  <button onClick={() => handleRestoreAd(ad.id)} className="p-2.5 flex-1 md:flex-none flex justify-center items-center bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all font-bold text-sm">
                                    Bərpa et
                                  </button>
                                  <button onClick={() => handlePermanentDeleteAd(ad.id)} className="p-2.5 flex-1 md:flex-none flex justify-center items-center bg-red-600 text-white hover:bg-red-700 rounded-xl transition-all font-bold text-xs" title="Kökündən sil">
                                    <Trash2 className="w-4 h-4 mr-1" /> Kökündən sil
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => setAdToDelete(ad.id)} className="p-2.5 flex-1 md:flex-none flex justify-center items-center bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all" title="Sil">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'balans' && (
              <motion.div
                key="balans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" /> Balansım
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  {/* Smaller Balance Card */}
                  <div className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                      <CreditCard className="w-32 h-32" />
                    </div>
                    <p className="text-blue-100 font-medium mb-1 text-sm relative z-10">Cari balansınız</p>
                    <h3 className="text-3xl font-black relative z-10">{(user?.balance || 0).toFixed(2)} <span className="text-lg font-bold text-blue-200">AZN</span></h3>
                  </div>

                  {/* Top Up Form - Disabled (payment not yet connected) */}
                  <div className="flex-[2] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-base font-bold text-gray-700">Ödəniş sistemi tezliklə aktiv olacaq</h3>
                    <p className="text-sm text-gray-500 font-medium">Hal-hazırda ödəniş sistemi qoşulmayıb. Tezliklə aktivləşdiriləcək.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
          
          {/* Mobile Logout Buttons */}
          <div className="md:hidden mt-8 pt-8 border-t border-gray-100 flex flex-col gap-3">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-orange-50 text-orange-600 rounded-2xl font-bold transition-all"><LogOut className="w-5 h-5" /> Çıxış et</button>
            <button onClick={() => setShowDeleteAccountModal(true)} className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-red-50 text-red-600 rounded-2xl font-bold transition-all"><Trash2 className="w-5 h-5" /> Hesabı sil</button>
          </div>
        </div>
      </div>

      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-black mb-2">Hesabınızı silmək istəyirsiniz?</h3>
            <p className="text-gray-500 font-medium mb-6">Diqqət! Bu əməliyyat geri qaytarıla bilməz. Bütün elanlarınız və mesajlarınız həmişəlik silinəcək.</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowDeleteAccountModal(false)}
                disabled={isDeletingAccount}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Xeyr, qal
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeletingAccount ? <Loader2 className="w-5 h-5 animate-spin" /> : "Bəli, sil"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {adToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-black mb-2">Elanı silmək istəyirsiniz?</h3>
            <p className="text-gray-500 font-medium mb-6">Bu elan "Silinmiş" bölməsinə köçürüləcək. İstədiyiniz vaxt bərpa edə bilərsiniz.</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setAdToDelete(null)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Ləğv et
              </button>
              <button 
                onClick={() => {
                  if (adToDelete) {
                    handleDeleteAd(adToDelete);
                    setAdToDelete(null);
                  }
                }}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/30"
              >
                Bəli, sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
