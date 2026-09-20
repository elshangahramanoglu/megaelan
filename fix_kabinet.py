import re

with open("src/app/kabinet/page.tsx", "r") as f:
    content = f.read()

# 1. Add new imports
new_imports = """import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { User, LogOut, CheckCircle, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";"""
content = content.replace('import React, { useState } from "react";\nimport { useAppContext } from "@/context/AppContext";\nimport { User, LogOut, CheckCircle } from "lucide-react";\nimport { useRouter } from "next/navigation";', new_imports)

# 2. Add state for tabs and ads
state_find = '  const [isSaved, setIsSaved] = useState(false);'
state_replace = """  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'elanlar'>('profil');
  const [myAds, setMyAds] = useState<any[]>([]);
  const [isLoadingAds, setIsLoadingAds] = useState(false);"""
content = content.replace(state_find, state_replace)

# 3. Add fetch logic and delete logic
fetch_logic = """  const fetchMyAds = async () => {
    if (!user) return;
    setIsLoadingAds(true);
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setMyAds(data || []);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setIsLoadingAds(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'elanlar') {
      fetchMyAds();
    }
  }, [activeTab]);

  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return;
    
    try {
      const { error } = await supabase.from('ads').delete().eq('id', adId);
      if (error) throw error;
      setMyAds(myAds.filter(ad => ad.id !== adId));
    } catch (err) {
      console.error('Error deleting ad:', err);
      alert('Xəta baş verdi');
    }
  };"""
content = content.replace('  React.useEffect(() => {', fetch_logic + '\n\n  React.useEffect(() => {')

# 4. Fix sidebar tabs
sidebar_find = """          <nav className="flex flex-col gap-2">
            <button className="text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium transition-colors">
              Şəxsi məlumatlar
            </button>
            <button className="text-left px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
              Mənim elanlarım
            </button>"""
sidebar_replace = """          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('profil')}
              className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profil' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Şəxsi məlumatlar
            </button>
            <button 
              onClick={() => setActiveTab('elanlar')}
              className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'elanlar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Mənim elanlarım
            </button>"""
content = content.replace(sidebar_find, sidebar_replace)

# 5. Conditional render for form vs ads
form_area_find = """        {/* Form area */}
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
        </div>"""

form_area_replace = """        {/* Form area */}
        <div className="w-full md:w-2/3 p-6 md:p-8">
          {activeTab === 'profil' ? (
            <>
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
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mənim elanlarım</h2>
                <Link href="/yeni-elan" className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition-colors">
                  + Yeni
                </Link>
              </div>
              
              {isLoadingAds ? (
                <div className="flex items-center justify-center py-20 text-blue-600">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
              ) : myAds.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="font-medium text-lg mb-2">Hələ heç bir elanınız yoxdur.</p>
                  <p className="text-sm">İlk elanınızı indi yerləşdirin!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {myAds.map(ad => (
                    <div key={ad.id} className="flex gap-4 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm items-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                        {ad.images && ad.images.length > 0 ? (
                          <img src={ad.images[0]} className="w-full h-full object-cover" alt="Elan" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-bold">Şəkil yoxdur</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-black truncate mb-1">{ad.title}</h3>
                        <p className="text-blue-600 font-black mb-1">{ad.price} {ad.currency}</p>
                        <p className="text-sm text-gray-500">{new Date(ad.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={`/elan/${ad.id}`} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDeleteAd(ad.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>"""

content = content.replace(form_area_find, form_area_replace)

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(content)
