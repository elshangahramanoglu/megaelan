import React from "react";
import Link from "next/link";
import { ShieldCheck, Zap, Users } from "lucide-react";

export default function HaqqimizdaPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-black mb-6">Biz Kimik?</h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
          <strong className="text-blue-600">MegaElan</strong> — Azərbaycanda ən müasir, rahat və təhlükəsiz alqı-satqı platformasıdır. Bizim məqsədimiz hər kəsin axtardığını ən qısa zamanda tapması və ya satmaq istədiyi məhsulu asanlıqla minlərlə alıcıya çatdırmasıdır.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-blue-50 p-8 rounded-3xl text-center border border-blue-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-black text-black mb-4">Sürətli və Rahat</h3>
          <p className="text-gray-600 font-medium leading-relaxed">
            Mükəmməl dizayn və filtrləmə sistemi sayəsində istənilən məhsulu saniyələr içində tapın.
          </p>
        </div>

        <div className="bg-green-50 p-8 rounded-3xl text-center border border-green-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-black text-black mb-4">Təhlükəsizlik</h3>
          <p className="text-gray-600 font-medium leading-relaxed">
            Platformamızda yerləşdirilən bütün elanlar yoxlanılır. Spam və fırıldaqçılığa qarşı ciddi tədbirlər görürük.
          </p>
        </div>

        <div className="bg-orange-50 p-8 rounded-3xl text-center border border-orange-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Users className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-black text-black mb-4">Geniş Auditoriya</h3>
          <p className="text-gray-600 font-medium leading-relaxed">
            Elanınız eyni anda minlərlə potensial alıcıya göstərilir. Premium və İrəli Çək xidmətləri ilə satışlarınızı qat-qat artırın.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-200">
        <h2 className="text-3xl font-black text-black mb-6">Məqsədimiz və Dəyərlərimiz</h2>
        <div className="prose prose-blue max-w-none text-black font-medium leading-relaxed space-y-4 text-lg">
          <p>
            Biz inanırıq ki, hər bir əşyanın ikinci bir şansı var. İstər yeni alınmış bir telefon, istərsə də istifadə olunmuş avtomobil — hər bir məhsulun öz alıcısı mövcuddur. Biz sadəcə onları <strong>MegaElan</strong> vasitəsilə bir araya gətiririk.
          </p>
          <p>
            Platformamız daim inkişaf etdirilir. Sizin rahatlığınız üçün ən son texnologiyalardan istifadə edərək mobil telefonda və kompüterdə qüsursuz işləyən bir sistem yaratmışıq. İndi həm bizneslər, həm də fərdi şəxslər üçün xüsusi xidmətlər (Mağazalar bölməsi, İş elanları, Xidmətlər və s.) təklif edirik.
          </p>
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap gap-4 items-center">
            <Link href="/yeni-elan" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              İlk Elanınızı Yerləşdirin
            </Link>
            <Link href="/elaqe" className="bg-white hover:bg-gray-100 text-black border border-gray-200 font-bold py-3 px-8 rounded-xl transition-colors">
              Bizimlə Əlaqə
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
