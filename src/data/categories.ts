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
  dependsOn?: string;
  dynamicOptions?: Record<string, string[]>;
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
    id: "1", name: "Ev", icon: Home, image: "/ev.png",
    subcategories: ["Mebel", "Ev əşyaları", "Təmir və tikinti", "Qab-qacaq və mətbəx əşyaları", "Bitkilər", "Bağ və bostan"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "2", name: "Nəqliyyat", icon: Car, image: "/neqliyyat.png",
    subcategories: ["Avtomobillər", "Avtobuslar və xüsusi texnika", "Motosikletlər və mopedlər", "Velosipedlər", "Su nəqliyyatı"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Toyota", "Mercedes", "BMW", "Hyundai", "Kia", "LADA (VAZ)", "Nissan", "Chevrolet", "Ford", "Honda", "Lexus", "Mitsubishi", "Opel", "Volkswagen"] },
      { 
        name: "model", 
        label: "Model", 
        type: "select", 
        dependsOn: "brand",
        dynamicOptions: {
          "Toyota": ["Camry", "Corolla", "Land Cruiser", "Prado", "RAV4", "Prius", "Yaris", "Highlander", "Digər"],
          "Mercedes": ["C-Class", "E-Class", "S-Class", "G-Class", "GLE", "GLC", "V-Class", "Digər"],
          "BMW": ["3 Series", "5 Series", "7 Series", "X5", "X6", "X7", "M5", "Digər"],
          "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent", "Creta", "Digər"],
          "Kia": ["Rio", "Optima", "Sportage", "Sorento", "Cerato", "K5", "Digər"],
          "LADA (VAZ)": ["Niva", "Priora", "Granta", "Vesta", "2107", "2106", "Digər"],
          "Nissan": ["Sunny", "Altima", "X-Trail", "Patrol", "Kicks", "Tiida", "Digər"],
          "Chevrolet": ["Cruze", "Malibu", "Camaro", "Tahoe", "Equinox", "Aveo", "Digər"],
          "Ford": ["Focus", "Mustang", "Explorer", "Fusion", "Fiesta", "Transit", "Digər"],
          "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Digər"],
          "Lexus": ["RX", "LX", "NX", "ES", "IS", "GX", "Digər"],
          "Mitsubishi": ["Pajero", "Lancer", "Outlander", "L200", "ASX", "Digər"],
          "Opel": ["Astra", "Corsa", "Insignia", "Vectra", "Zafira", "Digər"],
          "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Jetta", "Polo", "Digər"]
        }
      },
      YEAR_FIELD,
      { name: "engine", label: "Mühərrikin həcmi", type: "select", options: ["1.0", "1.2", "1.4", "1.5", "1.6", "1.8", "2.0", "2.2", "2.4", "2.5", "3.0", "3.5", "4.0", "4.4", "5.0", "Elektrik"] },
      { name: "mileage", label: "Yürüş", type: "number", unit: "km" },
      COLOR_FIELD
    ]
  },
  {
    id: "3", name: "Elektronika", icon: Tv, image: "/elektronika.png",
    subcategories: ["Audio və video", "Kompüter aksesuarları", "Kompüterlər və noutbuklar", "Oyunlar, pultlar və proqramlar", "Planşetlər və elektron kitablar"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Apple", "Samsung", "Asus", "Acer", "HP", "Lenovo", "Dell", "Sony", "LG"] },
      { name: "ram", label: "RAM", type: "select", options: ["2 GB", "4 GB", "8 GB", "16 GB", "32 GB", "64 GB"] },
      { name: "storage", label: "Yaddaş", type: "select", options: ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"] },
      CONDITION_FIELD
    ]
  },
  {
    id: "4", name: "Ehtiyat hissələri və aksesuarlar", icon: Settings, image: "/ehtiyat.png",
    subcategories: ["Avto ehtiyat hissələri", "Avto aksesuarlar", "Moto ehtiyat hissələri", "Şinlər və disklər", "GPS və naviqatorlar"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "5", name: "Daşınmaz əmlak", icon: Building2, image: "/dasinmaz.png",
    subcategories: ["Mənzillər", "Villalar və bağ evləri", "Obyektlər və ofislər", "Torpaq", "Qarajlar"],
    fields: [
      { name: "type", label: "Növü", type: "select", options: ["Köhnə tikili", "Yeni tikili"] },
      { name: "rooms", label: "Otaq sayı", type: "select", options: ["1", "2", "3", "4", "5", "6+"] },
      { name: "area", label: "Sahəsi", type: "number", unit: "m²" },
      { name: "floor", label: "Mərtəbə", type: "text", placeholder: "Məs: 5/16" }
    ]
  },
              {
    id: "12", name: "İş elanları", icon: UserPlus, image: "/ish.png",
    subcategories: ["Vakansiyalar", "CV-lər", "Təcrübə proqramları", "Freelance", "Müvəqqəti işlər"],
    fields: [
      { name: "experience", label: "Təcrübə", type: "select", options: ["Təcrübəsiz", "1 ildən aşağı", "1 ildən 3 ilə qədər", "3 ildən 5 ilə qədər", "5 ildən çox"] },
      { name: "schedule", label: "İş qrafiki", type: "select", options: ["Tam iş günü", "Yarım iş günü", "Sərbəst qrafik", "Məsafədən iş"] }
    ]
  },
  {
    id: "13", name: "Heyvanlar", icon: Dog, image: "/heyvanlar.png",
    subcategories: ["İtlər", "Pişiklər", "Quşlar", "Akvarium və balıqlar", "Heyvanlar üçün məhsullar"],
    fields: []
  },
  {
    id: "14", name: "Məktəblilər üçün", icon: Backpack, image: "/mektebli.png",
    subcategories: ["Məktəb formaları", "Dərsliklər", "Dəftərxana ləvazimatları", "Çantalar", "Tədris kursları"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "15", name: "Mağazalar", icon: Store, image: "/magazalar.png",
    subcategories: ["Geyim mağazaları", "Texnika mağazaları", "Mebel mağazaları", "Avtosalonlar", "Digər mağazalar"],
    fields: []
  }
];
