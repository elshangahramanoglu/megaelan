import { 
  Home, 
  Car, 
  Tv, 
  Settings, 
  Building2, 
  Briefcase, 
  Shirt, 
  Palette, 
  WashingMachine, 
  Smartphone, 
  Baby, 
  UserPlus, 
  Dog, 
  Backpack, 
  Store
} from "lucide-react";
import React from "react";

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  image: string; // fallback or icon name
  subcategories: string[];
}

export const categoriesData: Category[] = [
  {
    id: "1",
    name: "Ev və bağ üçün",
    icon: Home,
    image: "home",
    subcategories: ["Mebel", "Ev əşyaları", "Təmir və tikinti", "Qab-qacaq və mətbəx əşyaları", "Bitkilər", "Bağ və bostan"]
  },
  {
    id: "2",
    name: "Nəqliyyat",
    icon: Car,
    image: "car",
    subcategories: ["Avtomobillər", "Avtobuslar və xüsusi texnika", "Motosikletlər və mopedlər", "Velosipedlər", "Su nəqliyyatı"]
  },
  {
    id: "3",
    name: "Elektronika",
    icon: Tv,
    image: "tv",
    subcategories: ["Audio və video", "Kompüter aksesuarları", "Kompüterlər və noutbuklar", "Oyunlar, pultlar və proqramlar", "Planşetlər və elektron kitablar"]
  },
  {
    id: "4",
    name: "Ehtiyat hissələri və aksesuarlar",
    icon: Settings,
    image: "settings",
    subcategories: ["Avto ehtiyat hissələri", "Avto aksesuarlar", "Moto ehtiyat hissələri", "Şinlər və disklər", "GPS və naviqatorlar"]
  },
  {
    id: "5",
    name: "Daşınmaz əmlak",
    icon: Building2,
    image: "building",
    subcategories: ["Mənzillər", "Villalar və bağ evləri", "Obyektlər və ofislər", "Torpaq", "Qarajlar"]
  },
  {
    id: "6",
    name: "Xidmətlər və biznes",
    icon: Briefcase,
    image: "briefcase",
    subcategories: ["Təmir və tikinti xidmətləri", "Gözəllik və sağlamlıq", "Nəqliyyat və logistika", "Təlim və repetitorlar", "IT və internet"]
  },
  {
    id: "7",
    name: "Şəxsi əşyalar",
    icon: Shirt,
    image: "shirt",
    subcategories: ["Geyim", "Ayaqqabılar", "Aksesuarlar", "Saatlar", "Zərgərlik və bijuteriya"]
  },
  {
    id: "8",
    name: "Hobbi və asudə",
    icon: Palette,
    image: "palette",
    subcategories: ["İdman və əyləncə", "Musiqi alətləri", "Biletlər və səyahət", "Kitablar və jurnallar", "Kolleksiya"]
  },
  {
    id: "9",
    name: "Məişət texnikası",
    icon: WashingMachine,
    image: "washing-machine",
    subcategories: ["Soyuducular", "Paltaryuyan maşınlar", "Kondisionerlər", "Sobalar və mikrodalğalı sobalar", "Xırda məişət texnikası"]
  },
  {
    id: "10",
    name: "Telefonlar",
    icon: Smartphone,
    image: "smartphone",
    subcategories: ["Mobil telefonlar", "Smartfonlar", "Nömrələr", "Telefon aksesuarları", "Telefon təmiri"]
  },
  {
    id: "11",
    name: "Uşaq aləmi",
    icon: Baby,
    image: "baby",
    subcategories: ["Uşaq geyimləri", "Oyuncaqlar", "Mebel və uşaq arabaları", "Məktəb ləvazimatları", "Uşaq qidası"]
  },
  {
    id: "12",
    name: "İş elanları",
    icon: UserPlus,
    image: "user-plus",
    subcategories: ["Vakansiyalar", "CV-lər", "Təcrübə proqramları", "Freelance", "Müvəqqəti işlər"]
  },
  {
    id: "13",
    name: "Heyvanlar",
    icon: Dog,
    image: "dog",
    subcategories: ["İtlər", "Pişiklər", "Quşlar", "Akvarium və balıqlar", "Heyvanlar üçün məhsullar"]
  },
  {
    id: "14",
    name: "Məktəblilər üçün",
    icon: Backpack,
    image: "backpack",
    subcategories: ["Məktəb formaları", "Dərsliklər", "Dəftərxana ləvazimatları", "Çantalar", "Tədris kursları"]
  },
  {
    id: "15",
    name: "Mağazalar",
    icon: Store,
    image: "store",
    subcategories: ["Geyim mağazaları", "Texnika mağazaları", "Mebel mağazaları", "Avtosalonlar", "Digər mağazalar"]
  }
];
