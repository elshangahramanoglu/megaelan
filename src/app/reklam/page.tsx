"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Crown, Star, ArrowUpCircle, CheckCircle, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

function ReklamContent() {
  const { user, ads } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAdId = searchParams.get('adId');

  const [selectedAdId, setSelectedAdId] = useState<string | null>(preselectedAdId);
  const [step, setStep] = useState<1 | 2 | 3>(preselectedAdId ? 2 : 1);
  const [paymentPlan, setPaymentPlan] = useState<'vip' | 'premium' | 'bump' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const myAds = ads.filter(a => a.user_id === user?.id && a.status === 'active');
  const selectedAd = myAds.find(a => a.id === selectedAdId);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(async () => {
      try {
        if (!selectedAdId) throw new Error("No ad selected");
        
        const updateData: any = {};
        if (paymentPlan === 'premium') updateData.is_premium = true;
        if (paymentPlan === 'vip') updateData.is_vip = true;
        
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
    <div className="w-full max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-2">Reklam Xidmətləri</h1>
      <p className="text-center text-gray-500 mb-10 font-medium">Daha çox alıcı tapmaq üçün elanınızı önə çəkin və ya VIP edin.</p>

      {/* STEP INDICATORS */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
          <span className="font-bold hidden md:inline">Elan seçimi</span>
        </div>
        <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
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
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Xidmət seçin</h2>
            
            <div 
              onClick={() => setPaymentPlan('bump')} 
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all active:scale-95 ${paymentPlan === 'bump' ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' : 'border-gray-100 bg-white hover:border-blue-300'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xl"><ArrowUpCircle className="w-6 h-6" /> İrəli çək</div>
                <div className="text-2xl font-black">2.00 ₼</div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Elanınız axtarış nəticələrində ən yuxarı qalxaraq yenidən tarixini təzələyəcək.</p>
            </div>
            
            <div 
              onClick={() => setPaymentPlan('premium')} 
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all active:scale-95 ${paymentPlan === 'premium' ? 'border-orange-500 bg-orange-50 shadow-md transform scale-[1.02]' : 'border-gray-100 bg-white hover:border-orange-300'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-orange-500 font-bold text-xl"><Crown className="w-6 h-6" /> Premium</div>
                <div className="text-2xl font-black">5.00 ₼</div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Elanınız xüsusi rənglə vurğulanacaq və axtarışlarda premium blokunda görünəcək.</p>
            </div>

            <div 
              onClick={() => setPaymentPlan('vip')} 
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all active:scale-95 ${paymentPlan === 'vip' ? 'border-purple-500 bg-purple-50 shadow-md transform scale-[1.02]' : 'border-gray-100 bg-white hover:border-purple-300'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-purple-600 font-bold text-xl"><Star className="w-6 h-6" /> VIP Elan</div>
                <div className="text-2xl font-black">15.00 ₼</div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Sizin elanınız ana səhifədə günlərlə VIP karuselində ən diqqətçəkən yerdə qalacaq.</p>
            </div>
            
            <button onClick={() => setStep(1)} className="text-gray-500 font-bold hover:text-black mt-2 self-start transition-colors">← Başqa elan seç</button>
          </div>

          {/* PAYMENT FORM */}
          <div>
            <div className={`bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl transition-all duration-500 ${!paymentPlan ? 'opacity-50 pointer-events-none filter grayscale' : ''}`}>
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-bold text-xl">Kartla ödəniş</h3>
                  <p className="text-sm text-gray-500 font-medium">Tam təhlükəsiz SSL bağlantısı</p>
                </div>
              </div>
              
              <form onSubmit={handlePayment} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kartın üzərindəki ad və soyad</label>
                  <input type="text" placeholder="ELSHAN GAHRAMANOGLU" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 outline-none transition-colors uppercase font-medium" required />
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
                  <span>Məbləğ: <span className="font-black text-xl text-black">{paymentPlan === 'vip' ? '15.00' : paymentPlan === 'premium' ? '5.00' : '2.00'} ₼</span></span>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing || !paymentPlan}
                  className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ödənişi Təsdiqlə"}
                </button>
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
