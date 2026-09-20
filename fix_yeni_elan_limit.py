import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

# 1. State for Ad Limit tracking
state_old = "  const [createdAdId, setCreatedAdId] = useState<string | null>(null);"
state_new = """  const [createdAdId, setCreatedAdId] = useState<string | null>(null);
  
  // Limit tracking
  const [categoryAdCount, setCategoryAdCount] = useState<number>(0);
  const [showAdPayment, setShowAdPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);"""
text = text.replace(state_old, state_new)

# 2. Fetch limit on category change
effect_new = """  React.useEffect(() => {
    if (!user || !formData.categoryId) return;
    const checkLimits = async () => {
      try {
        const { count, error } = await supabase
          .from('ads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('category_id', formData.categoryId);
        if (!error && count !== null) {
          setCategoryAdCount(count);
        }
      } catch (err) {
        console.error("Limit check error", err);
      }
    };
    checkLimits();
  }, [formData.categoryId, user]);
"""
target = "  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {"
text = text.replace(target, effect_new + "\n" + target)


# 3. Add Info Warning about limits dynamically
info_old = """      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-8 flex items-start gap-3">
        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-black font-medium text-sm leading-relaxed">
          <span className="font-bold text-blue-700">Qayda:</span> Hər bir istifadəçi ay ərzində hər kateqoriya üzrə <span className="font-bold">3 pulsuz elan</span> yerləşdirə bilər. Əlavə elanlar və ya Premium xidmətlər üçün tariflərlə tanış olun: 
        </p>
      </div>"""

info_new = """      <div className={`border p-4 rounded-xl mb-8 flex items-start gap-3 ${categoryAdCount >= 3 ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
        <Info className={`w-6 h-6 flex-shrink-0 mt-0.5 ${categoryAdCount >= 3 ? 'text-orange-500' : 'text-blue-600'}`} />
        <div className="text-black font-medium text-sm leading-relaxed">
          <span className={`font-bold ${categoryAdCount >= 3 ? 'text-orange-700' : 'text-blue-700'}`}>Qayda:</span> Hər bir istifadəçi ay ərzində hər kateqoriya üzrə <span className="font-bold">3 pulsuz elan</span> yerləşdirə bilər. 
          {categoryAdCount >= 3 && formData.categoryId ? (
            <div className="mt-2 text-orange-700 font-bold bg-orange-100 p-2 rounded-lg border border-orange-200">
              Siz artıq bu kateqoriya üzrə limitinizi (3 elan) doldurmusunuz. Bu elanı yerləşdirmək üçün 3.00 AZN xidmət haqqı tələb olunur.
            </div>
          ) : formData.categoryId ? (
            <div className="mt-1 text-blue-800">
              Sizin bu kateqoriya üzrə istifadə etdiyiniz limit: {categoryAdCount}/3
            </div>
          ) : null}
        </div>
      </div>"""
text = text.replace(info_old, info_new)


# 4. Modify handleSubmit to show payment modal if limit exceeded
submit_old = """    if (badWords.some(word => textToCheck.includes(word))) {
      initialStatus = 'rejected';
      // In a real app we'd still let it insert but as rejected, 
      // or we can reject it right here before uploading images.
    }
    
    setIsSubmitting(true);
    
    try {"""

submit_new = """    if (badWords.some(word => textToCheck.includes(word))) {
      initialStatus = 'rejected';
    }
    
    if (categoryAdCount >= 3 && !showAdPayment) {
      setShowAdPayment(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {"""
text = text.replace(submit_old, submit_new)

# 5. Add Payment Modal UI at the bottom before final return
modal_code = """
  if (showAdPayment) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-12 animate-in fade-in zoom-in duration-300">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Limit Aşılıb</h2>
            <p className="text-gray-600 font-medium">Bu kateqoriya üzrə 3 pulsuz elan limitini doldurmusunuz. 4-cü və sonrakı hər elan üçün 3.00 AZN ödəniş tələb olunur.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex justify-between items-center">
            <span className="font-bold text-gray-700">Ödəniləcək məbləğ:</span>
            <span className="text-2xl font-black text-blue-600">3.00 AZN</span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setIsProcessingPayment(true);
              setTimeout(() => {
                setIsProcessingPayment(false);
                setShowAdPayment(false);
                handleSubmit(e); // Continue submission
              }, 2000);
            }} 
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kartın nömrəsi</label>
              <input type="text" placeholder="4169 0000 0000 0000" maxLength={19} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors font-medium" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bitmə tarixi</label>
                <input type="text" placeholder="AA / İİ" maxLength={5} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors font-medium text-center" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                <input type="password" placeholder="***" maxLength={3} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors font-medium text-center" required />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
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
            </div>
          </form>
        </div>
      </div>
    );
  }
"""

text = text.replace("  return (\n    <div className=\"w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500\">", modal_code + "\n  return (\n    <div className=\"w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500\">")


with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
