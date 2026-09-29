import {
  Car,
  Home,
  Tv,
  Dog,
  Settings,
  Building2,
  UserPlus,
  Backpack,
  Store,
  Shirt,
  Heart,
  Baby,
  Briefcase,
  Wrench,
  Grid
} from "lucide-react";

export interface CategoryField {
  name: string;
  label: string;
  type: "select" | "text" | "number";
  options?: string[];
  dependsOn?: string;
  dynamicOptions?: Record<string, string[]>;
  unit?: string;
  placeholder?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  icon: any;
  image: string;
  subcategories: string[];
  fields: CategoryField[];
}

export const categoriesData: CategoryData[] = [
  {
    id: "1", name: "Ev və bağ üçün", icon: Home, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Təmir və tikinti", "Mebellər", "Məişət texnikası", "Qab-qacaq və mətbəx ləvazimatları", "Bitkilər", "Xalçalar və aksesuarlar", "Ev tekstili", "İşıqlandırma", "Dekor və interyer", "Bağ və bostan", "Ev təsərrüfatı malları", "Örtaq", "Digər"],
    fields: []
  },
  {
    id: "2", name: "Nəqliyyat", icon: Car, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Avtomobillər", "Avtobuslar və xüsusi texnika", "Motosikletlər və mopedlər", "Velosipedlər", "Su nəqliyyatı", "Avto xidmətlər və təmir", "Qarajlar və dayanacaqlar"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Toyota", "Mercedes-Benz", "BMW", "Hyundai", "Kia", "LADA (VAZ)", "Nissan", "Chevrolet", "Ford", "Honda", "Lexus", "Mitsubishi", "Opel", "Volkswagen", "Audi", "Land Rover", "Porsche", "Mazda", "Subaru", "Peugeot", "Renault", "Skoda", "Volvo", "Infiniti", "Suzuki", "Daewoo", "UAZ", "GAZ", "BYD", "Chery", "Geely", "Haval", "Jeep", "Tesla", "Dodge", "Cadillac", "Jaguar", "MINI", "Seat", "Citroen", "Fiat", "Dacia", "SsangYong", "Digər"] },
      { name: "model", label: "Model", type: "text", dependsOn: "brand" },
      { name: "year", label: "Buraxılış ili", type: "select", options: Array.from({length: 45}, (_, i) => String(2024 - i)) },
      { name: "fuel", label: "Yanacaq növü", type: "select", options: ["Benzin", "Dizel", "Qaz", "Hibrid", "Plug-in Hibrid", "Elektrik", "Benzin+Qaz (LPG)", "Benzin+Metan (CNG)"] },
      { name: "transmission", label: "Sürətlər qutusu", type: "select", options: ["Mexaniki", "Avtomat", "Robotlaşdırılmış", "Variator (CVT)"] },
      { name: "bodyType", label: "Ban növü", type: "select", options: ["Sedan", "Hetçbek", "Universal", "Kupe", "Kabriolet", "Minivan", "SUV/Offroad", "Pikap", "Mikroavtobus", "Furqon", "Liftbek", "Rodster"] },
      { name: "engine", label: "Mühərrikin həcmi", type: "select", options: ["0.8", "1.0", "1.2", "1.3", "1.4", "1.5", "1.6", "1.8", "2.0", "2.2", "2.3", "2.4", "2.5", "2.7", "2.8", "3.0", "3.2", "3.3", "3.5", "3.6", "3.8", "4.0", "4.2", "4.4", "4.6", "4.7", "5.0", "5.5", "5.7", "6.0", "6.2", "6.7", "Elektrik"] },
      { name: "mileage", label: "Yürüş", type: "number", unit: "km" },
      { name: "condition", label: "Vəziyyəti", type: "select", options: ["Yeni", "İşlənmiş", "Vuruqlu"] },
      { name: "color", label: "Rəng", type: "select", options: ["Qara", "Ağ", "Gümüşü", "Göy", "Qırmızı", "Boz", "Yaşıl", "Sarı", "Narıncı", "Bənövşəyi", "Qızılı", "Çəhrayı", "Qəhvəyi", "Digər"] }
    ]
  },
  {
    id: "3", name: "Elektronika", icon: Tv, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Audio və video", "Kompüter aksesuarları", "Oyunlar, pultlar və proqramlar", "Stolüstü kompüterlər", "Komponentlər və monitorlar", "Planşet və elektron kitablar", "Noutbuklar və netbuklar", "Ofis avadanlığı və istehlak materialları", "Telefonlar", "Fototexnika", "Nömrələr və SIM-kartlar", "Smart saat və qolbaqlar", "Şəbəkə və server avadanlığı", "Digər"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Apple", "Samsung", "Xiaomi", "Honor", "Realme", "Huawei", "OnePlus", "Google", "Nothing", "Nokia", "Tecno", "Infinix", "Asus", "Acer", "HP", "Lenovo", "Dell", "MSI", "Sony", "LG", "Microsoft", "Digər"] },
      { name: "model", label: "Model", type: "text", dependsOn: "brand" },
      { name: "storage", label: "Yaddaş", type: "select", options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "2 TB", "4 TB"] },
      { name: "ram", label: "RAM", type: "select", options: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "18 GB", "24 GB", "32 GB", "64 GB", "128 GB"] },
      { name: "condition", label: "Vəziyyəti", type: "select", options: ["Yeni", "İşlənmiş", "Təmirli"] },
      { name: "color", label: "Rəng", type: "select", options: ["Qara", "Ağ", "Gümüşü", "Qızılı", "Göy", "Qırmızı", "Digər"] }
    ]
  },
  {
    id: "4", name: "Ehtiyat hissələri və aksesuarlar", icon: Settings, image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Avto ehtiyat hissələri", "Avto aksesuarlar", "Audio və video texnika", "Avtokosmetika və kimya", "Avtomobil üçün alətlər", "GPS naviqatorlar", "Şinlər, disklər və təkərlər", "Videoreqistratorlar", "Moto ehtiyat hissələri və aksesuarlar", "Digər"],
    fields: []
  },
  {
    id: "5", name: "Daşınmaz əmlak", icon: Building2, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Mənzillər", "Villalar, bağ evləri", "Obyektlər və ofislər", "Torpaq", "Qarajlar", "Xaricdə əmlak", "Yataqxanalar"],
    fields: [
      { name: "dealType", label: "Əməliyyat növü", type: "select", options: ["Satılır", "Kirayə verilir", "Günlük kirayə"] },
      { name: "type", label: "Əmlak növü", type: "select", options: ["Köhnə tikili", "Yeni tikili"] },
      { name: "rooms", label: "Otaq sayı", type: "select", options: ["1", "2", "3", "4", "5", "6+"] },
      { name: "area", label: "Sahəsi", type: "number", unit: "m²" },
      { name: "floor", label: "Mərtəbə", type: "text", placeholder: "Məs: 5/16" },
      { name: "repair", label: "Təmir", type: "select", options: ["Təmirsiz", "Orta təmir", "Əla təmir", "Təmirli"] }
    ]
  },
  {
    id: "12", name: "İş elanları", icon: UserPlus, image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Vakansiyalar", "İş axtaranlar", "İnzibati heyət", "Satış", "Dizayn", "İnsan resursları (HR)", "İnformasiya texnologiyaları", "Mühasibat və maliyyə", "Marketinq, reklam, PR", "Nəqliyyat və loqistika", "Təhsil və elm", "Tibb və əczaçılıq", "Turizm və mehmanxana", "Digər"],
    fields: [
      { name: "experience", label: "Təcrübə", type: "select", options: ["Təcrübəsiz", "1 ildən az", "1-3 il", "3-5 il", "5+ il"] },
      { name: "schedule", label: "İş qrafiki", type: "select", options: ["Tam iş günü", "Yarım iş günü", "Sərbəst qrafik", "Məsafədən iş", "Növbəli"] },
      { name: "education", label: "Təhsil", type: "select", options: ["Ali", "Natamam ali", "Orta xüsusi", "Orta"] }
    ]
  },
  {
    id: "13", name: "Heyvanlar", icon: Dog, image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500&auto=format&fit=crop",
    subcategories: ["İtlər", "Pişiklər", "Quşlar", "Akvarium və balıqlar", "Heyvanlar üçün məhsullar və yemlər", "Kənd təsərrüfatı heyvanları", "Sürünənlər", "Gəmiricilər", "Digər heyvanlar"],
    fields: []
  },
  {
    id: "14", name: "Məktəblilər üçün", icon: Backpack, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Məktəbli geyimləri", "Məktəbli çantaları", "Dəftərxana ləvazimatları", "Dərsliklər", "Digər məktəb ləvazimatları"],
    fields: []
  },
  {
    id: "15", name: "Mağazalar", icon: Store, image: "/magazalar.png",
    subcategories: ["Geyim mağazaları", "Texnika mağazaları", "Mebel mağazaları", "Avtosalonlar", "Ərzaq mağazaları", "Parfümeriya", "İdman mağazaları", "Digər mağazalar"],
    fields: []
  },
  {
    id: "16", name: "Geyim və ayaqqabılar", icon: Shirt, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Qadın geyimləri", "Kişi geyimləri", "Uşaq geyimləri", "Ayaqqabılar", "Çantalar", "Aksesuarlar", "Zərgərlik məmulatları", "Saatlar"],
    fields: []
  },
  {
    id: "17", name: "Gözəllik və sağlamlıq", icon: Heart, image: "https://images.unsplash.com/photo-1498842812179-c81beecf902c?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Ətriyyat", "Kosmetika", "Saça qulluq", "Bədənə qulluq", "Tibbi məhsullar", "Avadanlıqlar və alətlər"],
    fields: []
  },
  {
    id: "18", name: "Uşaq aləmi", icon: Baby, image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Uşaq arabaları", "Uşaq mebeli", "Oyuncaqlar", "Uşaq avtooturacaqları", "Qidalanma", "Manejlər və xodunoklar", "Digər uşaq malları"],
    fields: []
  },
  {
    id: "19", name: "Hobbi və asudə", icon: Grid, image: "https://images.unsplash.com/photo-1511871893393-82e9c16b81e3?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Biletlər", "İdman və istirahət", "Kolleksiya", "Musiqi alətləri", "Kitab və jurnallar", "Ovçuluq və balıqçılıq", "Tapıntılar"],
    fields: []
  },
  {
    id: "20", name: "Biznes və avadanlıq", icon: Briefcase, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Hazır biznes", "Ticarət avadanlığı", "Sənaye avadanlığı", "Tibbi avadanlıq", "Gözəllik salonu avadanlığı", "Restoran avadanlığı", "Kənd təsərrüfatı avadanlığı"],
    fields: []
  },
  {
    id: "21", name: "Xidmətlər", icon: Wrench, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500&auto=format&fit=crop",
    subcategories: ["Tikinti və təmir xidmətləri", "Təmizlik", "Nəqliyyat və logistika", "Gözəllik xidmətləri", "Tədbirlər və əyləncə", "IT xidmətləri", "Tərcümə və mətnlər", "Təhsil", "Usta xidmətləri"],
    fields: []
  }
];
