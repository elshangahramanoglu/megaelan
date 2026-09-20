with open("src/app/kabinet/page.tsx", "r") as f:
    text = f.read()

old_delete = """  const handleDeleteAd = async (adId: string) => {
    // Optimistic UI update: instantly remove from screen
    setMyAds(prev => prev.filter(ad => ad.id !== adId));
    
    try {
      // Delete from database silently
      await supabase.from('ads').delete().eq('id', adId);
    } catch (err) {
      console.error('Error deleting ad:', err);
      // Revert if failed (optional, but keeping it simple for now)
    }
  };"""

new_delete = """  const handleDeleteAd = async (adId: string) => {
    const previousAds = [...myAds];
    // Optimistic UI update: instantly remove from screen
    setMyAds(prev => prev.filter(ad => ad.id !== adId));
    
    try {
      // Delete from database silently
      const { error } = await supabase.from('ads').delete().eq('id', adId);
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      // Also remove from global context so it instantly disappears from home page
      // @ts-ignore (we just force it for now since we don't have a removeAd function)
      const contextAds = JSON.parse(localStorage.getItem("megaelan_deleted_ads") || "[]");
      contextAds.push(adId);
      localStorage.setItem("megaelan_deleted_ads", JSON.stringify(contextAds));
      
      // Better yet, force a page reload if they want to see it gone from home, 
      // or we just let it be since they usually stay in Kabinet.
      
    } catch (err) {
      console.error('Error deleting ad:', err);
      // Revert UI if RLS failed
      setMyAds(previousAds);
      alert("Xəta: Elanı silmək mümkün olmadı. (Böyük ehtimal Supabase icazəsi yoxdur)");
    }
  };"""

text = text.replace(old_delete, new_delete)

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(text)
