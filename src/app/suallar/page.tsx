"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Saytda elan yerləşdirmək pulludur?",
    a: "Xeyr, saytda adi elan yerləşdirmək tamamilə pulsuzdur. Ancaq elanınızın daha çox insan tərəfindən görülməsini istəyirsinizsə, 'Premium' xidmətindən istifadə edə bilərsiniz."
  },
  {
    q: "Elanım nə vaxt təsdiqlənəcək?",
    a: "Elanlar yerləşdirildikdən sonra moderatorlarımız tərəfindən yoxlanılır. Adətən bu proses 10-15 dəqiqə ərzində tamamlanır."
  },
  {
    q: "Şəxsi məlumatlarımı necə dəyişə bilərəm?",
    a: "Şəxsi kabinetinizə daxil olaraq 'Şəxsi məlumatlar' bölməsindən ad və soyadınızı yeniləyə bilərsiniz. Təhlükəsizlik məqsədilə qeydiyyat nömrəsini dəyişmək mümkün deyil."
  },
  {
    q: "Müvəqqəti və ya ödənişsiz məhsullar üçün qiyməti necə yazım?",
    a: "Əgər məhsulu pulsuz verirsinizsə və ya müvəqqəti olaraq dəyərsizdirsə, qiymət hissəsinə '0' (sıfır) yaza bilərsiniz."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tez-tez verilən suallar</h1>
      
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all shadow-sm">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-medium text-gray-900">{item.q}</span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            
            {openIndex === idx && (
              <div className="px-6 pb-4 pt-0">
                <p className="text-gray-600">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
