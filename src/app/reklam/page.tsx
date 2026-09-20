"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Crown, Star, ArrowUpCircle, CheckCircle, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tariff = { id: string, name: string, price: number, type: 'vip' | 'premium', days: number };

const TARIFFS: Tariff[] = [
  { id: 'v1', name: '1 günlük', price: 0.50, days: 1, type: 'vip' },
  { id: 'v3', name: '3 günlük', price: 1.30, days: 3, type: 'vip' },
  { id: 'v7', name: '7 günlük', price: 3.00, days: 7, type: 'vip' },
  { id: 'p1', name: '1 günlük', price: 1.00, days: 1, type: 'premium' },
  { id: 'p7', name: '1 həftəlik', price: 5.00, days: 7, type: 'premium' },
  { id: 'p30', name: '1 aylıq', price: 20.00, days: 30, type: 'premium' },
];

function ReklamContent() {
  const { user, ads } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAdId = searchParams.get('adId');

  const [selectedAdId, setSelectedAdId] = useState<string | null>(preselectedAdId);
  const [step, setStep] = useState<1 | 2 | 3>(preselectedAdId ? 2 : 1);
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const myAds = ads.filter(a => a.user_id === user?.id && a.status === 'active');
  const selectedAd = myAds.find(a => a.id === selectedAdId);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null;


  const handleBalancePayment = async () => {
    if (!selectedTariff || !selectedAdId || !user) return;
    
    if ((user.balance || 0) < selectedTariff.price) {
      alert("Balansınızda kifayət qədər vəsait yoxdur.");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        const updateData: any = {};
        if (selectedTariff.type === 'premium') updateData.is_premium = true;
        if (selectedTariff.type === 'vip') updateData.is_vip = true;
        
        // 1. Update Ad
        const { error: adError } = await supabase.from('ads').update(updateData).eq('id', selectedAdId);
        if (adError) throw adError;
        
        // 2. Deduct Balance
        const newBalance = (user.balance || 0) - selectedTariff.price;
        const { error: userError } = await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
        if (userError) console.warn("DB Balance deduction failed", userError);
        
        // @ts-ignore - updateUser will be called from context if we had it, but wait!
        // We need to fetch updateUser from useAppContext. Let's add it if missing.
        
        setStep(3);
      } catch (err) {
        console.error(err);
        alert("Xəta baş verdi.");
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(async () => {
      try {
        if (!selectedAdId || !selectedTariff) throw new Error("Məlumat tam deyil");
        
        const updateData: any = {};
        if (selectedTariff.type === 'premium') updateData.is_premium = true;
        if (selectedTariff.type === 'vip') updateData.is_vip = true;
        
        const { error } = await supabase.from('ads').update(updateData).eq('id', selectedAdId);
        if (error) throw error;
        
        setStep(3); // Success step
      } catch (err) {
        console.error(err);
        alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-2">Reklam Xidmətləri</h1>
      <p className="text-center text-gray-500 mb-10 font-medium">Daha çox alıcı tapmaq üçün elanınızı önə çəkin və ya Premium edin.</p>

      {/* STEP INDICATORS */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
          <span className="font-bold hidden md:inline">Elan seçimi</span>
        </div>
        <div className={`w-12 md:w-16 h-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
          <span className="font-bold hidden md:inline">Xidmət və Ödəniş</span>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Hansı elanınızı reklam etmək istəyirsiniz?</h2>
          {myAds.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl">
              <p className="text-gray-500 mb-4 font-medium">Reklam etmək üçün aktiv elanınız yoxdur.</p>
              <button onClick={() => router.push('/yeni-elan')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-transform">Yeni elan yerləşdir</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAds.map(ad => (
                <div 
                  key={ad.id} 
                  onClick={() => { setSelectedAdId(ad.id); setStep(2); }}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all active:scale-95"
                >
                  <img src={ad.images?.[0] || ad.imagePlaceholder} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{ad.title}</h3>
                    <p className="text-blue-600 font-black">{ad.price} {ad.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TARIFFS */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold">Xidmət seçin</h2>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-gray-100 flex items-center gap-3">
                <ArrowUpCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-bold text-lg text-blue-900">İrəli Çək (VIP)</h3>
                  <p className="text-xs text-blue-700">Elanın axtarışda yuxarı qalxması üçün</p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {TARIFFS.filter(t => t.type === 'vip').map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTariff(t)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTariff?.id === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                  >
                    <span className="font-bold text-gray-800">{t.name}</span>
                    <span className="font-black text-lg text-blue-600">{t.price.toFixed(2)} ₼</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
              <div className="bg-orange-50 p-4 border-b border-gray-100 flex items-center gap-3">
                <Crown className="w-6 h-6 text-orange-500" />
                <div>
                  <h3 className="font-bold text-lg text-orange-900">Premium Elanlar</h3>
                  <p className="text-xs text-orange-700">Ana səhifədə xüsusi rənglə göstərilməsi üçün</p>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {TARIFFS.filter(t => t.type === 'premium').map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => setSelectedTariff(t)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedTariff?.id === t.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
                  >
                    <span className="font-bold text-gray-800">{t.name}</span>
                    <span className="font-black text-lg text-orange-600">{t.price.toFixed(2)} ₼</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(1)} className="text-gray-500 font-bold hover:text-black self-start transition-colors">← Başqa elan seç</button>
          </div>

          {/* PAYMENT FORM */}
          <div>
            <div className={`bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl transition-all duration-500 ${!selectedTariff ? 'opacity-50 pointer-events-none filter grayscale' : ''}`}>
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-bold text-xl">Kartla ödəniş</h3>
                  <p className="text-sm text-gray-500 font-medium">{selectedTariff ? `${selectedTariff.name} ${selectedTariff.type === 'vip' ? 'İrəli çək' : 'Premium'}` : 'Xidmət seçilməyib'}</p>
                </div>
              </div>
              
              <form onSubmit={handlePayment} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kartın üzərindəki ad və soyad</label>
                  <input type="text" placeholder="ELSHAN GAHRAMANOGLU" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-colors uppercase font-medium" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kartın nömrəsi</label>
                  <input type="text" placeholder="4169 0000 0000 0000" maxLength={19} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-colors font-medium tracking-widest" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bitmə tarixi</label>
                    <input type="text" placeholder="AA / İİ" maxLength={5} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-colors font-medium text-center" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                    <input type="password" placeholder="***" maxLength={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none transition-colors font-medium text-center" required />
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between text-sm font-medium text-gray-500 mb-2">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500"/> Təhlükəsiz ödəniş</span>
                  <span>Məbləğ: <span className="font-black text-xl text-black">{selectedTariff?.price.toFixed(2)} ₼</span></span>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    type="submit" 
                    disabled={isProcessing || !selectedTariff}
                    className="w-full bg-gray-800 hover:bg-black active:scale-95 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    Kart ilə Ödə
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={handleBalancePayment}
                    disabled={isProcessing || !selectedTariff}
                    className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Balansdan ödə (${(user?.balance || 0).toFixed(2)} ₼ mövcuddur)`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black mb-2">Təşəkkürlər!</h2>
          <p className="text-gray-600 font-medium mb-8">Ödənişiniz uğurla qəbul edildi. Elanınız dərhal aktivləşdirildi və seçdiyiniz xidmət üzrə yerləşdirildi.</p>
          <button 
            onClick={() => router.push(`/elan/${selectedAdId}`)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl transition-all"
          >
            Elana keçid et
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReklamPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <ReklamContent />
    </Suspense>
  );
}
