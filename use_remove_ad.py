with open("src/app/kabinet/page.tsx", "r") as f:
    text = f.read()

# Update import line for AppContext
text = text.replace("const { user, updateUser, logout } = useAppContext();", "const { user, updateUser, logout, removeAd } = useAppContext();")

# Update delete logic
old_delete = """      // Also remove from global context so it instantly disappears from home page
      // @ts-ignore (we just force it for now since we don't have a removeAd function)
      const contextAds = JSON.parse(localStorage.getItem("megaelan_deleted_ads") || "[]");
      contextAds.push(adId);
      localStorage.setItem("megaelan_deleted_ads", JSON.stringify(contextAds));
      
      // Better yet, force a page reload if they want to see it gone from home, 
      // or we just let it be since they usually stay in Kabinet."""

new_delete = """      // Also remove from global context so it instantly disappears from home page
      removeAd(adId);"""
      
text = text.replace(old_delete, new_delete)

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(text)
