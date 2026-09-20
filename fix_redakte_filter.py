import re

with open("src/app/redakte/[id]/page.tsx", "r") as f:
    text = f.read()

# Add import
if 'import { applySmartFilters } from "@/lib/smartFilters";' not in text:
    text = text.replace('import { uploadImageToImgBB } from "@/lib/imgbb";', 'import { uploadImageToImgBB } from "@/lib/imgbb";\nimport { applySmartFilters } from "@/lib/smartFilters";')

# Replace old smart filter block
old_filter = """                // Smart Filter for Storage based on Model (iPhone examples)
                if (field.name === 'storage' && dynamicDetails.brand === 'Apple' && dynamicDetails.model) {
                  const model = dynamicDetails.model;
                  if (model.includes('15 Pro Max') || model.includes('16 Pro Max')) {
                    currentOptions = currentOptions?.filter(o => !['32 GB', '64 GB', '128 GB'].includes(o));
                  } else if (model.includes('15') || model.includes('14') || model.includes('13')) {
                    currentOptions = currentOptions?.filter(o => !['32 GB', '64 GB'].includes(o));
                  } else if (model.includes('12') || model.includes('11')) {
                    currentOptions = currentOptions?.filter(o => !['32 GB'].includes(o));
                  }
                }"""

new_filter = """                // Apply global smart filters for all categories
                currentOptions = applySmartFilters(field.name, currentOptions, dynamicDetails);"""

if old_filter in text:
    text = text.replace(old_filter, new_filter)
else:
    # If the exact old block wasn't found, find where to insert it
    target = """                if (field.dependsOn && field.dynamicOptions) {
                  const parentVal = dynamicDetails[field.dependsOn];
                  currentOptions = field.dynamicOptions[parentVal] || ["Digər"];
                }"""
    text = text.replace(target, target + "\n" + new_filter)


# Update Success Messages
text = text.replace("Elanınız uğurla yeniləndi!", "Elanınız yeniləndi (GÖZLƏMƏDƏ)!")
text = text.replace("Yenilənmiş elanınız yoxlanışa göndərildi və qısa zamanda saytda görünəcək. Daha çox alıcı tapmaq üçün elanınızı önə çəkə bilərsiniz.", "Elanınız avtomatik yoxlanışdan keçir (1 dəqiqə ərzində aktiv olacaq). Elanlar siyahısında izləyə bilərsiniz.")
text = text.replace("Elana bax", "Elanlarıma bax (Kabinet)")
text = text.replace("href={`/elan/${createdAdId}`}", "href={`/kabinet`}")


with open("src/app/redakte/[id]/page.tsx", "w") as f:
    f.write(text)
