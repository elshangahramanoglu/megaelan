"use client";

import React, { useState } from "react";
import { categoriesData } from "@/data/categories";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle, Info, Plus, ArrowRight } from "lucide-react";
import { AZERBAIJAN_CITIES } from "@/data/cities";

export default function NewAdPage() {
  const { user, addAd, login } = useAppContext();
  const router = useRouter();

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
            onClick={() => login("+994501234567")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Daxil ol <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: categoriesData[0].id,
    subCategory: "",
    price: "",
    city: "Bakı",
    description: "",
    contactName: user ? `${user.firstName} ${user.lastName}`.trim() : "",
    contactPhone: user ? user.phone : ""
  });
  
  const [dynamicDetails, setDynamicDetails] = useState<Record<string, string>>({});

  const selectedCategory = categoriesData.find(c => c.id === formData.categoryId) || categoriesData[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset subCategory when category changes
    if (e.target.name === 'categoryId') {
      setFormData(prev => ({ ...prev, subCategory: "", categoryId: e.target.value }));
      setDynamicDetails({});
    }
  };

  const handleDetailChange = (name: string, value: string) => {
    setDynamicDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAd = {
      id: `new-${Date.now()}`,
      title: formData.title,
      price: Number(formData.price) || 0,
      currency: "AZN",
      city: formData.city,
      date: "İndi",
      categoryId: formData.categoryId,
      subCategory: formData.subCategory,
      isPremium: false,
      imagePlaceholder: "Yeni Şəkil",
      description: formData.description,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone || (user ? user.phone : ""),
      details: dynamicDetails
    };
    
    addAd(newAd);
    setIsSuccess(true);
    
    setTimeout(() => {
      router.push(`/elan/${newAd.id}`);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">Elanınız uğurla əlavə edildi!</h1>
        <p className="text-gray-700 mb-8 font-medium">Yeni elanınız artıq yoxlanışa göndərildi və qısa zamanda saytda görünəcək.</p>
        <p className="text-blue-600 font-bold">Elana yönləndirilirsiniz...</p>
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
                required
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
              {selectedCategory.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-bold text-black mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={dynamicDetails[field.name] || ""}
                      onChange={(e) => handleDetailChange(field.name, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-black font-medium"
                    >
                      <option value="">Seçilməyib</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
              ))}
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
              required
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-base font-bold text-black mb-2">Şəkillər (Min 1, Maks 10 şəkil) *</label>
          <div className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 transition-colors">
            <UploadCloud className="w-10 h-10 text-gray-500 mb-4" />
            <p className="text-black font-bold mb-1 text-lg">Şəkil yükləmək üçün klikləyin və ya sürüşdürüb buraxın</p>
            <p className="text-gray-600 text-sm font-medium">Hər şəkil üçün maksimum ölçü: 15MB. (Məsləhətlidir: üfüqi şəkillər)</p>
          </div>
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
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none text-black font-bold text-lg"
              required
            />
            <p className="text-sm text-gray-600 mt-2 font-medium">Müvəqqəti pulsuz elan üçün <span className="text-black font-bold">0</span> yaza bilərsiniz.</p>
          </div>
          <div>
            <label className="block text-base font-bold text-black mb-2">Şəhər *</label>
            <select 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-black font-medium text-lg"
              required
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
            required
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
              required
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
              required
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
