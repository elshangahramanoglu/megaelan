import re

with open("src/app/reklam/page.tsx", "r") as f:
    text = f.read()

# Add logic for paying with balance
handle_balance_pay = """
  const handleBalancePayment = async () => {
    if (!selectedTariff || !selectedAdId || !user) return;
    
    if ((user.balance || 0) < selectedTariff.price) {
      alert("Balansınızda kifayət qədər vəsait yoxdur.");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        const updateData: any = {};
        if (selectedTariff.type === 'premium') updateData.is_premium = true;
        if (selectedTariff.type === 'vip') updateData.is_vip = true;
        
        // 1. Update Ad
        const { error: adError } = await supabase.from('ads').update(updateData).eq('id', selectedAdId);
        if (adError) throw adError;
        
        // 2. Deduct Balance
        const newBalance = (user.balance || 0) - selectedTariff.price;
        const { error: userError } = await supabase.from('users').update({ balance: newBalance }).eq('id', user.id);
        if (userError) console.warn("DB Balance deduction failed", userError);
        
        // @ts-ignore - updateUser will be called from context if we had it, but wait!
        // We need to fetch updateUser from useAppContext. Let's add it if missing.
        
        setStep(3);
      } catch (err) {
        console.error(err);
        alert("Xəta baş verdi.");
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };
"""

text = text.replace("  const handlePayment = async (e: React.FormEvent) => {", handle_balance_pay + "\n  const handlePayment = async (e: React.FormEvent) => {")

# Extract updateUser from context
if "updateUser" not in text:
    text = text.replace("const { user, ads } = useAppContext();", "const { user, ads, updateUser } = useAppContext();")
    text = text.replace("// @ts-ignore - updateUser will be called from context if we had it, but wait!", "updateUser({ balance: newBalance });")

# Add "Balansla ödə" UI
balance_ui_old = """                <button 
                  type="submit" 
                  disabled={isProcessing || !selectedTariff}
                  className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Ödənişi Təsdiqlə"}
                </button>"""

balance_ui_new = """                <div className="flex flex-col gap-3">
                  <button 
                    type="submit" 
                    disabled={isProcessing || !selectedTariff}
                    className="w-full bg-gray-800 hover:bg-black active:scale-95 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    Kart ilə Ödə
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={handleBalancePayment}
                    disabled={isProcessing || !selectedTariff}
                    className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Balansdan ödə (${(user?.balance || 0).toFixed(2)} ₼ mövcuddur)`}
                  </button>
                </div>"""

text = text.replace(balance_ui_old, balance_ui_new)

with open("src/app/reklam/page.tsx", "w") as f:
    f.write(text)
