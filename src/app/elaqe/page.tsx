"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-black mb-4">Bizimlə Əlaqə</h1>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto">
          Hər hansı bir sualınız, təklifiniz və ya şikayətiniz varsa, bizimlə əlaqə saxlamaqdan çəkinməyin. Komandamız sizə kömək etməkdən məmnun olar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="flex flex-col gap-8">
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
            <h2 className="text-2xl font-black text-black mb-8">Əlaqə məlumatları</h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold mb-1">Mobil nömrə</p>
                  <a href="tel:0703484901" className="text-xl font-black text-black hover:text-blue-600 transition-colors">070 348 49 01</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold mb-1">E-poçt ünvanı</p>
                  <a href="mailto:destek@megaelan.com" className="text-xl font-black text-black hover:text-blue-600 transition-colors">destek@megaelan.com</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold mb-1">Ünvan</p>
                  <p className="text-lg font-bold text-black">Saatlı şəhəri, H.Əliyev prospekti</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50">
            <h2 className="text-2xl font-black text-black mb-6">Mesaj göndərin</h2>
            
            {isSent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-[350px]">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-black text-black mb-2">Mesajınız göndərildi!</h3>
                <p className="text-gray-500 font-medium">Ən qısa zamanda sizinlə əlaqə saxlayacağıq.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Ad və Soyadınız</label>
                  <input type="text" placeholder="Adınız" className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-black font-medium" required />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-black mb-2">E-poçt və ya Nömrəniz</label>
                  <input type="text" placeholder="Əlaqə vasitəsi" className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none text-black font-medium" required />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Mesajınız</label>
                  <textarea rows={4} placeholder="Bizə nə demək istəyirsiniz?" className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 outline-none resize-y text-black font-medium leading-relaxed" required></textarea>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                  <Send className="w-5 h-5" /> Göndər
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
