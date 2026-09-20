import re

with open("src/app/kabinet/page.tsx", "r") as f:
    text = f.read()

bot_simulation_code = """
  // Simulated AI Moderation Bot (checks pending ads and approves them after 1 minute)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(async () => {
      const pendingAds = myAds.filter(ad => ad.status === 'pending');
      
      for (const ad of pendingAds) {
        const adTime = new Date(ad.created_at).getTime();
        const now = new Date().getTime();
        const diffInMinutes = (now - adTime) / 1000 / 60;
        
        if (diffInMinutes >= 1) {
          // Time to approve!
          await supabase.from('ads').update({ status: 'active' }).eq('id', ad.id);
          // Refresh list silently
          fetchMyAds();
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [myAds, user]);
"""

# Insert after fetchMyAds effect
target = "  }, [activeTab]);"
text = text.replace(target, target + "\n" + bot_simulation_code)

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(text)
