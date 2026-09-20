import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

# Remove the text line
text = text.replace('<p className="text-sm text-gray-600 mt-2 font-medium">Müvəqqəti pulsuz elan üçün <span className="text-black font-bold">0</span> yaza bilərsiniz.</p>', '')

# Update min="0" to min="1" and placeholder="0" to placeholder="1"
text = text.replace('min="0"', 'min="1"')
text = text.replace('placeholder="0"', 'placeholder="1"')

# Update validation in handleSubmit
val_check_old = """    if (!formData.title || !formData.price || !formData.city || !formData.description || !formData.contactName || !formData.contactPhone) {
      alert("Zəhmət olmasa bütün vacib xanaları (*) doldurun.");
      return;
    }"""

val_check_new = """    if (!formData.title || !formData.price || !formData.city || !formData.description || !formData.contactName || !formData.contactPhone) {
      alert("Zəhmət olmasa bütün vacib xanaları (*) doldurun.");
      return;
    }
    
    if (Number(formData.price) < 1) {
      alert("Qiymət minimum 1 AZN olmalıdır.");
      return;
    }"""

text = text.replace(val_check_old, val_check_new)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
