import re
import glob

files = ["src/app/elan/[id]/page.tsx", "src/app/page.tsx", "src/app/kateqoriya/[id]/page.tsx"]

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()
    
    # We want to replace {ad.imagePlaceholder} inside the image divs with an image tag if it's a URL
    # Look for {ad.imagePlaceholder}
    
    new_image_logic = """{ad.imagePlaceholder.startsWith('http') ? (
              <img src={ad.imagePlaceholder} alt={ad.title} className="w-full h-full object-cover" />
            ) : (
              ad.imagePlaceholder
            )}"""
            
    content = content.replace("{ad.imagePlaceholder}", new_image_logic)
    
    with open(file_path, "w") as f:
        f.write(content)
