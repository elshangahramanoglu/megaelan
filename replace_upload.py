with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

old_block = """        {/* Images */}
        <div>
          <label className="block text-base font-bold text-black mb-2">Şəkillər (Min 1, Maks 10 şəkil) *</label>
          <div className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 transition-colors">
            <UploadCloud className="w-10 h-10 text-gray-500 mb-4" />
            <p className="text-black font-bold mb-1 text-lg">Şəkil yükləmək üçün klikləyin və ya sürüşdürüb buraxın</p>
            <p className="text-gray-600 text-sm font-medium">Hər şəkil üçün maksimum ölçü: 15MB. (Məsləhətlidir: üfüqi şəkillər)</p>
          </div>
        </div>"""

new_block = """        {/* Images */}
        <div>
          <label className="block text-base font-bold text-black mb-2">Şəkillər (Maks 10 şəkil) *</label>
          <label className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-gray-50 transition-colors relative">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFiles = Array.from(e.target.files).slice(0, 10);
                  setFiles(selectedFiles);
                }
              }}
            />
            <UploadCloud className="w-10 h-10 text-gray-500 mb-4" />
            <p className="text-black font-bold mb-1 text-lg">Şəkil yükləmək üçün bura klikləyin</p>
            <p className="text-gray-600 text-sm font-medium mb-4">Maksimum 10 şəkil icazə verilir.</p>
            
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {files.map((f, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-medium border border-blue-200">
                    {f.name.length > 15 ? f.name.substring(0,15) + '...' : f.name}
                  </span>
                ))}
              </div>
            )}
          </label>
        </div>"""

text = text.replace(old_block, new_block)

# And fix the submit button loading state
old_submit = """        <div className="pt-6 border-t border-gray-200">
          <button 
            type="submit"
            className="w-full md:w-auto px-12 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition-colors"
          >
            Elanı yerləşdir
          </button>
        </div>"""

new_submit = """        <div className="pt-6 border-t border-gray-200">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Elanı yerləşdir"}
          </button>
        </div>"""
text = text.replace(old_submit, new_submit)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)

