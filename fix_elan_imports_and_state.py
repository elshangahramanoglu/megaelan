import re

with open("src/app/elan/[id]/page.tsx", "r") as f:
    text = f.read()

# 1. Imports
if 'import React, { use, useState } from "react";' not in text:
    text = text.replace('import React, { use } from "react";', 'import React, { use, useState } from "react";')

if 'import { supabase } from "@/lib/supabase";' not in text:
    text = text.replace('import AdCard from "@/components/AdCard";', 'import AdCard from "@/components/AdCard";\nimport { supabase } from "@/lib/supabase";')

if 'Star, Loader2' not in text:
    text = text.replace('AlertTriangle, ChevronRight, Crown } from "lucide-react";', 'AlertTriangle, ChevronRight, Crown, Star, Loader2 } from "lucide-react";')

# 2. State definition
state_insert = """  const isFav = favorites.includes(adId);
  
  const [showPromo, setShowPromo] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<'vip' | 'premium' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
"""
text = text.replace("  const isFav = favorites.includes(adId);", state_insert)

# 3. Handle ad undefined in handlePayment
text = text.replace("eq('id', ad.id);", "eq('id', ad?.id);")

with open("src/app/elan/[id]/page.tsx", "w") as f:
    f.write(text)
