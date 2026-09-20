import React from "react";

export default function IstifadePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-black text-black mb-8">İstifadəçi Razılaşması</h1>
      
      <div className="prose prose-blue max-w-none text-black font-medium leading-relaxed">
        <p className="mb-8 text-lg text-gray-700">Bu İstifadəçi Razılaşması (bundan sonra "Razılaşma") MegaElan platforması (bundan sonra "Platforma") və istifadəçi arasında hüquqi müqaviləni təmsil edir.</p>
        
        <h2 className="text-2xl font-black text-blue-600 mt-10 mb-4 border-b-2 border-blue-100 pb-2">1. Ümumi Şərtlər</h2>
        <ul className="list-disc pl-5 mb-6 space-y-3">
          <li>Platformadan istifadə edərək siz bu Razılaşmanın şərtlərini oxuduğunuzu və qəbul etdiyinizi təsdiqləyirsiniz.</li>
          <li>Platforma alıcı və satıcı arasında vasitəçi rolunu oynayır, tərəflər arasında baş verən hər hansı alqı-satqı prosesinə görə birbaşa məsuliyyət daşımır.</li>
          <li>İstifadəçilər saytda yayımladıqları elanların məzmununa və həqiqiliyinə görə tam maddi və mənəvi məsuliyyət daşıyırlar.</li>
        </ul>

        <h2 className="text-2xl font-black text-blue-600 mt-10 mb-4 border-b-2 border-blue-100 pb-2">2. Ödənişli Xidmətlər (Tariflər)</h2>
        <ul className="list-disc pl-5 mb-6 space-y-3">
          <li>Platformada ayda 3 pulsuz elan yerləşdirmək hüququnuz var. Bu limit keçildikdən sonra elan yerləşdirmək üçün platformanın təyin etdiyi ödəniş edilməlidir.</li>
          <li>Premium və İrəli Çək xidmətləri istifadəçinin öz istəyi ilə aktivləşdirilir. Bu xidmətlər elanın müddətini deyil, sadəcə görünürlüyünü artırır.</li>
          <li>Xidmət aktivləşdirildikdən sonra (elan dərc olunduqdan sonra) edilən ödənişlər geri qaytarılmır.</li>
        </ul>

        <h2 className="text-2xl font-black text-blue-600 mt-10 mb-4 border-b-2 border-blue-100 pb-2">3. Hüquq və Vəzifələr</h2>
        <ul className="list-disc pl-5 mb-6 space-y-3">
          <li>MegaElan rəhbərliyi qaydalara uyğun olmayan, şübhəli və ya qanunsuz elanları əvvəlcədən xəbərdarlıq etmədən silmək hüququna malikdir.</li>
          <li>İstifadəçi sayta daxil etdiyi məlumatların doğruluğuna cavabdehdir və hesabının təhlükəsizliyini qorumalıdır.</li>
        </ul>
      </div>
    </div>
  );
}
