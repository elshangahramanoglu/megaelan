with open("src/app/kabinet/page.tsx", "r") as f:
    text = f.read()

# Fix JSX
text = text.replace("<Edit3, CreditCard ", "<Edit3 ")

# Fix Import
if "import { Edit3, CreditCard, CreditCard" in text:
    text = text.replace("import { Edit3, CreditCard, CreditCard", "import { Edit3, CreditCard")
elif "Edit3, CreditCard" not in text.split("from 'lucide-react'")[0]:
    # if it's completely messed up
    text = text.replace("import { ExternalLink, Loader2, Edit3, CreditCard } from 'lucide-react';", "import { ExternalLink, Loader2, Edit3, CreditCard, Trash2 } from 'lucide-react';")

with open("src/app/kabinet/page.tsx", "w") as f:
    f.write(text)
