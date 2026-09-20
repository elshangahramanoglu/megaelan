import re

with open("src/context/AppContext.tsx", "r") as f:
    text = f.read()

# Remove the generateMockAds function entirely
mock_func_pattern = re.compile(r'const generateMockAds = \(\): Ad\[\] => \{.*?\};\n\nexport const AppProvider', re.DOTALL)
text = mock_func_pattern.sub('export const AppProvider', text)

# Modify the useEffect to only fetch real ads
old_effect = """    // Initialize mock data and fetch real data from Supabase
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

new_effect = """    // Fetch real data from Supabase (No more mock ads)
    const fetchAds = async () => {
      try {
        const { data: realAds, error } = await supabase
          .from('ads')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && realAds) {
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
          setAds(formattedRealAds);
        } else {
          setAds([]);
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
        setAds([]);
      }
    };
    
    fetchAds();"""

text = text.replace(old_effect, new_effect)

# Also update the cleanup since we removed the timer
text = text.replace("return () => clearTimeout(timer);", "")

with open("src/context/AppContext.tsx", "w") as f:
    f.write(text)
