import re

with open("src/app/kabinet/page.tsx", "r") as f:
    text = f.read()

# Add new state for ad sub-tab
state_find = "  const [activeTab, setActiveTab] = useState<'profil' | 'elanlar'>('profil');"
state_replace = """  const [activeTab, setActiveTab] = useState<'profil' | 'elanlar'>('profil');
  const [adStatusTab, setAdStatusTab] = useState<'active' | 'pending' | 'rejected' | 'expired'>('active');"""
text = text.replace(state_find, state_replace)

# Modify render of 'Mənim elanlarım' to include status tabs and filter
old_ads_render = """              <div className="flex justify-between items-center mb-6">
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
                  {myAds.map(ad => ("""

new_ads_render = """              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Mənim elanlarım</h2>
                <Link href="/yeni-elan" className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition-colors">
                  + Yeni
                </Link>
              </div>

              {/* Status Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
                <button onClick={() => setAdStatusTab('active')} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${adStatusTab === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Qəbul edilən (Aktiv)</button>
                <button onClick={() => setAdStatusTab('pending')} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${adStatusTab === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Gözləmədə</button>
                <button onClick={() => setAdStatusTab('rejected')} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${adStatusTab === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Qəbul edilməyən</button>
                <button onClick={() => setAdStatusTab('expired')} className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${adStatusTab === 'expired' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Müddəti bitmiş</button>
              </div>
              
              {isLoadingAds ? (
                <div className="flex items-center justify-center py-20 text-blue-600">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
              ) : myAds.filter(ad => ad.status === adStatusTab).length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="font-medium text-lg mb-2">Bu bölmədə elanınız yoxdur.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {myAds.filter(ad => ad.status === adStatusTab).map(ad => ("""

text = text.replace(old_ads_render, new_ads_render)

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(text)
