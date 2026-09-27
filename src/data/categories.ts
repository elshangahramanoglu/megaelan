import { 
  Home, 
  Car, 
  Tv, 
  Settings, 
  Building2, 
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
  options: Array.from({ length: 45 }, (_, i) => (2026 - i).toString())
};
const CONDITION_FIELD: CategoryField = {
  name: "condition", label: "Vəziyyəti", type: "select",
  options: ["Yeni", "İşlənmiş"]
};

// Avtomobil rəngləri (gerçək avtomobil rəngləri)
const CAR_COLOR_FIELD: CategoryField = {
  name: "color", label: "Rəng", type: "select",
  options: ["Qara", "Ağ", "Gümüşü", "Boz", "Tünd boz", "Göy (Mavi)", "Tünd göy", "Qırmızı", "Tünd qırmızı (Bordo)", "Yaşıl", "Tünd yaşıl", "Sarı", "Narıncı", "Qəhvəyi", "Bej", "Şampan", "Qızılı", "Sedef ağ"]
};

// Telefon rəngləri (istehsalçıların istifadə etdiyi real rənglər)
const PHONE_COLOR_FIELD: CategoryField = {
  name: "color", label: "Rəng", type: "select",
  options: ["Qara", "Ağ", "Titan Qara", "Titan Ağ", "Təbii Titan", "Çöl Titan", "Mavi Titan", "Göy", "Mavi", "Bənövşəyi", "Yaşıl", "Tünd yaşıl", "Qırmızı", "Çəhrayı", "Sarı", "Narıncı", "Gümüşü", "Qızılı", "Bej", "Lavanda", "Koral", "Boz", "Gecə (Midnight)"]
};

export const categoriesData: Category[] = [
  {
    id: "1", name: "Ev", icon: Home, image: "/ev.png",
    subcategories: ["Mebel", "Ev tekstili", "Qab-qacaq və mətbəx", "Bitkilər", "Bağ və bostan", "Təmir və tikinti", "İşıqlandırma", "Dekorasiya", "Ev əşyaları"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "2", name: "Nəqliyyat", icon: Car, image: "/neqliyyat.png",
    subcategories: ["Avtomobillər", "Avtobuslar və xüsusi texnika", "Motosikletlər və mopedlər", "Velosipedlər", "Su nəqliyyatı"],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Toyota", "Mercedes-Benz", "BMW", "Hyundai", "Kia", "LADA (VAZ)", "Nissan", "Chevrolet", "Ford", "Honda", "Lexus", "Mitsubishi", "Opel", "Volkswagen", "Audi", "Land Rover", "Porsche", "Mazda", "Subaru", "Peugeot", "Renault", "Skoda", "Volvo", "Infiniti", "Suzuki", "Daewoo", "UAZ", "GAZ", "BYD", "Chery", "Geely", "Haval", "Jeep", "Tesla", "Dodge", "Cadillac", "Jaguar", "MINI", "Seat", "Citroen", "Fiat", "Dacia", "SsangYong", "Digər"] },
      { 
        name: "model", 
        label: "Model", 
        type: "select", 
        dependsOn: "brand",
        dynamicOptions: {
          "Toyota": ["Camry", "Corolla", "Land Cruiser", "Land Cruiser Prado", "RAV4", "C-HR", "Highlander", "Yaris", "Yaris Cross", "Prius", "Fortuner", "Hilux", "Avalon", "Crown", "bZ4X", "Sequoia", "Tundra", "Digər"],
          "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "G-Class", "GLE", "GLC", "GLA", "GLB", "GLS", "A-Class", "CLA", "CLS", "AMG GT", "EQS", "EQE", "EQC", "V-Class", "Sprinter", "Vito", "Digər"],
          "BMW": ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "X7", "M3", "M5", "4 Series", "2 Series", "i4", "iX", "i7", "Z4", "XM", "Digər"],
          "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent", "Creta", "Kona", "i10", "i20", "i30", "Palisade", "Venue", "Staria", "Ioniq 5", "Ioniq 6", "ix35", "Digər"],
          "Kia": ["Rio", "K5 (Optima)", "Sportage", "Sorento", "Cerato (K3)", "Seltos", "Carnival", "Stinger", "Ceed", "Stonic", "Niro", "EV6", "Soul", "Picanto", "Digər"],
          "LADA (VAZ)": ["Niva", "Vesta", "Granta", "Priora", "Kalina", "2107", "2106", "2105", "2104", "2114", "2115", "2110", "2112", "2109", "2108", "2101", "XRAY", "Largus", "Digər"],
          "Nissan": ["Altima", "Sunny", "X-Trail", "Patrol", "Kicks", "Qashqai", "Juke", "Pathfinder", "Tiida", "Note", "Navara", "Maxima", "GT-R", "Ariya", "Murano", "Digər"],
          "Chevrolet": ["Cruze", "Malibu", "Camaro", "Tahoe", "Equinox", "Aveo", "Lacetti", "Spark", "Epica", "Captiva", "Cobalt", "Trailblazer", "Traverse", "Suburban", "Silverado", "Onix", "Digər"],
          "Ford": ["Focus", "Mustang", "Explorer", "Fusion", "Fiesta", "Transit", "Ranger", "Escape", "Kuga", "Puma", "EcoSport", "Mondeo", "Edge", "Bronco", "F-150", "Maverick", "Digər"],
          "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit (Jazz)", "City", "Odyssey", "Vezel", "ZR-V", "Integra", "Digər"],
          "Lexus": ["RX", "LX", "NX", "ES", "IS", "GX", "UX", "LC", "LS", "TX", "RZ", "RC", "GS", "Digər"],
          "Mitsubishi": ["Pajero", "Lancer", "Outlander", "L200", "ASX", "Eclipse Cross", "Pajero Sport", "Colt", "Galant", "Delica", "Digər"],
          "Opel": ["Astra", "Corsa", "Insignia", "Vectra", "Zafira", "Mokka", "Crossland", "Grandland", "Meriva", "Omega", "Digər"],
          "Volkswagen": ["Golf", "Passat", "Tiguan", "Touareg", "Jetta", "Polo", "T-Roc", "T-Cross", "Arteon", "Atlas", "ID.4", "ID.3", "Caddy", "Transporter", "Amarok", "Taos", "Digər"],
          "Audi": ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "RS6", "RS7", "TT", "S3", "S4", "Digər"],
          "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Defender", "Discovery", "Discovery Sport", "Freelander", "Digər"],
          "Porsche": ["Cayenne", "Macan", "Panamera", "911", "Taycan", "Boxster", "Cayman", "Digər"],
          "Mazda": ["3", "6", "CX-5", "CX-30", "CX-9", "CX-60", "MX-5", "Mazda2", "CX-50", "Digər"],
          "Subaru": ["Forester", "Impreza", "Outback", "XV (Crosstrek)", "Legacy", "WRX", "BRZ", "Levorg", "Digər"],
          "Peugeot": ["208", "308", "3008", "5008", "2008", "508", "Partner", "Rifter", "Digər"],
          "Renault": ["Logan", "Sandero", "Duster", "Megane", "Clio", "Captur", "Kangoo", "Symbol", "Fluence", "Arkana", "Koleos", "Digər"],
          "Skoda": ["Octavia", "Rapid", "Superb", "Kodiaq", "Karoq", "Kamiq", "Fabia", "Scala", "Digər"],
          "Volvo": ["XC60", "XC90", "XC40", "S60", "S90", "V60", "V90", "C40", "EX30", "EX90", "Digər"],
          "Infiniti": ["QX50", "QX60", "QX80", "Q50", "Q60", "QX55", "Digər"],
          "Suzuki": ["Vitara", "SX4", "Swift", "Jimny", "Grand Vitara", "Baleno", "Celerio", "Ignis", "Digər"],
          "Daewoo": ["Nexia", "Matiz", "Lanos", "Nubira", "Leganza", "Espero", "Tico", "Gentra", "Digər"],
          "UAZ": ["Patriot", "Hunter", "Buhanka (452)", "Profi", "469", "Pickup", "Digər"],
          "GAZ": ["Gazel", "Volga", "Sobol", "Gazel Next", "Sadko", "Digər"],
          "BYD": ["Tang", "Han", "Song", "Seal", "Atto 3 (Yuan Plus)", "Dolphin", "Qin Plus", "Destroyer 05", "Digər"],
          "Chery": ["Tiggo 7 Pro", "Tiggo 8 Pro", "Tiggo 4 Pro", "Arrizo 8", "Arrizo 5", "Omoda 5", "Jaecoo J7", "Digər"],
          "Geely": ["Coolray", "Atlas", "Monjaro", "Emgrand", "Tugella", "Okavango", "Preface", "Digər"],
          "Haval": ["Jolion", "Dargo", "H6", "H9", "F7", "F7x", "M6", "Digər"],
          "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator", "Digər"],
          "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck", "Digər"]
        }
      },
      YEAR_FIELD,
      { name: "fuel", label: "Yanacaq növü", type: "select", options: ["Benzin", "Dizel", "Qaz", "Hibrid", "Plug-in Hibrid", "Elektrik", "Benzin+Qaz (LPG)", "Benzin+Metan (CNG)"] },
      { name: "transmission", label: "Sürətlər qutusu", type: "select", options: ["Mexaniki", "Avtomat", "Robotlaşdırılmış", "Variator (CVT)"] },
      { name: "bodyType", label: "Ban növü", type: "select", options: ["Sedan", "Hetçbek", "Universal", "Kupe", "Kabriolet", "Minivan", "SUV/Offroad", "Pikap", "Mikroavtobus", "Furqon", "Liftbek", "Rodster"] },
      { name: "engine", label: "Mühərrikin həcmi", type: "select", options: ["0.8", "1.0", "1.2", "1.3", "1.4", "1.5", "1.6", "1.8", "2.0", "2.2", "2.3", "2.4", "2.5", "2.7", "2.8", "3.0", "3.2", "3.3", "3.5", "3.6", "3.8", "4.0", "4.2", "4.4", "4.6", "4.7", "5.0", "5.5", "5.7", "6.0", "6.2", "6.7", "Elektrik"] },
      { name: "mileage", label: "Yürüş", type: "number", unit: "km" },
      CAR_COLOR_FIELD
    ]
  },
  {
    id: "3", name: "Elektronika", icon: Tv, image: "/elektronika.png",
    subcategories: [
      "Telefonlar və Smartfonlar",
      "Nömrələr",
      "Telefon aksesuarları",
      "Planşetlər",
      "Kompüterlər və noutbuklar",
      "Kompüter aksesuarları",
      "Oyun konsolları və aksesuarları",
      "Audio və video",
      "Fotoaparatlar",
      "Smart saatlar və qolbaqlar"
    ],
    fields: [
      { name: "brand", label: "Marka", type: "select", options: ["Apple", "Samsung", "Xiaomi", "Honor", "Realme", "Huawei", "OnePlus", "Google", "Nothing", "Nokia", "Tecno", "Infinix", "Asus", "Acer", "HP", "Lenovo", "Dell", "MSI", "Sony", "LG", "Microsoft", "Digər"] },
      { 
        name: "model", 
        label: "Model", 
        type: "select", 
        dependsOn: "brand",
        dynamicOptions: {
          "Apple": [
            "iPhone 18 Pro Max", "iPhone 18 Pro", "iPhone 18 Air", "iPhone 18",
            "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17 Air", "iPhone 17",
            "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
            "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
            "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
            "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
            "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini",
            "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
            "iPhone SE (2025)", "iPhone SE (2022)", "iPhone SE (2020)",
            "iPad Pro 13\" (M4)", "iPad Pro 11\" (M4)", "iPad Air 13\" (M2)", "iPad Air 11\" (M2)", "iPad 10th Gen", "iPad mini 7", "iPad mini 6",
            "MacBook Air 13\"", "MacBook Air 15\"", "MacBook Pro 14\"", "MacBook Pro 16\"",
            "iMac 24\"", "Mac mini", "Apple Watch Ultra 2", "Apple Watch Series 10", "Apple Watch SE",
            "AirPods Pro 2", "AirPods 4", "AirPods Max",
            "Digər"
          ],
          "Samsung": [
            "Galaxy S26 Ultra", "Galaxy S26+", "Galaxy S26",
            "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S25 FE",
            "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S24 FE",
            "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S23 FE",
            "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
            "Galaxy Z Fold 7", "Galaxy Z Flip 7",
            "Galaxy Z Fold 6", "Galaxy Z Flip 6",
            "Galaxy Z Fold 5", "Galaxy Z Flip 5",
            "Galaxy Z Fold 4", "Galaxy Z Flip 4",
            "Galaxy A56 5G", "Galaxy A55 5G", "Galaxy A54 5G",
            "Galaxy A36 5G", "Galaxy A35 5G", "Galaxy A34 5G",
            "Galaxy A26 5G", "Galaxy A25 5G", "Galaxy A24",
            "Galaxy A16", "Galaxy A15", "Galaxy A14",
            "Galaxy A06", "Galaxy A05s", "Galaxy A05",
            "Galaxy M55", "Galaxy M54", "Galaxy M35", "Galaxy M34", "Galaxy M15", "Galaxy M14",
            "Galaxy Tab S10 Ultra", "Galaxy Tab S10+", "Galaxy Tab S9 Ultra", "Galaxy Tab S9+", "Galaxy Tab S9", "Galaxy Tab S9 FE+", "Galaxy Tab S9 FE",
            "Galaxy Tab A9+", "Galaxy Tab A9",
            "Galaxy Watch Ultra", "Galaxy Watch 7", "Galaxy Watch FE",
            "Galaxy Buds 3 Pro", "Galaxy Buds 3", "Galaxy Buds FE",
            "Digər"
          ],
          "Xiaomi": [
            "Xiaomi 16 Ultra", "Xiaomi 16 Pro", "Xiaomi 16",
            "Xiaomi 15 Ultra", "Xiaomi 15 Pro", "Xiaomi 15",
            "Xiaomi 14 Ultra", "Xiaomi 14 Pro", "Xiaomi 14", "Xiaomi 14T Pro", "Xiaomi 14T",
            "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13", "Xiaomi 13T Pro", "Xiaomi 13T",
            "Xiaomi 12 Pro", "Xiaomi 12", "Xiaomi 12T Pro", "Xiaomi 12T",
            "Redmi Note 15 Pro+", "Redmi Note 15 Pro", "Redmi Note 15",
            "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14",
            "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13",
            "Redmi Note 12 Pro+", "Redmi Note 12 Pro", "Redmi Note 12",
            "Poco F7 Ultra", "Poco F7 Pro", "Poco F7", "Poco F6 Pro", "Poco F6", "Poco F5 Pro", "Poco F5",
            "Poco X7 Pro", "Poco X7", "Poco X6 Pro", "Poco X6", "Poco X5 Pro",
            "Poco M7 Pro", "Poco M6 Pro", "Poco C75", "Poco C65",
            "Redmi 14C", "Redmi 14", "Redmi 13", "Redmi 13C", "Redmi 12", "Redmi 12C",
            "Xiaomi Pad 7 Pro", "Xiaomi Pad 7", "Xiaomi Pad 6S Pro", "Xiaomi Pad 6", "Redmi Pad Pro", "Redmi Pad SE",
            "Digər"
          ],
          "Honor": [
            "Magic7 Pro", "Magic7", "Magic V3", "Magic V Flip",
            "Magic6 Pro", "Magic6", "Magic6 Lite", "Magic V2",
            "Magic5 Pro", "Magic5", "Magic5 Lite",
            "Honor 300 Pro", "Honor 300",
            "Honor 200 Pro", "Honor 200", "Honor 200 Lite", "Honor 200 Smart",
            "Honor 90 Pro", "Honor 90", "Honor 90 Lite",
            "Honor X9c", "Honor X9b", "Honor X9a",
            "Honor X8b", "Honor X8a",
            "Honor X7b", "Honor X7a",
            "Honor X6b", "Honor X6a", "Honor X5 Plus",
            "Digər"
          ],
          "Realme": [
            "Realme 14 Pro+", "Realme 14 Pro", "Realme 14",
            "Realme 13 Pro+", "Realme 13 Pro", "Realme 13+", "Realme 13",
            "Realme 12 Pro+", "Realme 12 Pro", "Realme 12+", "Realme 12",
            "Realme 11 Pro+", "Realme 11 Pro", "Realme 11",
            "Realme GT 7 Pro", "Realme GT 6", "Realme GT 6T", "Realme GT 5 Pro",
            "Realme C67", "Realme C65", "Realme C63", "Realme C61", "Realme C55", "Realme C53",
            "Digər"
          ],
          "Huawei": [
            "Pura 80 Ultra", "Pura 80 Pro", "Pura 80",
            "Pura 70 Ultra", "Pura 70 Pro+", "Pura 70 Pro", "Pura 70",
            "Mate XT Ultimate", "Mate 70 Pro", "Mate 70", "Mate 60 Pro+", "Mate 60 Pro", "Mate 60", "Mate 50 Pro",
            "Mate X5", "Mate X3",
            "Nova 14 Pro", "Nova 14", "Nova 13 Pro", "Nova 13", "Nova 12 Ultra", "Nova 12 Pro", "Nova 12", "Nova 12 SE",
            "Nova 11 Pro", "Nova 11", "Nova Y91", "Nova Y72", "Nova Y70",
            "P60 Pro", "P60", "P50 Pro",
            "MatePad Pro 13.2", "MatePad Pro 12.2", "MatePad 11.5", "MatePad SE",
            "Digər"
          ],
          "OnePlus": [
            "OnePlus 13", "OnePlus 13R",
            "OnePlus 12", "OnePlus 12R",
            "OnePlus 11", "OnePlus 11R",
            "OnePlus 10 Pro", "OnePlus 10T",
            "OnePlus Open",
            "OnePlus Nord 4", "OnePlus Nord CE4", "OnePlus Nord CE4 Lite",
            "OnePlus Nord 3", "OnePlus Nord CE3", "OnePlus Nord CE3 Lite",
            "Digər"
          ],
          "Google": [
            "Pixel 10 Pro XL", "Pixel 10 Pro", "Pixel 10", "Pixel 10 Pro Fold",
            "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 9 Pro Fold",
            "Pixel 8 Pro", "Pixel 8", "Pixel 8a",
            "Pixel 7 Pro", "Pixel 7", "Pixel 7a", "Pixel Fold",
            "Digər"
          ],
          "Nothing": [
            "Nothing Phone (3)", "Nothing Phone (2a) Plus", "Nothing Phone (2a)", "Nothing Phone (2)", "Nothing Phone (1)",
            "CMF Phone 2", "CMF Phone 1",
            "Digər"
          ],
          "Nokia": [
            "XR21", "XR20", "X30 5G", "G42 5G", "G22", "G60 5G", "G21",
            "C32", "C22", "C12",
            "Nokia 3310", "Nokia 105", "Nokia 106", "Nokia 110", "Nokia 130", "Nokia 150",
            "Nokia 215 4G", "Nokia 225 4G", "Nokia 230", "Nokia 2660 Flip", "Nokia 5710 XpressAudio", "Nokia 8210 4G",
            "Digər"
          ],
          "Tecno": [
            "Camon 30 Premier 5G", "Camon 30 Pro 5G", "Camon 30", "Camon 20 Premier", "Camon 20 Pro", "Camon 20",
            "Spark 30 Pro", "Spark 30", "Spark 20 Pro+", "Spark 20 Pro", "Spark 20", "Spark 20C", "Spark 10 Pro", "Spark 10",
            "Pova 6 Pro 5G", "Pova 6", "Pova 6 Neo", "Pova 5 Pro", "Pova 5",
            "Phantom V Fold 2", "Phantom V Flip 2", "Phantom V Fold", "Phantom V Flip",
            "Pop 8", "Pop 7",
            "Digər"
          ],
          "Infinix": [
            "Note 40 Pro+ 5G", "Note 40 Pro 5G", "Note 40 Pro", "Note 40",
            "Note 30 VIP", "Note 30 Pro", "Note 30 5G", "Note 30",
            "Hot 50 Pro+", "Hot 50 Pro", "Hot 50 5G", "Hot 50",
            "Hot 40 Pro", "Hot 40", "Hot 40i", "Hot 30", "Hot 30i",
            "GT 20 Pro", "GT 10 Pro",
            "Zero 40 5G", "Zero 40", "Zero 30 5G", "Zero 30",
            "Smart 8 Pro", "Smart 8", "Smart 7",
            "Digər"
          ]
        }
      },
      { name: "storage", label: "Yaddaş", type: "select", options: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "2 TB", "4 TB"] },
      { name: "ram", label: "RAM", type: "select", options: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB", "18 GB", "24 GB", "32 GB", "64 GB", "128 GB"] },
      { name: "processor", label: "Prosessor", type: "select", options: [
        "Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9",
        "Intel Core Ultra 5", "Intel Core Ultra 7", "Intel Core Ultra 9",
        "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "AMD Ryzen AI 9",
        "Apple M1", "Apple M2", "Apple M3", "Apple M4", "Apple M5",
        "Apple A17 Pro", "Apple A18 Pro",
        "Qualcomm Snapdragon", "MediaTek Dimensity",
        "Digər"
      ]},
      PHONE_COLOR_FIELD,
      CONDITION_FIELD
    ]
  },
  {
    id: "4", name: "Ehtiyat hissələri və aksesuarlar", icon: Settings, image: "/ehtiyat.png",
    subcategories: ["Avto ehtiyat hissələri", "Avto aksesuarlar", "Moto ehtiyat hissələri", "Şinlər və disklər", "GPS və naviqatorlar", "Avto elektronika", "Avto kosmetika"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "5", name: "Daşınmaz əmlak", icon: Building2, image: "/dasinmaz.png",
    subcategories: ["Mənzillər", "Villalar və bağ evləri", "Obyektlər və ofislər", "Torpaq", "Qarajlar", "Yataqxanalar"],
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
    id: "12", name: "İş elanları", icon: UserPlus, image: "/ish.png",
    subcategories: ["Vakansiyalar", "CV-lər", "Təcrübə proqramları", "Freelance", "Müvəqqəti işlər"],
    fields: [
      { name: "field", label: "Sahə", type: "select", options: ["IT", "Satış", "Mühasibat", "Marketinq", "Tibb", "Hüquq", "Təhsil", "İnşaat", "Xidmət", "Nəqliyyat", "Mühəndislik", "İnsan resursları", "Maliyyə", "Media", "Turizm", "İdarəetmə", "Digər"] },
      { name: "experience", label: "Təcrübə", type: "select", options: ["Təcrübəsiz", "1 ildən az", "1-3 il", "3-5 il", "5+ il"] },
      { name: "schedule", label: "İş qrafiki", type: "select", options: ["Tam iş günü", "Yarım iş günü", "Sərbəst qrafik", "Məsafədən iş", "Növbəli"] },
      { name: "education", label: "Təhsil", type: "select", options: ["Ali", "Natamam ali", "Orta xüsusi", "Orta"] }
    ]
  },
  {
    id: "13", name: "Heyvanlar", icon: Dog, image: "/heyvanlar.png",
    subcategories: ["İtlər", "Pişiklər", "Quşlar", "Balıqlar", "Gəmiricilər", "Sürünənlər", "Kənd heyvanları", "Heyvanlar üçün aksesuarlar"],
    fields: []
  },
  {
    id: "14", name: "Məktəblilər üçün", icon: Backpack, image: "/mektebli.png",
    subcategories: ["Məktəb formaları", "Dərsliklər", "Dəftərxana ləvazimatları", "Çantalar və bel çantaları", "Tədris kursları", "Repetitorlar"],
    fields: [CONDITION_FIELD]
  },
  {
    id: "15", name: "Mağazalar", icon: Store, image: "/magazalar.png",
    subcategories: ["Geyim mağazaları", "Texnika mağazaları", "Mebel mağazaları", "Avtosalonlar", "Ərzaq mağazaları", "Parfümeriya", "İdman mağazaları", "Digər mağazalar"],
    fields: []
  }
];
