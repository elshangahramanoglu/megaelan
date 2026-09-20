with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

old_fields_loop = """              {selectedCategory.fields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-bold text-black mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={dynamicDetails[field.name] || ""}
                      onChange={(e) => handleDetailChange(field.name, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-black font-medium"
                    >
                      <option value="">Seçilməyib</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder || ""}
                      value={dynamicDetails[field.name] || ""}
                      onChange={(e) => handleDetailChange(field.name, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none text-black font-medium"
                    />
                  )}
                </div>
              ))}"""

new_fields_loop = """              {selectedCategory.fields.map(field => {
                // Dependency check: if it depends on another field, check if that field has a value
                if (field.dependsOn) {
                  const dependentValue = dynamicDetails[field.dependsOn];
                  if (!dependentValue) return null; // Don't render until parent is selected
                }
                
                // Get options either from standard options or dynamicOptions based on parent value
                let currentOptions = field.options;
                if (field.dependsOn && field.dynamicOptions) {
                  const parentVal = dynamicDetails[field.dependsOn];
                  currentOptions = field.dynamicOptions[parentVal] || ["Digər"];
                }

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-bold text-black mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        value={dynamicDetails[field.name] || ""}
                        onChange={(e) => handleDetailChange(field.name, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white text-black font-medium"
                      >
                        <option value="">Seçilməyib</option>
                        {currentOptions?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder || ""}
                        value={dynamicDetails[field.name] || ""}
                        onChange={(e) => handleDetailChange(field.name, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-300 focus:ring-blue-600 focus:border-blue-600 outline-none text-black font-medium"
                      />
                    )}
                  </div>
                );
              })}"""

text = text.replace(old_fields_loop, new_fields_loop)

# Also, reset child fields when a parent field changes
old_detail_change = """  const handleDetailChange = (name: string, value: string) => {
    setDynamicDetails(prev => ({ ...prev, [name]: value }));
  };"""

new_detail_change = """  const handleDetailChange = (name: string, value: string) => {
    setDynamicDetails(prev => {
      const newDetails = { ...prev, [name]: value };
      // If a parent field like 'brand' changes, reset its dependent 'model' field
      selectedCategory.fields.forEach(field => {
        if (field.dependsOn === name) {
          newDetails[field.name] = "";
        }
      });
      return newDetails;
    });
  };"""

text = text.replace(old_detail_change, new_detail_change)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
