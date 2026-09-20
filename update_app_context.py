import re

with open("src/context/AppContext.tsx", "r") as f:
    text = f.read()

# 1. Add removeAd to context type
text = text.replace("addAd: (ad: Ad) => void;", "addAd: (ad: Ad) => void;\\n  removeAd: (id: string) => void;")

# 2. Add removeAd implementation
old_add = """  const addAd = (ad: Ad) => {
    setAds(prev => [ad, ...prev]);
  };"""

new_add = """  const addAd = (ad: Ad) => {
    setAds(prev => [ad, ...prev]);
  };

  const removeAd = (id: string) => {
    setAds(prev => prev.filter(ad => ad.id !== id));
  };"""
text = text.replace(old_add, new_add)

# 3. Add removeAd to Provider value
text = text.replace("addAd }}>", "addAd, removeAd }}>")

with open("src/context/AppContext.tsx", "w") as f:
    f.write(text)
