with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

import_lucide_old = 'import { UploadCloud, CheckCircle, Info, Plus, ArrowRight } from "lucide-react";'
import_lucide_new = 'import { UploadCloud, CheckCircle, Info, Plus, ArrowRight, Crown, Star } from "lucide-react";'

text = text.replace(import_lucide_old, import_lucide_new)

if 'import Link from "next/link";' not in text:
    text = text.replace('import { useRouter } from "next/navigation";', 'import { useRouter } from "next/navigation";\nimport Link from "next/link";')

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
