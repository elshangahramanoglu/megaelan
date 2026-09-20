"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { User, LogOut, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KabinetPage() {
  const { user, updateUser, logout } = useAppContext();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || "");
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Şəxsi Kabinet</h1>
          <p className="text-gray-500">Məlumatlarınızı buradan idarə edə bilərsiniz.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar menu */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-gray-100 p-6">
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Qeydiyyat nömrəsi</p>
            <p className="font-bold text-gray-900">+994 {user.phone}</p>
          </div>
          
          <nav className="flex flex-col gap-2">
            <button className="text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium transition-colors">
              Şəxsi məlumatlar
            </button>
            <button className="text-left px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
              Mənim elanlarım
            </button>
            <button className="text-left px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
              Balansım (0.00 AZN)
            </button>
            <div className="h-px bg-gray-200 my-2"></div>
            <button 
              onClick={handleLogout}
              className="text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Çıxış et
            </button>
          </nav>
        </div>

        {/* Form area */}
        <div className="w-full md:w-2/3 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Şəxsi məlumatlar</h2>
          
          {isSaved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Məlumatlarınız uğurla yadda saxlanıldı!
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad və Soyad</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınızı daxil edin"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobil nömrə (Dəyişdirilə bilməz)</label>
              <input 
                type="text" 
                value={`+994 ${user.phone}`}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
              >
                Yadda saxla
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
