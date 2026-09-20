import re

def update_watermark_error(filepath):
    with open(filepath, "r") as f:
        text = f.read()
    
    target = """      img.src = e.target?.result as string;"""
    new_target = """      img.onerror = () => {
        console.warn("Şəkil oxuna bilmədi (ola bilsin HEIC və ya dəstəklənməyən formatdır). Orijinal yüklənir.");
        resolve(file);
      };
      img.src = e.target?.result as string;"""
      
    if target in text:
        text = text.replace(target, new_target)
        with open(filepath, "w") as f:
            f.write(text)
        print(f"Updated {filepath}")
    else:
        print(f"Pattern not found in {filepath}")

update_watermark_error("src/app/yeni-elan/page.tsx")
update_watermark_error("src/app/redakte/[id]/page.tsx")
