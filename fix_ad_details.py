with open("src/app/elan/[id]/page.tsx", "r") as f:
    text = f.read()

# Fix Image Gallery rendering
old_img_gallery = """          <div className="bg-gray-100 rounded-3xl aspect-[4/3] flex items-center justify-center text-gray-400 text-2xl font-bold border border-gray-200 relative overflow-hidden group">
            {ad.imagePlaceholder.startsWith('http') ? (
              <img src={ad.imagePlaceholder} alt={ad.title} className="w-full h-full object-cover" />
            ) : (
              ad.imagePlaceholder
            )}"""

new_img_gallery = """          {/* Image Gallery */}
          <div className="bg-gray-100 rounded-3xl aspect-[4/3] flex flex-col items-center justify-center text-gray-400 text-2xl font-bold border border-gray-200 relative overflow-hidden group">
            {(ad.images && ad.images.length > 0) ? (
              <div className="w-full h-full relative flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                {ad.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`${ad.title} - ${idx+1}`} className="w-full h-full object-cover shrink-0 snap-center" />
                ))}
              </div>
            ) : ad.imagePlaceholder.startsWith('http') ? (
              <img src={ad.imagePlaceholder} alt={ad.title} className="w-full h-full object-cover" />
            ) : (
              ad.imagePlaceholder
            )}"""

text = text.replace(old_img_gallery, new_img_gallery)

# Fix pagination text for gallery
old_pagination = """<div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
              1 / 5
            </div>"""

new_pagination = """<div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm z-10 pointer-events-none">
              {(ad.images && ad.images.length > 0) ? `${ad.images.length} şəkil` : "1 / 1"}
            </div>"""

text = text.replace(old_pagination, new_pagination)

# Fix sidebar sticky and z-index issues
old_sidebar_wrapper = """{/* Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Contact Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-[100px]">"""

new_sidebar_wrapper = """{/* Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 relative">
          {/* Contact Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-[100px] z-10">"""

text = text.replace(old_sidebar_wrapper, new_sidebar_wrapper)

with open("src/app/elan/[id]/page.tsx", "w") as f:
    f.write(text)

