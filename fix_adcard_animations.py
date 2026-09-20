import re

with open("src/components/AdCard.tsx", "r") as f:
    text = f.read()

# Add user to useAppContext
if "const { favorites, toggleFavorite } = useAppContext();" in text:
    text = text.replace("const { favorites, toggleFavorite } = useAppContext();", "const { favorites, toggleFavorite, user } = useAppContext();")

# Add "Mənim elanım" badge and enhance animations
old_return = """  return (
    <Link 
      href={`/elan/${ad.id}`} 
      className="group cursor-pointer bg-white rounded-2xl flex flex-col hover:shadow-lg transition-shadow border border-gray-100 h-[320px] overflow-hidden"
    >
      <div className="h-44 bg-gray-100 relative w-full flex-shrink-0">"""

new_return = """  const isMine = user && ad.user_id === user.id;

  return (
    <Link 
      href={`/elan/${ad.id}`} 
      className="group cursor-pointer bg-white rounded-2xl flex flex-col hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 border border-gray-100 h-[320px] overflow-hidden relative"
    >
      <div className="h-44 bg-gray-100 relative w-full flex-shrink-0 overflow-hidden">
        {isMine && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-full z-20 shadow-md flex items-center gap-1">
             Mənim elanım
          </div>
        )}"""

if old_return in text:
    text = text.replace(old_return, new_return)
else:
    print("Could not find exact old_return string in AdCard")

with open("src/components/AdCard.tsx", "w") as f:
    f.write(text)
