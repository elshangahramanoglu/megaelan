import re

def fix_reklam(filepath):
    with open(filepath, "r") as f:
        text = f.read()
    
    # 1. Remove inline payment states
    text = text.replace("const [showPayment, setShowPayment] = useState(false);", "")
    text = text.replace("const [paymentPlan, setPaymentPlan] = useState<'vip' | 'premium' | null>(null);", "")
    text = text.replace("const [isProcessingPayment, setIsProcessingPayment] = useState(false);", "")
    
    # 2. Remove handlePayment block
    payment_regex = re.compile(r'  const handlePayment = \(e: React\.FormEvent\) => \{.*?  \};\n', re.DOTALL)
    text = payment_regex.sub('', text)
    
    # 3. Replace the entire if (isSuccess) block
    old_success_regex = re.compile(r'  if \(isSuccess\) \{.*?    \);\n  \}', re.DOTALL)
    
    new_success = """  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">Elanınız yoxlanışdadır (GÖZLƏMƏDƏ)!</h1>
        <p className="text-gray-700 mb-8 font-medium">Elanınız avtomatik yoxlanışdan keçir (1 dəqiqə ərzində aktiv olacaq). Elanlar siyahısında izləyə bilərsiniz.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/reklam?adId=${createdAdId || ''}`}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Crown className="w-5 h-5" /> Reklam et (Xidmətlər)
          </Link>
          <Link 
            href={`/kabinet`}
            className="px-8 py-4 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 font-bold rounded-xl transition-all"
          >
            Elanlarıma bax (Kabinet)
          </Link>
        </div>
      </div>
    );
  }"""
    
    text = old_success_regex.sub(new_success, text)
    
    with open(filepath, "w") as f:
        f.write(text)

fix_reklam("src/app/yeni-elan/page.tsx")
fix_reklam("src/app/redakte/[id]/page.tsx")
