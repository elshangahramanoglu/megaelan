import React from "react";

export default function MexfilikPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Məxfilik və Siyasət</h1>
      
      <div className="prose prose-blue max-w-none text-gray-700">
        <p className="mb-4">MegaElan istifadəçilərinin şəxsi məlumatlarının qorunmasına xüsusi önəm verir.</p>
        
        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Toplanan məlumatlar</h2>
        <p className="mb-4">Biz aşağıdakı məlumatları toplaya bilərik:</p>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>Qeydiyyat zamanı təqdim etdiyiniz ad, soyad və mobil nömrə.</li>
          <li>Saytda etdiyiniz axtarışlar və bəyəndiyiniz elanlar.</li>
          <li>IP ünvanınız və cihaz məlumatları (analitik məqsədlər üçün).</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Məlumatların istifadəsi</h2>
        <ul className="list-disc pl-5 mb-6 space-y-2">
          <li>Xidmət keyfiyyətini artırmaq və sizə daha uyğun elanlar göstərmək.</li>
          <li>Elan yerləşdirdikdə potensial alıcıların sizinlə əlaqə saxlamasını təmin etmək.</li>
          <li>Dələduzluq hallarının qarşısını almaq üçün təhlükəsizlik yoxlamaları etmək.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Məlumatların qorunması</h2>
        <p className="mb-6">
          Şəxsi məlumatlarınız şifrələnmiş şəkildə serverlərimizdə saxlanılır və qanunvericiliklə nəzərdə tutulmuş hallar istisna olmaqla, üçüncü tərəflərə ötürülmür.
        </p>
      </div>
    </div>
  );
}
