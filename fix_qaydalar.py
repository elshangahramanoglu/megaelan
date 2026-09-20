import re

# Update Qaydalar Page
qaydalar_path = "src/app/qaydalar/page.tsx"
try:
    with open(qaydalar_path, "r") as f:
        text = f.read()
    
    # We will just inject the rules if the file exists
    if "Pulsuz Elanlar:" not in text:
        text = text.replace("MegaElan saytında elan yerləşdirərkən aşağıdakı qaydalara əməl etmək mütləqdir:", 
        "MegaElan saytında elan yerləşdirərkən aşağıdakı qaydalara əməl etmək mütləqdir:\n\n"
        "1. **Ödənişlər və Limmitlər:** Biz istifadəçilərimizə həm pulsuz, həm də ödənişli əlavə xidmətlər təqdim edirik.\n"
        "   - **Pulsuz Elanlar:** Hər bir istifadəçi hər kateqoriya üzrə ayda 3 dəfə pulsuz elan yerləşdirə bilər.\n"
        "   - **Limitin aşılması:** Əlavə 4-cü və ondan sonrakı hər elan üçün 3.00 AZN ödəniş tələb olunacaq.\n")
        
        with open(qaydalar_path, "w") as f:
            f.write(text)
except FileNotFoundError:
    pass

# Update Suallar Page
suallar_path = "src/app/suallar/page.tsx"
with open(suallar_path, "r") as f:
    text = f.read()

text = text.replace(
    "Siz hər ay müəyyən sayda pulsuz elan yerləşdirə bilərsiniz.", 
    "Siz hər ay hər kateqoriya üzrə 3 dəfə pulsuz elan yerləşdirə bilərsiniz. Bu limiti (3 elanı) keçdikdən sonra 4-cü və əlavə hər elan üçün 3.00 AZN xidmət haqqı tələb olunur."
)

with open(suallar_path, "w") as f:
    f.write(text)
