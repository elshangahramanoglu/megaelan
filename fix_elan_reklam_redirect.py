import re

with open("src/app/elan/[id]/page.tsx", "r") as f:
    text = f.read()

# 1. Remove inline payment states and handler
text = text.replace("const [showPromo, setShowPromo] = useState(false);", "")
text = text.replace("const [paymentPlan, setPaymentPlan] = useState<'vip' | 'premium' | null>(null);", "")
text = text.replace("const [isProcessingPayment, setIsProcessingPayment] = useState(false);", "")

payment_handler_regex = re.compile(r'  const handlePayment = async \(e: React\.FormEvent\) => \{.*?  \};\n', re.DOTALL)
text = payment_handler_regex.sub('', text)

# 2. Replace the Promo Box UI
old_promo_regex = re.compile(r'          \{\/\* Promo Box - Only visible to owner \*\/}.*?          \)}', re.DOTALL)

new_promo = """          {/* Promo Box - Only visible to owner */}
          {isOwner && (
            <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-600/30 text-center animate-in fade-in duration-500">
              <Crown className="w-12 h-12 mx-auto text-orange-400 mb-4 drop-shadow-md" />
              <h3 className="font-black text-2xl mb-2">Daha çox alıcı tap!</h3>
              <p className="text-blue-100 mb-6 text-sm font-medium">Elanınızı İrəli Çəkin və ya Premium edərək daha çox insanın görməsini təmin edin.</p>
              <Link href={`/reklam?adId=${ad.id}`} className="block w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-md">
                Reklam et (Xidmətlər)
              </Link>
            </div>
          )}"""

text = old_promo_regex.sub(new_promo, text)

with open("src/app/elan/[id]/page.tsx", "w") as f:
    f.write(text)
