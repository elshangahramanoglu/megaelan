"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, CheckCircle, ArrowRight, ShieldCheck, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adId = searchParams.get('adId');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!adId) {
      router.push("/");
    }
  }, [adId, router]);

  const handlePayment = async () => {
    if (!adId) return;
    setIsProcessing(true);

    try {
      // Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Real flow: we would call Birbank API here, then update status
      const { error } = await supabase
        .from('ads')
        .update({ status: 'pending' }) // after paying for limit, it goes back to moderation pending
        .eq('id', adId);
        
      if (error) throw error;
      
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Ödəniş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-20 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-black mb-4">Ödəniş Uğurludur!</h1>
        <p className="text-gray-700 font-medium mb-8">Elanınız üçün ödəniş qəbul edildi. Hazırda yoxlanışdadır (Gözləmədə) və tezliklə saytda aktivləşəcək.</p>
        <button 
          onClick={() => router.push('/kabinet')}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg"
        >
          Kabinetə qayıt
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 md:py-20">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Info Panel */}
        <div className="bg-blue-600 p-8 md:p-10 text-white md:w-2/5 flex flex-col justify-between">
          <div>
            <Crown className="w-12 h-12 text-blue-200 mb-6" />
            <h1 className="text-3xl font-black mb-4">Limit Aşılıb</h1>
            <p className="text-blue-100 font-medium leading-relaxed mb-6">
              Siz bu kateqoriya üzrə pulsuz elan limitinizi (1 elan) doldurmusunuz. Yeni elanın saytda yayımlanması üçün birdəfəlik ödəniş etməlisiniz.
            </p>
          </div>
          <div className="bg-blue-700/50 p-4 rounded-xl backdrop-blur-sm mt-8">
            <p className="text-sm text-blue-200 font-medium mb-1">Xidmət haqqı</p>
            <p className="text-3xl font-black">3.00 <span className="text-xl">AZN</span></p>
          </div>
        </div>

        {/* Right Payment Form Panel */}
        <div className="p-8 md:p-10 md:w-3/5">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-gray-400" /> Ödəniş Məlumatları
          </h2>
          
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kartın nömrəsi</label>
              <input 
                type="text" 
                placeholder="4169 0000 0000 0000" 
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-medium bg-gray-50"
                maxLength={19}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Bitmə tarixi</label>
                <input 
                  type="text" 
                  placeholder="AA/İİ" 
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-medium bg-gray-50"
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                <input 
                  type="password" 
                  placeholder="***" 
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none font-medium bg-gray-50"
                  maxLength={3}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2 bg-green-50 p-4 rounded-xl border border-green-100">
              <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium text-green-800 leading-relaxed">
                Ödənişlər 3D Secure sistemi ilə qorunur. Kart məlumatlarınız saytımızda yadda saxlanılmır və birbaşa banka göndərilir.
              </p>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-4 bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {isProcessing ? "Ödəniş olunur..." : "3.00 AZN Ödəniş Et"} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-gray-500">Yüklənir...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
