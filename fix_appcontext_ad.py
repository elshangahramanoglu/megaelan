import re

with open("src/context/AppContext.tsx", "r") as f:
    text = f.read()

old_ad_type = """export interface Ad {
  id: string;
  title: string;
  price: string;
  currency: string;
  city: string;
  imagePlaceholder: string;
  isVip?: boolean;
  isPremium?: boolean;
  categoryId: string;
  images?: string[];
  description?: string;
  details?: Record<string, any>;
  contact_name?: string;
  contact_phone?: string;
}"""

new_ad_type = """export interface Ad {
  id: string;
  title: string;
  price: string;
  currency: string;
  city: string;
  imagePlaceholder: string;
  isVip?: boolean;
  isPremium?: boolean;
  categoryId: string;
  images?: string[];
  description?: string;
  details?: Record<string, any>;
  contact_name?: string;
  contact_phone?: string;
  user_id?: string;
  status?: string;
}"""

if old_ad_type in text:
    text = text.replace(old_ad_type, new_ad_type)
else:
    print("Could not find exact Ad type string")

with open("src/context/AppContext.tsx", "w") as f:
    f.write(text)
