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

export type FieldType = "select" | "number" | "text";

export interface CategoryField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  unit?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  image: string;
  subcategories: string[];
  fields: CategoryField[];
}

// Reusable fields
const YEAR_FIELD: CategoryField = {
  name: "year", label: "Buraxılış ili", type: "select",
  options: Array.from({ length: 40 }, (_, i) => (2025 - i).toString())
};
const CONDITION_FIELD: CategoryField = {
  name: "condition", label: "Vəziyyəti", type: "select",
  options: ["Yeni", "İşlənmiş"]
};
const COLOR_FIELD: CategoryField = {
  name: "color", label: "Rəng", type: "select",
  options: ["Qara", "Ağ", "Gümüşü", "Qırmızı", "Mavi", "Göy", "Boz", "Sarı", "Yaşıl"]
};

export const categoriesData: Category[] = [
  {
    id: "1", name: "Ev və bağ üçün", icon: Home, image: "home",
    subcategories: ["Mebel", "Ev əşyaları", "Təmir və tikinti", "Qab-qacaq və mətbəx əşyaları", "Bitkilər", "Bağ və bostan"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "2", name: "Nəqliyyat", icon: Car, image: "car",
    subcategories: ["Avtomobillər", "Avtobuslar və xüsusi texnika", "Motosikletlər və mopedlər", "Velosipedlər", "Su nəqliyyatı"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Toyota", "Mercedes", "BMW", "Hyundai", "Kia", "LADA (VAZ)", "Nissan", "Chevrolet", "Ford", "Honda", "Lexus", "Mitsubishi", "Opel", "Volkswagen"] },
      { name: "model", label: "Model", type: "text", placeholder: "Məs: Corolla, C-Class, Rio" },
      YEAR_FIELD,
      { name: "engine", label: "Mühərrikin həcmi", type: "select", options: ["1.0", "1.2", "1.4", "1.5", "1.6", "1.8", "2.0", "2.2", "2.4", "2.5", "3.0", "3.5", "4.0", "4.4", "5.0", "Elektrik"] },
      { name: "mileage", label: "Yürüş", type: "number", unit: "km" },
      COLOR_FIELD
    ]
  },
  {
    id: "3", name: "Elektronika", icon: Tv, image: "tv",
    subcategories: ["Audio və video", "Kompüter aksesuarları", "Kompüterlər və noutbuklar", "Oyunlar, pultlar və proqramlar", "Planşetlər və elektron kitablar"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Apple", "Samsung", "Asus", "Acer", "HP", "Lenovo", "Dell", "Sony", "LG"] },
      { name: "ram", label: "RAM", type: "select", options: ["2 GB", "4 GB", "8 GB", "16 GB", "32 GB", "64 GB"] },
      { name: "storage", label: "Yaddaş", type: "select", options: ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"] },
      CONDITION_FIELD
    ]
  },
  {
    id: "4", name: "Ehtiyat hissələri və aksesuarlar", icon: Settings, image: "settings",
    subcategories: ["Avto ehtiyat hissələri", "Avto aksesuarlar", "Moto ehtiyat hissələri", "Şinlər və disklər", "GPS və naviqatorlar"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "5", name: "Daşınmaz əmlak", icon: Building2, image: "building",
    subcategories: ["Mənzillər", "Villalar və bağ evləri", "Obyektlər və ofislər", "Torpaq", "Qarajlar"],
    fields: [
      { name: "type", label: "Növü", type: "select", options: ["Köhnə tikili", "Yeni tikili"] },
      { name: "rooms", label: "Otaq sayı", type: "select", options: ["1", "2", "3", "4", "5", "6+"] },
      { name: "area", label: "Sahəsi", type: "number", unit: "m²" },
      { name: "floor", label: "Mərtəbə", type: "text", placeholder: "Məs: 5/16" }
    ]
  },
  {
    id: "6", name: "Xidmətlər və biznes", icon: Briefcase, image: "briefcase",
    subcategories: ["Təmir və tikinti xidmətləri", "Gözəllik və sağlamlıq", "Nəqliyyat və logistika", "Təlim və repetitorlar", "IT və internet"],
    fields: []
  },
  {
    id: "7", name: "Şəxsi əşyalar", icon: Shirt, image: "shirt",
    subcategories: ["Geyim", "Ayaqqabılar", "Aksesuarlar", "Saatlar", "Zərgərlik və bijuteriya"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "8", name: "Hobbi və asudə", icon: Palette, image: "palette",
    subcategories: ["İdman və əyləncə", "Musiqi alətləri", "Biletlər və səyahət", "Kitablar və jurnallar", "Kolleksiya"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "9", name: "Məişət texnikası", icon: WashingMachine, image: "washing-machine",
    subcategories: ["Soyuducular", "Paltaryuyan maşınlar", "Kondisionerlər", "Sobalar və mikrodalğalı sobalar", "Xırda məişət texnikası"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Beko", "Bosch", "Samsung", "LG", "Gorenje", "Hoffmann"] },
      CONDITION_FIELD
    ]
  },
  {
    id: "10", name: "Telefonlar", icon: Smartphone, image: "smartphone",
    subcategories: ["Mobil telefonlar", "Smartfonlar", "Nömrələr", "Telefon aksesuarları", "Telefon təmiri"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Apple", "Samsung", "Xiaomi", "Honor", "Realme", "Huawei", "OnePlus", "Google", "Nokia"] },
      { name: "model", label: "Model", type: "text", placeholder: "Məs: iPhone 15 Pro, Galaxy S24" },
      { name: "storage", label: "Yaddaş", type: "select", options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB"] },
      { name: "ram", label: "RAM", type: "select", options: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB"] },
      COLOR_FIELD,
      CONDITION_FIELD
    ]
  },
  {
    id: "11", name: "Uşaq aləmi", icon: Baby, image: "baby",
    subcategories: ["Uşaq geyimləri", "Oyuncaqlar", "Mebel və uşaq arabaları", "Məktəb ləvazimatları", "Uşaq qidası"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "12", name: "İş elanları", icon: UserPlus, image: "user-plus",
    subcategories: ["Vakansiyalar", "CV-lər", "Təcrübə proqramları", "Freelance", "Müvəqqəti işlər"],
    fields: [
      { name: "experience", label: "Təcrübə", type: "select", options: ["Təcrübəsiz", "1 ildən aşağı", "1 ildən 3 ilə qədər", "3 ildən 5 ilə qədər", "5 ildən çox"] },
      { name: "schedule", label: "İş qrafiki", type: "select", options: ["Tam iş günü", "Yarım iş günü", "Sərbəst qrafik", "Məsafədən iş"] }
    ]
  },
  {
    id: "13", name: "Heyvanlar", icon: Dog, image: "dog",
    subcategories: ["İtlər", "Pişiklər", "Quşlar", "Akvarium və balıqlar", "Heyvanlar üçün məhsullar"],
    fields: []
  },
  {
    id: "14", name: "Məktəblilər üçün", icon: Backpack, image: "backpack",
    subcategories: ["Məktəb formaları", "Dərsliklər", "Dəftərxana ləvazimatları", "Çantalar", "Tədris kursları"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "15", name: "Mağazalar", icon: Store, image: "store",
    subcategories: ["Geyim mağazaları", "Texnika mağazaları", "Mebel mağazaları", "Avtosalonlar", "Digər mağazalar"],
    fields: []
  }
];
