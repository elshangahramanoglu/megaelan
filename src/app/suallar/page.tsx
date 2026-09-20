"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Saytda elan yerləşdirmək pulludur?",
    a: "Xeyr, saytda adi elan yerləşdirmək tamamilə pulsuzdur. Siz hər ay hər kateqoriya üzrə 3 dəfə pulsuz elan yerləşdirə bilərsiniz. Bu limiti (3 elanı) keçdikdən sonra 4-cü və əlavə hər elan üçün 3.00 AZN xidmət haqqı tələb olunur."
  },
  {
    q: "Elanım nə vaxt saytda görünəcək?",
    a: "Elanlar yerləşdirildikdən dərhal sonra sistemimiz tərəfindən avtomatik yoxlanışa (Gözləmədə) keçir. Qaydalar pozulmayıbsa, cəmi 1 dəqiqə ərzində aktivlənərək saytda görünür."
  },
  {
    q: "Elanımı sonradan redaktə edə bilərəmmi?",
    a: "Bəli. Siz Şəxsi Kabinetinizdən öz elanlarınızı redaktə edə bilərsiniz. Lakin təhlükəsizlik məqsədilə 24 saat ərzində maksimum 2 dəfə redaktə limitiniz var."
  },
  {
    q: "Şəxsi məlumatlarımı (Ad, Soyad) necə dəyişə bilərəm?",
    a: "Şəxsi kabinetinizə daxil olaraq 'Şəxsi məlumatlar' bölməsindən ad və soyadınızı yeniləyə bilərsiniz. Qeydiyyat nömrəsini dəyişmək isə mümkün deyil."
  },
  {
    q: "Daha çox alıcı tapmaq üçün nə etməliyəm?",
    a: "Elanınızın daha çox insana çatması üçün 'Reklam Xidmətləri'ndən (Premium, VIP və ya İrəli çək) istifadə edə bilərsiniz. Bu xidmətlər elanınızı ana səhifədə xüsusi bloklarda göstərir."
  },
  {
    q: "Niyə elanım rədd edildi (qəbul edilmədi)?",
    a: "Elanlar yalnız MegaElan qaydalarını pozduqda (məsələn: nalayiq ifadələr, qeyri-etik şəkillər, saxtakarlıq) süni intellekt botumuz və ya moderatorlarımız tərəfindən rədd edilir."
  },
  {
    q: "Şifrəmi unutmuşam, necə bərpa edim?",
    a: "Sistemimiz yalnız SMS təsdiqi ilə işlədiyi üçün şifrəyə ehtiyac yoxdur. Telefon nömrənizi daxil edərək gələn yeni kodla hər zaman təhlükəsiz giriş edə bilərsiniz."
  },
  {
    q: "Elanımı necə silə bilərəm?",
    a: "Şəxsi kabinetinizə daxil olaraq 'Mənim Elanlarım' bölməsindəki elan siyahınızda zibil qutusu ikonuna (Sil) klikləyərək elanınızı anında silə bilərsiniz."
  },
  {
    q: "Elanımın müddəti nə qədərdir?",
    a: "Hər bir pulsuz elan saytda 30 gün müddətində aktiv qalır. Müddət bitdikdə elanınız avtomatik olaraq 'Müddəti bitmiş' bölməsinə keçir və onu yenidən aktivləşdirə bilərsiniz."
  },
  {
    q: "Digər istifadəçilərlə necə əlaqə saxlaya bilərəm?",
    a: "Elan detalları səhifəsində satıcının əlaqə nömrəsi qeyd olunur. Birbaşa nömrəyə zəng edə və ya Whatsapp üzərindən əlaqə saxlaya bilərsiniz."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tez-tez verilən suallar</h1>
      
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none transition-colors hover:bg-gray-50"
            >
              <span className="font-bold text-gray-900 text-lg pr-4">{item.q}</span>
              <ChevronDown className={`w-6 h-6 flex-shrink-0 text-blue-600 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-6 pb-5 pt-0">
                <p className="text-gray-600 font-medium leading-relaxed">{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
