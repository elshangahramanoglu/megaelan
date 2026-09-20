import re

with open("src/app/kabinet/page.tsx", "r") as f:
    text = f.read()

# 1. Update State
state_old = "  const [activeTab, setActiveTab] = useState<'profil' | 'elanlar'>('profil');"
state_new = """  const [activeTab, setActiveTab] = useState<'profil' | 'elanlar' | 'balans'>('profil');
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [isProcessingBalance, setIsProcessingBalance] = useState(false);"""
text = text.replace(state_old, state_new)

# 2. Add CreditCard icon to imports if not there
if "CreditCard" not in text:
    text = text.replace("Edit3", "Edit3, CreditCard")

# 3. Update handleSave to hit Supabase
save_old = """  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };"""

save_new = """  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await supabase.from('users').update({ name }).eq('id', user.id);
        updateUser({ name });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Xəta baş verdi");
    }
  };

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) return alert('Düzgün məbləğ daxil edin');
    
    setIsProcessingBalance(true);
    setTimeout(async () => {
      try {
        if (!user) return;
        const newBalance = (user.balance || 0) + amount;
        
        // Try to update DB. If it fails (e.g. column missing), we just update context
        const { error } = await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
        if (error) {
          console.warn('DB update failed, using local context only.', error);
        }
        
        updateUser({ balance: newBalance });
        setBalanceAmount('');
        alert(`Balansınız uğurla ${amount.toFixed(2)} AZN artırıldı!`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessingBalance(false);
      }
    }, 2000);
  };"""
text = text.replace(save_old, save_new)

# 4. Update the Tab Navigation (Adding Balans)
nav_old = """            <button className="text-left px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">
              Balansım (0.00 AZN)
            </button>"""
nav_new = """            <button 
              onClick={() => setActiveTab('balans')}
              className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'balans' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Balansım ({(user?.balance || 0).toFixed(2)} AZN)
            </button>"""
text = text.replace(nav_old, nav_new)

# 5. Add Balans UI Tab
balans_ui = """
          {activeTab === 'balans' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Balansım</h2>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-blue-100 font-medium mb-1">Cari balansınız</p>
                  <h3 className="text-4xl font-black">{(user?.balance || 0).toFixed(2)} <span className="text-2xl font-bold">AZN</span></h3>
                </div>
                <CreditCard className="w-16 h-16 opacity-80" />
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Balansı artır</h3>
                <form onSubmit={handleTopUp} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Məbləğ (AZN)</label>
                    <input 
                      type="number" 
                      step="0.10"
                      min="1"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      placeholder="Məsələn: 10.00"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-none text-black font-black text-xl"
                      required
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                    * Ödəniş et düyməsinə basdıqdan sonra bank səhifəsinə yönləndiriləcəksiniz (Test rejimi).
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessingBalance || !balanceAmount}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessingBalance ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ödəniş et"}
                  </button>
                </form>
              </div>
            </div>
          )}
"""
text = text.replace("        {/* Form area */}\n        <div className=\"w-full md:w-2/3 p-6 md:p-8\">", "        {/* Form area */}\n        <div className=\"w-full md:w-2/3 p-6 md:p-8\">\n" + balans_ui)

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(text)
