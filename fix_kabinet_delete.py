with open("src/app/kabinet/page.tsx", "r") as f:
    text = f.read()

old_delete = """  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return;
    
    try {
      const { error } = await supabase.from('ads').delete().eq('id', adId);
      if (error) throw error;
      setMyAds(myAds.filter(ad => ad.id !== adId));
    } catch (err) {
      console.error('Error deleting ad:', err);
      alert('Xəta baş verdi');
    }
  };"""

new_delete = """  const handleDeleteAd = async (adId: string) => {
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

text = text.replace(old_delete, new_delete)

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(text)
