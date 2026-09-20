with open("src/context/AppContext.tsx", "r") as f:
    text = f.read()

# Add supabase import if not there
if "import { supabase }" not in text:
    text = text.replace('import { categoriesData } from "@/data/categories";', 'import { categoriesData } from "@/data/categories";\nimport { supabase } from "@/lib/supabase";')

# Update the useEffect that initializes ads to fetch from Supabase
old_effect = """    // Initialize mock data safely on client to avoid hydration mismatch
    const timer = setTimeout(() => {
      setAds(generateMockAds());
    }, 0);"""

new_effect = """    // Initialize mock data and fetch real data from Supabase
    const timer = setTimeout(async () => {
      const mockAds = generateMockAds();
      
      try {
        const { data: realAds, error } = await supabase
          .from('ads')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && realAds) {
          // Convert Supabase ads to our local Ad type
          const formattedRealAds = realAds.map(dbAd => ({
            id: dbAd.id,
            title: dbAd.title,
            price: dbAd.price,
            currency: dbAd.currency || "AZN",
            city: dbAd.city,
            date: new Date(dbAd.created_at).toLocaleDateString(),
            categoryId: dbAd.category_id,
            subCategory: dbAd.sub_category,
            isPremium: dbAd.is_premium || false,
            imagePlaceholder: dbAd.images && dbAd.images.length > 0 ? dbAd.images[0] : "Şəkil",
            images: dbAd.images || [],
            description: dbAd.description,
            contactName: dbAd.contact_name,
            contactPhone: dbAd.contact_phone,
            details: dbAd.details || {}
          }));
          
          // Combine real ads (top) with mock ads (bottom)
          setAds([...formattedRealAds, ...mockAds]);
        } else {
          setAds(mockAds);
        }
      } catch (err) {
        setAds(mockAds);
      }
    }, 0);"""

text = text.replace(old_effect, new_effect)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(text)
