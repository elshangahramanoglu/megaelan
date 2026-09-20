"use client";

import React, { use, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { categoriesData } from "@/data/categories";
import { Heart, Share2, MapPin, Phone, MessageCircle, AlertTriangle, ChevronRight, Crown, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import AdCard from "@/components/AdCard";
import { supabase } from "@/lib/supabase";

export default function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const adId = resolvedParams.id;
  const { ads, favorites, toggleFavorite, user } = useAppContext();
  
  const ad = ads.find(a => a.id === adId);
  const isFav = favorites.includes(adId);
  
  const [showPromo, setShowPromo] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<'vip' | 'premium' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);



  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    
    // Simulate API Call for Payment
    setTimeout(async () => {
      try {
        // Update database to mark ad as premium or VIP
        const { error } = await supabase.from('ads').update({ 
          is_premium: paymentPlan === 'premium',
          is_vip: paymentPlan === 'vip' 
        }).eq('id', ad?.id);
        
        if (error) throw error;
        
        alert("Ödəniş uğurla qəbul edildi! Elanınız önə çəkildi.");
        // Reload page to show new status
        window.location.reload();
      } catch (err) {
        console.error("Payment failed", err);
        alert("Xəta baş verdi, yenidən cəhd edin.");
        setIsProcessingPayment(false);
      }
    }, 2000);
  };

  if (!ad) {
    return <div className="text-center py-20 text-xl font-bold">Elan tapılmadı!</div>;
  }

  const category = categoriesData.find(c => c.id === ad.categoryId);
  
  // Get similar ads (same category)
  const similarAds = ads.filter(a => a.categoryId === ad.categoryId && a.id !== ad.id).slice(0, 5);

  const isOwner = user && (user.phone === ad.contactPhone.replace('+994 ', ''));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600 font-medium">Ana səhifə</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/kateqoriya/${category?.id}`} className="hover:text-blue-600 font-medium">
          {category?.name}
        </Link>
        {ad.subCategory && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/kateqoriya/${category?.id}?sub=${encodeURIComponent(ad.subCategory)}`} className="hover:text-blue-600 font-medium">
              {ad.subCategory}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="font-bold text-black line-clamp-1">{ad.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* Image Gallery (Placeholder) */}
          {/* Image Gallery */}
          <div className="bg-gray-100 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center text-gray-400 text-2xl font-bold border border-gray-200 relative overflow-hidden group">
            {(ad.images && ad.images.length > 0) ? (
              <div className="w-full h-full relative flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                {ad.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`${ad.title} - ${idx+1}`} className="w-full h-full object-cover shrink-0 snap-center" />
                ))}
              </div>
            ) : ad.imagePlaceholder.startsWith('http') ? (
              <img src={ad.imagePlaceholder} alt={ad.title} className="w-full h-full object-cover" />
            ) : (
              ad.imagePlaceholder
            )}
            {ad.isPremium && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                <Crown className="w-4 h-4" /> Premium
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm z-10 pointer-events-none">
              {(ad.images && ad.images.length > 0) ? `${ad.images.length} şəkil` : "1 / 1"}
            </div>
          </div>

          {/* Title and Details */}
          <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-black mb-3">{ad.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><MapPin className="w-4 h-4" /> {ad.city}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Yeniləndi: {ad.date}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Baxış: 142</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleFavorite(ad.id)}
                  className={`p-3 rounded-full border-2 transition-colors ${isFav ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-black hover:text-red-500 hover:border-red-200'}`}
                >
                  <Heart className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <div className="text-4xl font-black text-blue-600">
              {ad.price} <span className="text-2xl font-bold">{ad.currency}</span>
            </div>

            {/* Dynamic fields display */}
            {ad.details && Object.keys(ad.details).length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  {category?.fields.map(field => {
                    const val = ad.details![field.name];
                    if (!val) return null;
                    return (
                      <div key={field.name} className="flex flex-col">
                        <span className="text-sm text-gray-500 font-medium">{field.label}</span>
                        <span className="text-black font-bold">{val} {field.unit || ""}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-black text-xl mb-4 text-black">Məzmun</h3>
              <p className="text-gray-800 whitespace-pre-line leading-relaxed font-medium">
                {ad.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 relative">
          {/* Contact Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black">
                {ad.contactName.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-xl text-black">{ad.contactName}</h3>
                <p className="text-gray-500 text-sm font-medium">MegaElan istifadəçisi</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a href={`tel:${ad.contactPhone}`} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black text-xl py-4 rounded-xl transition-colors shadow-lg shadow-green-500/30">
                <Phone className="w-6 h-6" />
                {ad.contactPhone}
              </a>
              
              <Link href="/mesajlar" className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold py-4 rounded-xl transition-colors">
                <MessageCircle className="w-6 h-6" />
                Mesaj yaz
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
              <button className="text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                <Share2 className="w-4 h-4" /> Paylaş
              </button>
              <button className="text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                <AlertTriangle className="w-4 h-4" /> Şikayət et
              </button>
            </div>
          </div>
          
          {/* Promo Box - Only visible to owner */}
          {isOwner && !showPromo && (
            <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-600/30 text-center">
              <Crown className="w-12 h-12 mx-auto text-orange-400 mb-4 drop-shadow-md" />
              <h3 className="font-black text-2xl mb-2">Daha çox alıcı tap!</h3>
              <p className="text-blue-100 mb-6 text-sm font-medium">Elanınızı İrəli Çəkin və ya Premium edərək daha çox insanın görməsini təmin edin.</p>
              <button onClick={() => setShowPromo(true)} className="w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-md">
                Reklam et (Xidmətlər)
              </button>
            </div>
          )}

          {isOwner && showPromo && !paymentPlan && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-xl text-black">Reklam xidmətləri</h3>
                <button onClick={() => setShowPromo(false)} className="text-gray-500 text-sm">Bağla</button>
              </div>
              
              <div className="flex flex-col gap-4">
                <div onClick={() => setPaymentPlan('premium')} className="border-2 border-orange-200 bg-orange-50 rounded-2xl p-4 text-center hover:shadow-lg cursor-pointer transition-all">
                  <Crown className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <h4 className="font-bold text-lg text-black mb-1">Premium</h4>
                  <div className="text-xl font-black text-orange-600 mb-3">5.00 AZN</div>
                  <button className="w-full py-2 bg-orange-500 text-white font-bold rounded-xl">Seç</button>
                </div>
                
                <div onClick={() => setPaymentPlan('vip')} className="border-2 border-purple-200 bg-purple-50 rounded-2xl p-4 text-center hover:shadow-lg cursor-pointer transition-all">
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-bold text-lg text-black mb-1">VIP</h4>
                  <div className="text-xl font-black text-purple-600 mb-3">15.00 AZN</div>
                  <button className="w-full py-2 bg-purple-600 text-white font-bold rounded-xl">Seç</button>
                </div>
              </div>
            </div>
          )}

          {isOwner && showPromo && paymentPlan && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-black">Ödəniş ({paymentPlan === 'vip' ? '15' : '5'} AZN)</h3>
                <button onClick={() => setPaymentPlan(null)} className="text-blue-600 text-sm font-medium">Geri</button>
              </div>
              
              <form onSubmit={handlePayment} className="flex flex-col gap-3">
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-black" required />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="AA/İİ" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-black" required />
                  <input type="password" placeholder="CVV" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-black" required />
                </div>
                <button 
                  type="submit" 
                  disabled={isProcessingPayment}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : "Təsdiqlə"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Similar Ads */}
      {similarAds.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-black text-black mb-8">Bənzər elanlar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {similarAds.map(similarAd => (
              <AdCard key={similarAd.id} ad={similarAd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
