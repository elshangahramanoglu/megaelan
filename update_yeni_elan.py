import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    content = f.read()

# 1. Add imports
content = content.replace('import { AZERBAIJAN_CITIES } from "@/data/cities";',
'''import { AZERBAIJAN_CITIES } from "@/data/cities";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";''')

# 2. Add files and isSubmitting state
state_block = '''  const [dynamicDetails, setDynamicDetails] = useState<Record<string, string>>({});'''
new_state = '''  const [dynamicDetails, setDynamicDetails] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);'''
content = content.replace(state_block, new_state)

# 3. Replace handleSubmit
old_submit = '''  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAd = {
      id: `new-${Date.now()}`,
      title: formData.title,
      price: Number(formData.price) || 0,
      currency: "AZN",
      city: formData.city,
      date: "İndi",
      categoryId: formData.categoryId,
      subCategory: formData.subCategory,
      isPremium: false,
      imagePlaceholder: "Yeni Şəkil",
      description: formData.description,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone || (user ? user.phone : ""),
      details: dynamicDetails
    };
    
    addAd(newAd);
    setIsSuccess(true);
    
    setTimeout(() => {
      router.push(`/elan/${newAd.id}`);
    }, 2000);
  };'''

new_submit = '''  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload images
      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImageToImgBB(file);
        if (url) imageUrls.push(url);
      }
      
      // 2. Insert into Supabase
      const { data: insertedAd, error } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: Number(formData.price) || 0,
          currency: 'AZN',
          city: formData.city,
          category_id: formData.categoryId,
          sub_category: formData.subCategory,
          images: imageUrls,
          details: dynamicDetails,
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone || user.phone,
          status: 'active'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // 3. Update Global Context to show it immediately
      const newAd = {
        id: insertedAd.id,
        title: insertedAd.title,
        price: insertedAd.price,
        currency: insertedAd.currency,
        city: insertedAd.city,
        date: "İndi",
        categoryId: insertedAd.category_id,
        subCategory: insertedAd.sub_category,
        isPremium: false,
        imagePlaceholder: imageUrls.length > 0 ? imageUrls[0] : "Yeni Şəkil", // fallback or use the real image
        images: imageUrls,
        description: insertedAd.description,
        contactName: insertedAd.contact_name,
        contactPhone: insertedAd.contact_phone,
        details: insertedAd.details
      };
      
      addAd(newAd as any);
      setIsSuccess(true);
      
      setTimeout(() => {
        router.push(`/elan/${newAd.id}`);
      }, 2000);
      
    } catch (err) {
      console.error("Ad creation error:", err);
      alert("Elan yerləşdirilərkən xəta baş verdi.");
    } finally {
      setIsSubmitting(false);
    }
  };'''
content = content.replace(old_submit, new_submit)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(content)

