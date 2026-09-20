"use client";

import React, { useState } from "react";
import { categoriesData } from "@/data/categories";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle } from "lucide-react";

export default function NewAdPage() {
  const { user, addAd } = useAppContext();
  const router = useRouter();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: categoriesData[0].id,
    price: "",
    city: "Bakı",
    description: "",
    contactName: user ? `${user.firstName} ${user.lastName}`.trim() : "",
    contactPhone: user ? user.phone : ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new ad
    const newAd = {
      id: `new-${Date.now()}`,
      title: formData.title,
      price: Number(formData.price),
      currency: "AZN",
      city: formData.city,
      date: "İndi",
      categoryId: formData.categoryId,
      isPremium: false,
      imagePlaceholder: "Yeni Şəkil",
      description: formData.description,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone || (user ? user.phone : "")
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Elanınız uğurla əlavə edildi!</h1>
        <p className="text-gray-500 mb-8">Yeni elanınız artıq yoxlanışa göndərildi və qısa zamanda saytda görünəcək.</p>
        <p className="text-blue-600">Elana yönləndirilirsiniz...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Yeni elan yerləşdir</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* Category & Title */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kateqoriya *</label>
            <select 
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              required
            >
              {categoriesData.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Elanın başlığı *</label>
            <input 
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Məsələn: iPhone 13 Pro Max, 256GB"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Şəkillər</label>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium mb-1">Şəkil yükləmək üçün klikləyin və ya sürüşdürüb buraxın</p>
            <p className="text-gray-400 text-sm">PNG, JPG (Maksimum 5MB)</p>
          </div>
        </div>

        {/* Price & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Qiymət (AZN) *</label>
            <input 
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Müvəqqəti pulsuz elan üçün 0 yaza bilərsiniz.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şəhər *</label>
            <select 
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              required
            >
              {["Bakı", "Sumqayıt", "Gəncə", "Xırdalan", "Mingəçevir"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Məzmun *</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Məhsul haqqında ətraflı məlumat yazın..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
            required
          />
        </div>

        {/* Contact */}
        <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adınız *</label>
            <input 
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Adınız"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Əlaqə nömrəsi *</label>
            <input 
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="050 123 45 67"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl transition-colors mt-4">
          Elanı yerləşdir
        </button>
      </form>
    </div>
  );
}
