import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

btn_old = """          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-12 py-4 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 transition-all duration-300 disabled:opacity-70 disabled:active:scale-100"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Yerləşdir"}
          </button>"""

btn_new = """          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-12 py-4 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 transition-all duration-300 disabled:opacity-70 disabled:active:scale-100"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : categoryAdCount >= 3 ? "Ödəniş et və Yerləşdir (3.00 ₼)" : "Yerləşdir"}
          </button>"""

text = text.replace(btn_old, btn_new)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
