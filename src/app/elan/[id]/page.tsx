"use client";

import React, { use, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { categoriesData } from "@/data/categories";
import { Heart, Share2, MapPin, Phone, MessageCircle, AlertTriangle, ChevronRight, Crown, Star, Loader2, Eye, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AdCard from "@/components/AdCard";
import { supabase } from "@/lib/supabase";

export default function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const adId = resolvedParams.id;
  const { ads, favorites, toggleFavorite, user } = useAppContext();
  
  
  const [localAd, setLocalAd] = useState<any>(null);
  const [isFetchingAd, setIsFetchingAd] = useState(true);
  
  const ad = ads.find(a => a.id === adId) || localAd;

  React.useEffect(() => {
    if (ads.find(a => a.id === adId)) {
      setIsFetchingAd(false);
      return;
    }
    
    let isMounted = true;
    const fetchSingleAd = async () => {
      try {
        const { data } = await supabase.from('ads').select('*').eq('id', adId).single();
        if (isMounted && data) {
          setLocalAd({
             ...data,
             categoryId: data.category_id,
             date: new Date(data.created_at).toLocaleString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
             isPremium: data.is_premium || false,
          });
        }
      } catch(e) {}
      finally {
        if (isMounted) setIsFetchingAd(false);
      }
    };
    fetchSingleAd();
    return () => { isMounted = false; };
  }, [adId, ads]);

  const isFav = favorites.includes(adId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [dbUserId, setDbUserId] = useState<string | null>(ad?.user_id || null);
  const [sellerAvatar, setSellerAvatar] = useState<string | null>(null);

  const [realViews, setRealViews] = useState<number>(ad?.views || 0);
  const [realContacts, setRealContacts] = useState<number>(ad?.contacts_count || 0);

  React.useEffect(() => {
    if (!ad) return;
    let isMounted = true;
    const fetchAndIncrement = async () => {
      try {
        // Increment first
        await supabase.rpc('increment_ad_views', { ad_id: ad.id });
        // Then fetch latest
        const { data } = await supabase.from('ads').select('views, contacts_count').eq('id', ad.id).single();
        if (isMounted && data) {
          setRealViews(data.views || (ad.views || 0) + 1);
          setRealContacts(data.contacts_count || ad.contacts_count);
        }
      } catch (err) {}
    };
    fetchAndIncrement();
    return () => { isMounted = false; };
  }, [ad]);


  React.useEffect(() => {
    if (ad && !ad.user_id) {
      supabase.from('ads').select('user_id').eq('id', ad.id).single().then(({ data }) => {
        if (data?.user_id) {
          setDbUserId(data.user_id);
          supabase.from('users').select('avatar').eq('id', data.user_id).single().then(res => {
            if (res.data?.avatar) setSellerAvatar(res.data.avatar);
          });
        }
      });
    } else if (ad?.user_id) {
      supabase.from('users').select('avatar').eq('id', ad.user_id).single().then(res => {
        if (res.data?.avatar) setSellerAvatar(res.data.avatar);
      });
    }
  }, [ad]);
  
  
  
  




  if (isFetchingAd) return <div className="py-32 flex justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin" /></div>;
  if (!ad) return <div className="text-center py-32 text-xl font-bold text-gray-500">Elan tapılmadı və ya silinib!</div>;

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
          <div className="flex flex-col gap-4">
            <div 
              onClick={() => { if (ad.images && ad.images.length > 0) setIsLightboxOpen(true); }}
              className="bg-gray-100 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center text-gray-400 text-2xl font-bold border border-gray-200 relative overflow-hidden group cursor-zoom-in"
            >
              {(ad.images && ad.images.length > 0) ? (
                <><div className="absolute inset-0 bg-black/5 backdrop-blur-3xl z-0"><img src={ad.images[currentImageIndex]} className="w-full h-full object-cover opacity-50 blur-xl" alt="" /></div><img src={ad.images[currentImageIndex]} alt={ad.title} fetchPriority="high" decoding="async" className="w-full h-full object-contain relative z-10" /></>
              ) : ad.imagePlaceholder.startsWith('http') ? (
                <img src={ad.imagePlaceholder} alt={ad.title} fetchPriority="high" className="w-full h-full object-cover" />
              ) : (
                ad.imagePlaceholder
              )}
              {ad.isPremium && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                  <Crown className="w-4 h-4" /> Premium
                </div>
              )}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm z-10 pointer-events-none">
                {(ad.images && ad.images.length > 0) ? `${currentImageIndex + 1} / ${ad.images.length}` : "1 / 1"}
              </div>
            </div>
            
            {/* Thumbnails */}
            {(ad.images && ad.images.length > 1) && (
              <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar snap-x">
                {ad.images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all snap-center ${currentImageIndex === idx ? 'border-blue-600 shadow-md scale-100' : 'border-transparent hover:border-gray-300 scale-95 opacity-80 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="Thumb" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title and Details */}
          <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-black mb-3">{ad.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><MapPin className="w-4 h-4" /> {ad.city}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">Yeniləndi: {ad.date}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1.5"><Eye className="w-4 h-4 text-gray-500" /> Baxış: {realViews}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-500" /> Əlaqə: {realContacts}</span>
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
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black border-2 border-blue-100 overflow-hidden flex-shrink-0">
                {sellerAvatar ? <img src={sellerAvatar} className="w-full h-full object-cover" alt="" /> : ad.contactName.charAt(0)}
              </div>
              <div>
                {dbUserId ? (
                  <Link href={`/istifadeci/${dbUserId}`} className="hover:underline">
                    <h3 className="font-black text-xl text-black">{ad.contactName}</h3>
                  </Link>
                ) : (
                  <h3 className="font-black text-xl text-black">{ad.contactName}</h3>
                )}
                <p className="text-gray-500 text-sm font-medium">MegaElan istifadəçisi</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a href={`tel:${ad.contactPhone}`} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black text-xl py-4 rounded-xl transition-colors shadow-lg shadow-green-500/30">
                <Phone className="w-6 h-6" />
                {ad.contactPhone}
              </a>
              
              <Link href={`/mesajlar?user_id=${dbUserId}&ad_id=${ad.id}`} onClick={() => { try { { supabase.rpc('increment_ad_contacts', { ad_id: ad.id }); setRealContacts(prev => prev + 1); } } catch(e){} }} className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold py-4 rounded-xl transition-colors">
                <MessageCircle className="w-6 h-6" />
                Mesaj yaz
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
              <button onClick={() => navigator.share ? navigator.share({ title: ad.title, url: window.location.href }).catch(() => {}) : navigator.clipboard.writeText(window.location.href).then(() => alert('Link kopyalandı!')).catch(() => {})} className="text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                <Share2 className="w-4 h-4" /> Paylaş
              </button>
              <button onClick={() => window.open(`https://wa.me/994703484901?text=${encodeURIComponent('Salam, bu elanı şikayət etmək istəyirəm:\n\n' + window.location.href)}`, '_blank')} className="text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                <AlertTriangle className="w-4 h-4" /> Şikayət et
              </button>
            </div>
          </div>
          
          {/* Promo Box - Only visible to owner */}
          {isOwner && (
            <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-600/30 text-center animate-in fade-in duration-500">
              <Crown className="w-12 h-12 mx-auto text-orange-400 mb-4 drop-shadow-md" />
              <h3 className="font-black text-2xl mb-2">Daha çox alıcı tap!</h3>
              <p className="text-blue-100 mb-6 text-sm font-medium">Elanınızı İrəli Çəkin və ya Premium edərək daha çox insanın görməsini təmin edin.</p>
              <Link href={`/reklam?adId=${ad.id}`} className="block w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-md">
                Reklam et (Xidmətlər)
              </Link>
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
      <AnimatePresence>
        {isLightboxOpen && ad.images && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
          >
            <div className="flex justify-between items-center p-4">
              <div className="text-white font-bold">{currentImageIndex + 1} / {ad.images.length}</div>
              <button onClick={() => setIsLightboxOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 relative flex items-center justify-center p-4">
              <img src={ad.images[currentImageIndex]} className="w-auto h-auto max-w-[90vw] md:max-w-3xl max-h-[60vh] md:max-h-[80vh] object-contain rounded-xl shadow-2xl" alt="" />
              
              {ad.images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === 0 ? ad.images!.length - 1 : prev - 1); }} 
                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === ad.images!.length - 1 ? 0 : prev + 1); }} 
                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
