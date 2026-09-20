"use client";

import React, { useState } from "react";
import { categoriesData } from "@/data/categories";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCloud, CheckCircle, Info, Plus, ArrowRight, Crown, Star } from "lucide-react";
import { AZERBAIJAN_CITIES } from "@/data/cities";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function NewAdPage() {
  const { user, addAd, setLoginOpen } = useAppContext();
  const router = useRouter();

  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: categoriesData[0].id,
    subCategory: "",
    price: "",
    city: "Bakı",
    description: "",
    contactName: user ? user.name : "",
    contactPhone: user ? user.phone : ""
  });
  
  const [dynamicDetails, setDynamicDetails] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAdId, setCreatedAdId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<'vip' | 'premium' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!user) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 flex flex-col items-center text-center">
        <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm max-w-lg w-full">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-black mb-4">Yeni Elan</h1>
          <p className="text-gray-600 mb-8 font-medium leading-relaxed">
            Elan yerləşdirmək üçün sistemə daxil olmalısınız. Qeydiyyat nömrə vasitəsilə çox sadə və pulsuzdur.
          </p>
          <button 
            onClick={() => setLoginOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Daxil ol <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const selectedCategory = categoriesData.find(c => c.id === formData.categoryId) || categoriesData[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset subCategory when category changes
    if (e.target.name === 'categoryId') {
      setFormData(prev => ({ ...prev, subCategory: "", categoryId: e.target.value }));
      setDynamicDetails({});
    }
  };


  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      alert("Ödəniş uğurla qəbul edildi! Elanınız önə çəkildi.");
      router.push(`/elan/${createdAdId}`);
    }, 2000);
  };

  const handleDetailChange = (name: string, value: string) => {
    setDynamicDetails(prev => {
      const newDetails = { ...prev, [name]: value };
      // If a parent field like 'brand' changes, reset its dependent 'model' field
      selectedCategory.fields.forEach(field => {
        if (field.dependsOn === name) {
          newDetails[field.name] = "";
        }
      });
      return newDetails;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.title || !formData.price || !formData.city || !formData.description || !formData.contactName || !formData.contactPhone) {
      alert("Zəhmət olmasa bütün vacib xanaları (*) doldurun.");
      return;
    }
    
    if (Number(formData.price) < 1) {
      alert("Qiymət minimum 1 AZN olmalıdır.");
      return;
    }

    if (files.length === 0) {
      alert("Ən azı 1 şəkil yükləməyiniz mütləqdir!");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload images
      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImageToImgBB(file);
        if (url) imageUrls.push(url);
      }
      
      // 2. Insert into Supabase
      const { data: insertedAd, error } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: Number(formData.price) || 0,
          currency: 'AZN',
          city: formData.city,
          category_id: formData.categoryId,
          sub_category: formData.subCategory,
          images: imageUrls,
          details: dynamicDetails,
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone || user.phone,
          status: 'active'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // 3. Update Global Context to show it immediately
      const newAd = {
        id: insertedAd.id,
        title: insertedAd.title,
        price: insertedAd.price,
        currency: insertedAd.currency,
        city: insertedAd.city,
        date: "İndi",
        categoryId: insertedAd.category_id,
        subCategory: insertedAd.sub_category,
        isPremium: false,
        imagePlaceholder: imageUrls.length > 0 ? imageUrls[0] : "Yeni Şəkil", // fallback or use the real image
        images: imageUrls,
        description: insertedAd.description,
        contactName: insertedAd.contact_name,
        contactPhone: insertedAd.contact_phone,
        details: insertedAd.details
      };
      
      addAd(newAd as any);
      setIsSuccess(true);
      setCreatedAdId(newAd.id); // Save ID for manual navigation
      
    } catch (err) {
      console.error("Ad creation error:", err);
      alert("Elan yerləşdirilərkən xəta baş verdi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    if (showPayment) {
      return (
        <div className="w-full max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-black mb-6 text-center">Reklam xidmətləri</h1>
          
          {!paymentPlan ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-orange-200 bg-orange-50 rounded-3xl p-6 text-center hover:shadow-lg cursor-pointer transition-all" onClick={() => setPaymentPlan('premium')}>
                <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-2xl text-black mb-2">Premium Elan</h3>
                <p className="text-gray-600 mb-4 font-medium">Elanınız axtarışda ilk sıralarda və xüsusi rənglə vurğulanır.</p>
                <div className="text-3xl font-black text-orange-600 mb-6">5.00 <span className="text-xl">AZN</span></div>
                <button className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl">Seç</button>
              </div>
              <div className="border-2 border-purple-200 bg-purple-50 rounded-3xl p-6 text-center hover:shadow-lg cursor-pointer transition-all" onClick={() => setPaymentPlan('vip')}>
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-2xl text-black mb-2">VIP Elan</h3>
                <p className="text-gray-600 mb-4 font-medium">Ana səhifədə xüsusi VIP blokunda günlərlə görünür.</p>
                <div className="text-3xl font-black text-purple-600 mb-6">15.00 <span className="text-xl">AZN</span></div>
                <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl">Seç</button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-black">Ödəniş ({paymentPlan === 'vip' ? '15.00' : '5.00'} AZN)</h3>
                <button onClick={() => setPaymentPlan(null)} className="text-blue-600 font-medium text-sm">Geri qayıt</button>
              </div>
              
              <form onSubmit={handlePayment} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Kartın nömrəsi</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-black font-medium" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Bitmə tarixi</label>
                    <input type="text" placeholder="AA/İİ" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-black font-medium" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
                    <input type="password" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-black font-medium" required />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isProcessingPayment}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? <Loader2 className="w-6 h-6 animate-spin" /> : `Ödənişi təsdiqlə (${paymentPlan === 'vip' ? '15.00' : '5.00'} AZN)`}
                </button>
              </form>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">Elanınız uğurla əlavə edildi!</h1>
        <p className="text-gray-700 mb-8 font-medium">Yeni elanınız artıq yoxlanışa göndərildi və qısa zamanda saytda görünəcək. Daha çox alıcı tapmaq üçün elanınızı önə çəkə bilərsiniz.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setShowPayment(true)}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Crown className="w-5 h-5" /> Reklam et
          </button>
          <Link 
            href={`/elan/${createdAdId}`}
            className="px-8 py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors"
          >
            Elana bax
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-black mb-6">Yeni elan yerləşdir</h1>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-8 flex items-start gap-3">
        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-black font-medium text-sm leading-relaxed">
          <span className="font-bold text-blue-700">Qayda:</span> Hər bir istifadəçi ay ərzində hər kateqoriya üzrə <span className="font-bold">3 pulsuz elan</span> yerləşdirə bilər. Əlavə elanlar və ya Premium xidmətlər üçün tariflərlə tanış olun: 
          <br/>• İrəli çək: 1 gün - 0.50 AZN, 3 gün - 1.30 AZN, 7 gün - 3 AZN
          <br/>• Premium: 1 gün - 1 AZN, 1 həftə - 5 AZN, 1 ay - 20 AZN
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
        
        {/* Category & Title */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-bold text-black mb-2">Kateqoriya *</label>
              <select 
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-black font-medium"
                              >
                {categoriesData.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            {selectedCategory.subcategories.length > 0 && (
              <div>
                <label className="block text-base font-bold text-black mb-2">Alt Kateqoriya</label>
                <select 
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-black font-medium"
                >
                  <option value="">Seçilməyib</option>
                  {selectedCategory.subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Dynamic Fields */}
          {selectedCategory.fields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="md:col-span-3 text-lg font-bold text-black mb-2 border-b border-gray-200 pb-2">Əlavə Məlumatlar</h3>
              {selectedCategory.fields.map(field => {
                // Dependency check: if it depends on another field, check if that field has a value
                if (field.dependsOn) {
                  const dependentValue = dynamicDetails[field.dependsOn];
                  if (!dependentValue) return null; // Don't render until parent is selected
                }
                
                // Get options either from standard options or dynamicOptions based on parent value
                let currentOptions = field.options;
                if (field.dependsOn && field.dynamicOptions) {
                  const parentVal = dynamicDetails[field.dependsOn];
                  currentOptions = field.dynamicOptions[parentVal] || ["Digər"];
                }

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-bold text-black mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        value={dynamicDetails[field.name] || ""}
                        onChange={(e) => handleDetailChange(field.name, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-black font-medium"
                      >
                        <option value="">Seçilməyib</option>
                        {currentOptions?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder || ""}
                        value={dynamicDetails[field.name] || ""}
                        onChange={(e) => handleDetailChange(field.name, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none text-black font-medium"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <div>
            <label className="block text-base font-bold text-black mb-2">Elanın başlığı *</label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Məsələn: iPhone 13 Pro Max, 256GB"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none text-black font-medium"
                          />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-base font-bold text-black mb-2">Şəkillər (Maks 10 şəkil) *</label>
          <label className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 transition-colors relative">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFiles = Array.from(e.target.files).slice(0, 10);
                  setFiles(selectedFiles);
                }
              }}
            />
            <UploadCloud className="w-10 h-10 text-gray-500 mb-4" />
            <p className="text-black font-bold mb-1 text-lg">Şəkil yükləmək üçün bura klikləyin</p>
            <p className="text-gray-600 text-sm font-medium mb-4">Maksimum 10 şəkil icazə verilir.</p>
            
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {files.map((f, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-medium border border-blue-200">
                    {f.name.length > 15 ? f.name.substring(0,15) + '...' : f.name}
                  </span>
                ))}
              </div>
            )}
          </label>
        </div>

        {/* Price & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-bold text-black mb-2">Qiymət (AZN) *</label>
            <input 
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1"
              min="1"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none text-black font-bold text-lg"
                          />
            
          </div>
          <div>
            <label className="block text-base font-bold text-black mb-2">Şəhər *</label>
            <select 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-black font-medium text-lg"
                          >
              {AZERBAIJAN_CITIES.filter(c => c !== "Bütün şəhərlər").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-base font-bold text-black mb-2">Məzmun *</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Məhsul haqqında ətraflı məlumat yazın..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none resize-y text-black font-medium leading-relaxed"
                      />
        </div>

        {/* Contact */}
        <div className="border-t-2 border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-bold text-black mb-2">Adınız *</label>
            <input 
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Adınız"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none text-black font-medium"
                          />
          </div>
          <div>
            <label className="block text-base font-bold text-black mb-2">Əlaqə nömrəsi *</label>
            <input 
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="050 123 45 67"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none text-black font-bold"
                          />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-5 rounded-2xl transition-colors mt-4 shadow-lg shadow-blue-600/30">
          Elanı yerləşdir
        </button>
      </form>
    </div>
  );
}
