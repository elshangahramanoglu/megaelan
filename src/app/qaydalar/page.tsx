import React from "react";

export default function QaydalarPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-black text-black mb-8">Saytın Qaydaları və Tariflər</h1>
      
      <div className="prose prose-blue max-w-none text-black font-medium leading-relaxed">
        <p className="mb-8 text-lg text-gray-700">MegaElan platformasından istifadə etməzdən əvvəl bu qaydalarla tanış olmağınız xahiş olunur. Saytdan istifadə edən hər bir şəxs bu qaydaları avtomatik qəbul etmiş sayılır.</p>
        
        <h2 className="text-2xl font-black text-blue-600 mt-10 mb-4 border-b-2 border-blue-100 pb-2">1. Elan yerləşdirmə limitləri və Tariflər</h2>
        <p className="mb-4">Biz istifadəçilərimizə həm pulsuz, həm də ödənişli əlavə xidmətlər təqdim edirik:</p>
        <ul className="list-disc pl-5 mb-6 space-y-3">
          <li><strong>Pulsuz Elanlar:</strong> Hər bir istifadəçi hər kateqoriya üzrə ayda <span className="text-blue-600 font-black text-xl">3 dəfə pulsuz</span> elan yerləşdirə bilər.</li>
          <li><strong>İrəli Çək (VIP):</strong> Elanın axtarışda yuxarı qalxması üçün:
            <ul className="list-circle pl-5 mt-2 space-y-1 text-gray-700">
              <li>1 günlük - 0.50 AZN</li>
              <li>3 günlük - 1.30 AZN</li>
              <li>7 günlük - 3.00 AZN</li>
            </ul>
          </li>
          <li><strong>Premium Elanlar:</strong> Elanın ana səhifədə xüsusi Premium blokda və fərqləndirici rənglərlə göstərilməsi üçün:
            <ul className="list-circle pl-5 mt-2 space-y-1 text-gray-700">
              <li>1 günlük - 1.00 AZN</li>
              <li>1 həftəlik (7 gün) - 5.00 AZN</li>
              <li>1 aylıq (30 gün) - 20.00 AZN</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-2xl font-black text-blue-600 mt-10 mb-4 border-b-2 border-blue-100 pb-2">2. Elanların məzmunu və yerləşdirilməsi</h2>
        <ul className="list-disc pl-5 mb-6 space-y-3">
          <li>Elan başlığı yalnız satılan məhsulu ifadə etməlidir. Başlıqda qiymət və ya nömrə yazmaq qadağandır.</li>
          <li>Yüklənəcək şəkillər minimum 1, maksimum 10 ədəd ola bilər. 1 şəklin ölçüsü maksimum 15MB olmalıdır.</li>
          <li>Şəkillər məhsulun özünə aid olmalı, üzərində digər saytların loqoları olmamalıdır.</li>
          <li>Əgər məhsul hədiyyə edilirsə (pulsuz verilirsə), qiymət bölməsində 0 AZN qeyd edilə bilər. Əks halda real satış qiyməti yazılmalıdır.</li>
        </ul>

        <h2 className="text-2xl font-black text-blue-600 mt-10 mb-4 border-b-2 border-blue-100 pb-2">3. Qadağan olunmuş məhsullar</h2>
        <p className="mb-4">Azərbaycan Respublikasının qanunvericiliyinə zidd olan heç bir məhsulun satışı həyata keçirilə bilməz. Bunlara daxildir, lakin bununla məhdudlaşmır:</p>
        <ul className="list-disc pl-5 mb-6 space-y-3">
          <li>Silah, sursat, partlayıcı maddələr.</li>
          <li>Dərman preparatları və qeydiyyatsız tibbi vasitələr.</li>
          <li>Narkotik və psixotrop maddələr.</li>
          <li>Oğurlanmış, pirat və ya saxta məhsullar.</li>
          <li>Şəxsi toxunulmazlığı pozan gizli kameralar və dinləmə qurğuları.</li>
        </ul>
      </div>
    </div>
  );
}
