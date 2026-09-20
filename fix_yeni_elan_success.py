import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

# Remove setTimeout from handleSubmit
old_timeout = """      setIsSuccess(true);
      
      setTimeout(() => {
        router.push(`/elan/${newAd.id}`);
      }, 2000);"""
new_timeout = """      setIsSuccess(true);
      setCreatedAdId(newAd.id); // Save ID for manual navigation"""

text = text.replace(old_timeout, new_timeout)

# Add createdAdId and showPayment states
state_find = "  const [isSubmitting, setIsSubmitting] = useState(false);"
state_replace = """  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAdId, setCreatedAdId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<'vip' | 'premium' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);"""
text = text.replace(state_find, state_replace)

# Handle mock payment submission
handle_payment_func = """
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      alert("Ödəniş uğurla qəbul edildi! Elanınız önə çəkildi.");
      router.push(`/elan/${createdAdId}`);
    }, 2000);
  };
"""
text = text.replace("  const handleDetailChange = ", handle_payment_func + "\n  const handleDetailChange = ")

# Replace isSuccess rendering block
old_success = """  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">Elanınız uğurla əlavə edildi!</h1>
        <p className="text-gray-700 mb-8 font-medium">Yeni elanınız artıq yoxlanışa göndərildi və qısa zamanda saytda görünəcək.</p>
        <p className="text-blue-600 font-bold">Elana yönləndirilirsiniz...</p>
      </div>
    );
  }"""

new_success = """  if (isSuccess) {
    if (showPayment) {
      return (
        <div className="w-full max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-black mb-6 text-center">Reklam xidmətləri</h1>
          
          {!paymentPlan ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-orange-200 bg-orange-50 rounded-3xl p-6 text-center hover:shadow-lg cursor-pointer transition-all" onClick={() => setPaymentPlan('premium')}>
                <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-2xl text-black mb-2">Premium Elan</h3>
                <p className="text-gray-600 mb-4 font-medium">Elanınız axtarışda ilk sıralarda və xüsusi rənglə vurğulanır.</p>
                <div className="text-3xl font-black text-orange-600 mb-6">5.00 <span className="text-xl">AZN</span></div>
                <button className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl">Seç</button>
              </div>
              <div className="border-2 border-purple-200 bg-purple-50 rounded-3xl p-6 text-center hover:shadow-lg cursor-pointer transition-all" onClick={() => setPaymentPlan('vip')}>
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-2xl text-black mb-2">VIP Elan</h3>
                <p className="text-gray-600 mb-4 font-medium">Ana səhifədə xüsusi VIP blokunda günlərlə görünür.</p>
                <div className="text-3xl font-black text-purple-600 mb-6">15.00 <span className="text-xl">AZN</span></div>
                <button className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl">Seç</button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-black">Ödəniş ({paymentPlan === 'vip' ? '15.00' : '5.00'} AZN)</h3>
                <button onClick={() => setPaymentPlan(null)} className="text-blue-600 font-medium text-sm">Geri qayıt</button>
              </div>
              
              <form onSubmit={handlePayment} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Kartın nömrəsi</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-black font-medium" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Bitmə tarixi</label>
                    <input type="text" placeholder="AA/İİ" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-black font-medium" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
                    <input type="password" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-600 text-black font-medium" required />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={isProcessingPayment}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? <Loader2 className="w-6 h-6 animate-spin" /> : `Ödənişi təsdiqlə (${paymentPlan === 'vip' ? '15.00' : '5.00'} AZN)`}
                </button>
              </form>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">Elanınız uğurla əlavə edildi!</h1>
        <p className="text-gray-700 mb-8 font-medium">Yeni elanınız artıq yoxlanışa göndərildi və qısa zamanda saytda görünəcək. Daha çox alıcı tapmaq üçün elanınızı önə çəkə bilərsiniz.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setShowPayment(true)}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Crown className="w-5 h-5" /> Reklam et
          </button>
          <Link 
            href={`/elan/${createdAdId}`}
            className="px-8 py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors"
          >
            Elana bax
          </Link>
        </div>
      </div>
    );
  }"""
text = text.replace(old_success, new_success)

# We need to import Star since it is used in the new UI
if "Star" not in text:
    text = text.replace("Crown,", "Crown, Star,")

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
