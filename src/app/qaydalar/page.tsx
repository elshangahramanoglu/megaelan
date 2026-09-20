import React from "react";

export default function QaydalarPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Saytın Qaydaları</h1>
      
      <div className="prose prose-blue max-w-none text-gray-700">
        <p className="mb-4">MegaElan platformasından istifadə etməzdən əvvəl bu qaydalarla tanış olmağınız xahiş olunur.</p>
        
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Ümumi müddəalar</h2>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>MegaElan saytı alıcı və satıcıları birləşdirən vasitəçi platformadır.</li>
          <li>Saytda yerləşdirilən elanların məzmununa görə elanı yerləşdirən şəxs məsuliyyət daşıyır.</li>
          <li>Qanunvericiliyə zidd olan hər hansı məhsul və ya xidmətin satışı qəti qadağandır.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Elanların yerləşdirilməsi</h2>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>Hər bir məhsul üçün yalnız bir elan yerləşdirilə bilər.</li>
          <li>Elanın başlığı və məzmunu aydın, anlaşıqlı olmalıdır.</li>
          <li>Şəkillər məhsulun özünə aid olmalı və keyfiyyətli olmalıdır.</li>
          <li>Qiymət bölməsində real qiymət qeyd edilməlidir (şərti olaraq 0 AZN qeyd etmək mümkündür).</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Qadağan olunmuş məhsullar</h2>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>Silah, partlayıcı maddələr və təhlükəli kimyəvi vasitələr.</li>
          <li>Dərman preparatları və tibbi ləvazimatlar (lisenziya olmadan).</li>
          <li>Pirat məhsullar və saxta sənədlər.</li>
        </ul>
      </div>
    </div>
  );
}
