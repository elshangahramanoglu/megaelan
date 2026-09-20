import re

with open("src/app/redakte/[id]/page.tsx", "r") as f:
    text = f.read()

# 1. Update component name and imports
text = text.replace("export default function NewAdPage() {", "import { useParams } from 'next/navigation';\n\nexport default function EditAdPage() {\n  const params = useParams();\n  const adId = params.id as string;")

# 2. Add loading state and fetch logic
fetch_logic = """
  const [isLoadingAd, setIsLoadingAd] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [editTimestamps, setEditTimestamps] = useState<number[]>([]);

  React.useEffect(() => {
    if (!user || !adId) return;
    
    const fetchAd = async () => {
      try {
        const { data, error } = await supabase.from('ads').select('*').eq('id', adId).single();
        if (error) throw error;
        
        if (data.user_id !== user.id) {
          alert("Siz yalnız öz elanınızı redaktə edə bilərsiniz!");
          router.push('/kabinet');
          return;
        }

        // Check edit limits
        const details = data.details || {};
        const timestamps: number[] = details.edit_timestamps || [];
        const now = Date.now();
        const last24h = timestamps.filter(t => (now - t) < 24 * 60 * 60 * 1000);
        
        if (last24h.length >= 2) {
          alert("Siz son 24 saat ərzində artıq 2 dəfə redaktə etmisiniz. Lütfən daha sonra cəhd edin.");
          router.push('/kabinet');
          return;
        }
        
        setEditTimestamps(last24h);

        setFormData({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          city: data.city,
          categoryId: data.category_id,
          subCategory: data.sub_category,
          contactName: data.contact_name,
          contactPhone: data.contact_phone
        });
        
        setDynamicDetails(details);
        setExistingImages(data.images || []);
        setIsLoadingAd(false);
      } catch (err) {
        console.error(err);
        router.push('/kabinet');
      }
    };
    
    fetchAd();
  }, [user, adId]);
"""
text = text.replace("const [isSubmitting, setIsSubmitting] = useState(false);", fetch_logic + "\n  const [isSubmitting, setIsSubmitting] = useState(false);")

# 3. Modify handleSubmit for UPDATE instead of INSERT
old_insert = """      // 2. Insert into Supabase
      const { data: insertedAd, error } = await supabase
        .from('ads')
        .insert({
          user_id: user.id,
          title: formData.title,
          status: initialStatus,
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
        })
        .select()
        .single();"""

new_insert = """      // 2. Update Supabase
      const finalImages = imageUrls.length > 0 ? imageUrls : existingImages;
      
      const newEditTimestamps = [...editTimestamps, Date.now()];
      const updatedDetails = { ...dynamicDetails, edit_timestamps: newEditTimestamps };

      const { data: insertedAd, error } = await supabase
        .from('ads')
        .update({
          title: formData.title,
          status: initialStatus,
          description: formData.description,
          price: Number(formData.price) || 0,
          city: formData.city,
          category_id: formData.categoryId,
          sub_category: formData.subCategory,
          images: finalImages,
          details: updatedDetails,
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone || user.phone,
        })
        .eq('id', adId)
        .select()
        .single();"""
text = text.replace(old_insert, new_insert)

# 4. Modify Validation to ignore empty files if existingImages exist
val_old = """    if (files.length === 0) {
      alert("Ən azı 1 şəkil yükləməyiniz mütləqdir!");
      return;
    }"""
val_new = """    if (files.length === 0 && existingImages.length === 0) {
      alert("Ən azı 1 şəkil yükləməyiniz mütləqdir!");
      return;
    }"""
text = text.replace(val_old, val_new)

# 5. Fix titles
text = text.replace("Yeni elan yerləşdir", "Elanı Redaktə Et")
text = text.replace("Elanınız uğurla əlavə edildi!", "Elanınız uğurla yeniləndi!")
text = text.replace("Yeni elanınız artıq yoxlanışa göndərildi", "Yenilənmiş elanınız yoxlanışa göndərildi")

# 6. Add Loading Guard
text = text.replace("return (\n    <div className=\"w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12\">", "if (isLoadingAd) return <div className=\"py-20 text-center\"><Loader2 className=\"w-10 h-10 animate-spin mx-auto text-blue-600\"/></div>;\n\n  return (\n    <div className=\"w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12\">")

with open("src/app/redakte/[id]/page.tsx", "w") as f:
    f.write(text)
