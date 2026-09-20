import re

with open("src/app/layout.tsx", "r") as f:
    text = f.read()

# Replace Right Side Links
old_right_side = """              {/* Right Side: Links (Side-by-side on mobile) */}
              <div className="flex flex-row gap-8 sm:gap-24 w-full md:w-auto md:justify-end">
                <div className="flex-1 md:flex-none">
                  <h3 className="font-bold text-base md:text-lg text-black mb-3 md:mb-4">MegaElan</h3>
                  <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-600 font-medium">
                    <li><Link href="/haqqimizda" className="hover:text-blue-600 transition-colors inline-block">Haqqımızda</Link></li>
                    <li><Link href="/elaqe" className="hover:text-blue-600 transition-colors inline-block">Əlaqə</Link></li>
                  </ul>
                </div>
                <div className="flex-1 md:flex-none">
                  <h3 className="font-bold text-base md:text-lg text-black mb-3 md:mb-4">Qaydalar & Hüquqi</h3>
                  <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-600 font-medium">
                    <li><Link href="/qaydalar" className="hover:text-blue-600 transition-colors inline-block">Qaydalar və Tariflər</Link></li>
                    <li><Link href="/suallar" className="hover:text-blue-600 transition-colors inline-block">Sual-Cavab</Link></li>
                    <li><Link href="/mexfilik" className="hover:text-blue-600 transition-colors inline-block">Məxfilik siyasəti</Link></li>
                    <li><Link href="/istifade" className="hover:text-blue-600 transition-colors inline-block">İstifadəçi razılaşması</Link></li>
                  </ul>
                </div>
              </div>"""

new_right_side = """              {/* Right Side: Links (Side-by-side on mobile) */}
              <div className="flex flex-row gap-8 sm:gap-24 w-full md:w-auto md:justify-end">
                <div className="flex-1 md:flex-none">
                  <h3 className="font-bold text-base md:text-lg text-black mb-3 md:mb-4">MegaElan</h3>
                  <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-600 font-medium">
                    <li><Link href="/haqqimizda" className="hover:text-blue-600 transition-colors inline-block">Haqqımızda</Link></li>
                    <li><Link href="/elaqe" className="hover:text-blue-600 transition-colors inline-block">Əlaqə</Link></li>
                    <li><Link href="/suallar" className="hover:text-blue-600 transition-colors inline-block">Sual-Cavab</Link></li>
                  </ul>
                </div>
                <div className="flex-1 md:flex-none">
                  <h3 className="font-bold text-base md:text-lg text-black mb-3 md:mb-4">Qaydalar & Hüquqi</h3>
                  <ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-600 font-medium">
                    <li><Link href="/qaydalar" className="hover:text-blue-600 transition-colors inline-block">Qaydalar və Tariflər</Link></li>
                    <li><Link href="/mexfilik" className="hover:text-blue-600 transition-colors inline-block">Məxfilik siyasəti</Link></li>
                    <li><Link href="/istifade" className="hover:text-blue-600 transition-colors inline-block">İstifadəçi razılaşması</Link></li>
                  </ul>
                </div>
              </div>"""

text = text.replace(old_right_side, new_right_side)

with open("src/app/layout.tsx", "w") as f:
    f.write(text)
