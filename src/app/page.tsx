import Link from "next/link";
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
  Store,
  Search,
  MapPin,
  ChevronDown
} from "lucide-react";
import Image from "next/image";

const categories = [
  { id: 1, name: "Ev və Bağ üçün", icon: <Home className="w-6 h-6" /> },
  { id: 2, name: "Nəqliyyat", icon: <Car className="w-6 h-6" /> },
  { id: 3, name: "Elektronika", icon: <Tv className="w-6 h-6" /> },
  { id: 4, name: "Ehtiyat Hissələri və aksessuarlar", icon: <Settings className="w-6 h-6" /> },
  { id: 5, name: "Daşınmaz əmlak", icon: <Building2 className="w-6 h-6" /> },
  { id: 6, name: "Xidmətlər və biznes", icon: <Briefcase className="w-6 h-6" /> },
  { id: 7, name: "Şəxsi əşyalar", icon: <Shirt className="w-6 h-6" /> },
  { id: 8, name: "Hobbi asudə", icon: <Palette className="w-6 h-6" /> },
  { id: 9, name: "Məişət texnikası", icon: <WashingMachine className="w-6 h-6" /> },
  { id: 10, name: "Telefonlar", icon: <Smartphone className="w-6 h-6" /> },
  { id: 11, name: "Uşaq aləmi", icon: <Baby className="w-6 h-6" /> },
  { id: 12, name: "İş elanları", icon: <UserPlus className="w-6 h-6" /> },
  { id: 13, name: "Heyvanlar", icon: <Dog className="w-6 h-6" /> },
  { id: 14, name: "Məktəblilər üçün", icon: <Backpack className="w-6 h-6" /> },
  { id: 15, name: "Mağazalar", icon: <Store className="w-6 h-6" /> },
];

export default function Home_Page() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Search Section */}
      <section className="bg-slate-50 py-10 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-full shadow-sm border border-gray-200 flex flex-col md:flex-row items-center p-2">
            <div className="flex-1 flex items-center w-full px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
              <Search className="text-gray-400 w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="Əşya, xidmət və ya iş axtar..." 
                className="w-full outline-none text-gray-700 bg-transparent placeholder-gray-400"
              />
            </div>
            <div className="w-full md:w-auto flex items-center px-4 py-2">
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-2">
                  <MapPin className="text-blue-500 w-5 h-5" />
                  <span>Bütün Azərbaycan</span>
                </div>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
            <div className="w-full md:w-auto mt-2 md:mt-0 md:ml-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 font-medium transition-colors">
                Tap
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Kataloq</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/kateqoriya/${cat.id}`}
              className="group flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Ads Section (Placeholder) */}
      <section className="container mx-auto px-4 md:px-8 mt-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Son elanlar</h2>
          <Link href="/elanlar" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
            Hamısına bax <span aria-hidden="true">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Ad Card Skeleton/Placeholder */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-3 overflow-hidden relative border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                  Şəkil
                </div>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{(Math.random() * 1000).toFixed()} AZN</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">Nümunə elan başlığı - Çox yaxşı vəziyyətdə</p>
              <p className="text-gray-400 text-xs">Bakı, bu gün 14:32</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
