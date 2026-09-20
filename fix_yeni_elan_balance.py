import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

# Add updateUser to context
if "updateUser" not in text:
    text = text.replace("const { user, addAd, setLoginOpen } = useAppContext();", "const { user, addAd, setLoginOpen, updateUser } = useAppContext();")

# Add balance payment logic to the limit modal
balance_ui_old = """            <div className="flex gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setShowAdPayment(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-all"
              >
                İmtina et
              </button>
              <button 
                type="submit" 
                disabled={isProcessingPayment}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-blue-600/30"
              >
                {isProcessingPayment ? <Loader2 className="w-6 h-6 animate-spin" /> : "3.00 AZN Ödə və Yerləşdir"}
              </button>
            </div>"""

balance_ui_new = """            <div className="flex flex-col gap-3 mt-4">
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAdPayment(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl active:scale-95 transition-all"
                >
                  İmtina et
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessingPayment}
                  className="flex-1 bg-gray-800 hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  Kartla Ödə
                </button>
              </div>
              
              <button 
                type="button" 
                disabled={isProcessingPayment}
                onClick={async (e) => {
                  if ((user?.balance || 0) < 3) {
                    alert("Balansınızda kifayət qədər vəsait yoxdur. Zəhmət olmasa Kabinetdən artırın.");
                    return;
                  }
                  setIsProcessingPayment(true);
                  try {
                    const newBalance = (user?.balance || 0) - 3;
                    await supabase.from('users').update({ balance: newBalance }).eq('id', user?.id);
                    updateUser({ balance: newBalance });
                    setShowAdPayment(false);
                    handleSubmit(e as any);
                  } catch(err) {
                    console.error(err);
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-blue-600/30"
              >
                {isProcessingPayment ? <Loader2 className="w-6 h-6 animate-spin" /> : `Balansdan ödə (${(user?.balance || 0).toFixed(2)} ₼ mövcuddur)`}
              </button>
            </div>"""

text = text.replace(balance_ui_old, balance_ui_new)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
