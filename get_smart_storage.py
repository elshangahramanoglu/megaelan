import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

# Add a smart filter for storage options based on model
smart_filter_code = """
                // Smart Filter for Storage based on Model (iPhone examples)
                if (field.name === 'storage' && dynamicDetails.brand === 'Apple' && dynamicDetails.model) {
                  const model = dynamicDetails.model;
                  if (model.includes('15 Pro Max') || model.includes('16 Pro Max')) {
                    currentOptions = currentOptions?.filter(o => !['32 GB', '64 GB', '128 GB'].includes(o));
                  } else if (model.includes('15') || model.includes('14') || model.includes('13')) {
                    currentOptions = currentOptions?.filter(o => !['32 GB', '64 GB'].includes(o));
                  } else if (model.includes('12') || model.includes('11')) {
                    currentOptions = currentOptions?.filter(o => !['32 GB'].includes(o));
                  }
                }
"""

target = "                let currentOptions = field.options;"
text = text.replace(target, target + smart_filter_code)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
