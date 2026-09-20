with open("src/components/AdCard.tsx", "r") as f:
    text = f.read()

old_img_block = """        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium group-hover:scale-105 transition-transform duration-500">
          {ad.imagePlaceholder}
        </div>"""

new_img_block = """        {ad.imagePlaceholder.startsWith('http') ? (
          <img src={ad.imagePlaceholder} alt={ad.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium group-hover:scale-105 transition-transform duration-500">
            {ad.imagePlaceholder}
          </div>
        )}"""

text = text.replace(old_img_block, new_img_block)

with open("src/components/AdCard.tsx", "w") as f:
    f.write(text)
