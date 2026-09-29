"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { User, LogOut, CheckCircle, Trash2, ExternalLink, Loader2, Edit3, CreditCard, Camera, Bell, Shield, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    if (activeTab === 'elanlar') fetchMyAds();
  }, [activeTab]);

  const handleDeleteAd = async (adId: string) => {
    const previousAds = [...myAds];
    setMyAds(prev => prev.filter(ad => ad.id !== adId));
    try {
      const { error } = await supabase.from('ads').delete().eq('id', adId);
      if (error) throw error;
      removeAd(adId);
    } catch (err) {
      console.error('Error deleting ad:', err);
      setMyAds(previousAds);
      alert("Xəta: Elanı silmək mümkün olmadı.");
    }
  };

  React.useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { alert("Şəkilin həcmi 15 MB-dan böyük ola bilməz!"); return; }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        const imageUrl = data.data.url;
        setAvatar(imageUrl);
        if (user) {
          const { error } = await supabase.from('users').update({ avatar: imageUrl }).eq('id', user.id);
          if (error) console.error("Avatar db error:", error);
          updateUser({ avatar: imageUrl });
        }
      } else { alert("Şəkil yüklənmədi. Yenidən cəhd edin."); }
    } catch (err) { console.error("Upload error:", err); alert("Xəta baş verdi"); }
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
        await supabase.from('users').update({ name }).eq('id', user.id);
        updateUser({ name });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) { console.error(err); alert("Xəta baş verdi"); }
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
        const { error } = await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
        if (error) console.warn('DB update failed, using local context only.', error);
        updateUser({ balance: newBalance });
        setBalanceAmount('');
        alert(`Balansınız uğurla ${amount.toFixed(2)} AZN artırıldı!`);
      } catch (err) { console.error(err); }
      finally { setIsProcessingBalance(false); }
    }, 2000);
  };

  const handleLogout = () => { logout(); router.push("/"); };
  
  const formattedPhone = user.phone.startsWith("+994") ? user.phone : user.phone.startsWith("994") ? "+" + user.phone : "+994 " + user.phone;

  const sidebarItems = [
    { key: 'profil', label: 'Şəxsi məlumatlar', icon: User },
    { key: 'elanlar', label: 'Mənim elanlarım', icon: Bell },
    { key: 'balans', label: 'Balansım', icon: CreditCard },
  ] as const;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-14">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="flex items-center gap-5 mb-10"
      >
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-blue-50 border-4 border-white shadow-lg flex-shrink-0">
          {avatar 
            ? <img src={avatar} className="w-full h-full object-cover" alt="Profil" />
            : <User className="w-9 h-9 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-black">
            {user.name ? user.name : 'Şəxsi Kabinet'}
          </h1>
          <p className="text-gray-500 font-medium mt-1">{formattedPhone}</p>
        </div>
      </motion.div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-[280px] bg-gradient-to-b from-slate-50 to-gray-50 border-r border-gray-100 p-6 flex flex-col gap-2 flex-shrink-0">
          {/* User info in sidebar */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-50 border-2 border-blue-100 flex-shrink-0">
              {avatar 
                ? <img src={avatar} className="w-full h-full object-cover" alt="" />
                : <User className="w-6 h-6 text-blue-400 m-3" />}
            </div>
            <div className="min-w-0">
              <p className="font-black text-black text-sm truncate">{user.name || 'İstifadəçi'}</p>
              <p className="text-gray-400 text-xs font-medium">{formattedPhone}</p>
            </div>
          </div>

          {sidebarItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
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
            className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-all"
          >
            <LogOut className="w-5 h-5" /> Çıxış et
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10">
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
                          ? <img src={avatar} alt="Profil" className="w-full h-full object-cover" />
                          : <User className="w-16 h-16 text-gray-300" />}
                      <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity gap-1">
                        <Camera className="w-8 h-8 text-white" />
                        <span className="text-white text-xs font-bold">Dəyiş</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploading} />
                      </label>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-medium">Profil şəklinizi yeniləyin (maks. 15 MB)</p>
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
                        value={name.split(' ')[0] || ''}
                        onChange={(e) => {
                          const [, ...rest] = name.split(' ');
                          setName(`${e.target.value} ${rest.join(' ')}`.trim());
                        }}
                        placeholder="Adınızı daxil edin"
                        className="w-full px-5 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-black font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Soyad</label>
                      <input 
                        type="text" 
                        value={name.split(' ').slice(1).join(' ') || ''}
                        onChange={(e) => {
                          const [first] = name.split(' ');
                          setName(`${first || ''} ${e.target.value}`.trim());
                        }}
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

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-lg py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-600/25"
                    >
                      Yadda saxla
                    </button>
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
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-black">Mənim elanlarım</h2>
                  <Link href="/yeni-elan" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md">
                    <span className="text-xl leading-none">+</span> Yeni elan
                  </Link>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
                  {([
                    { key: 'active', label: 'Aktiv', color: 'green' },
                    { key: 'pending', label: 'Gözləmədə', color: 'orange' },
                    { key: 'rejected', label: 'Rədd edilən', color: 'red' },
                    { key: 'expired', label: 'Müddəti bitmiş', color: 'gray' },
                  ] as const).map(({ key, label, color }) => (
                    <button
                      key={key}
                      onClick={() => setAdStatusTab(key)}
                      className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                        adStatusTab === key 
                          ? color === 'green' ? 'bg-green-500 text-white shadow-md' 
                          : color === 'orange' ? 'bg-orange-500 text-white shadow-md'
                          : color === 'red' ? 'bg-red-500 text-white shadow-md'
                          : 'bg-gray-800 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label} ({myAds.filter(a => a.status === key).length})
                    </button>
                  ))}
                </div>

                {isLoadingAds ? (
                  <div className="flex items-center justify-center py-24 text-blue-600">
                    <Loader2 className="w-12 h-12 animate-spin" />
                  </div>
                ) : myAds.filter(ad => ad.status === adStatusTab).length === 0 ? (
                  <div className="text-center py-24 text-gray-400">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="font-bold text-lg text-gray-500">Bu bölmədə elanınız yoxdur.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {myAds.filter(ad => ad.status === adStatusTab).map((ad, i) => (
                      <motion.div
                        key={ad.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex flex-col md:flex-row gap-5 p-5 border-2 border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-lg hover:border-blue-100 transition-all"
                      >
                        <div className="w-full md:w-52 h-44 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden">
                          {ad.images && ad.images.length > 0 
                            ? <img src={ad.images[0]} className="w-full h-full object-cover" alt={ad.title} />
                            : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">Şəkil yoxdur</div>}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="font-black text-2xl text-black line-clamp-2 mb-2">{ad.title}</h3>
                            <p className="text-blue-600 font-black text-xl mb-2">{ad.price} {ad.currency}</p>
                            <p className="text-sm text-gray-400 font-medium">{new Date(ad.created_at).toLocaleDateString('az-AZ')}</p>
                          </div>
                        </div>
                        <div className="flex md:flex-col gap-2 flex-shrink-0">
                          <Link href={`/elan/${ad.id}`} className="p-3.5 flex justify-center items-center bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-all" title="Elana bax">
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                          <Link href={`/redakte/${ad.id}`} className="p-3.5 flex justify-center items-center bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all" title="Redaktə et">
                            <Edit3 className="w-5 h-5" />
                          </Link>
                          <button onClick={() => handleDeleteAd(ad.id)} className="p-3.5 flex justify-center items-center bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all" title="Sil">
                            <Trash2 className="w-5 h-5" />
                          </button>
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
                
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8">
                  <p className="text-blue-200 font-medium mb-2 text-sm">Cari balansınız</p>
                  <h3 className="text-5xl font-black">{(user?.balance || 0).toFixed(2)} <span className="text-2xl font-bold text-blue-200">AZN</span></h3>
                  <p className="text-blue-300 text-sm mt-4 font-medium">Son yenilənmə: Bu gün</p>
                </div>

                <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-black text-black mb-6">Balansı artır</h3>
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
                        className="w-full px-5 py-4 text-xl rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-black font-black transition-all"
                        required
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl text-sm text-blue-700 font-medium border border-blue-100">
                      Ödəniş et düyməsinə basdıqdan sonra bank səhifəsinə yönləndiriləcəksiniz.
                    </div>
                    <button 
                      type="submit" 
                      disabled={isProcessingBalance || !balanceAmount}
                      className="w-full py-5 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-black text-xl rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {isProcessingBalance ? <Loader2 className="w-7 h-7 animate-spin" /> : "Ödəniş et"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
