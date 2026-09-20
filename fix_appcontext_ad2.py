import re

with open("src/context/AppContext.tsx", "r") as f:
    text = f.read()

target = "  details?: Record<string, string>;"
new_target = "  details?: Record<string, string>;\n  user_id?: string;\n  status?: string;"

if target in text:
    text = text.replace(target, new_target)
    with open("src/context/AppContext.tsx", "w") as f:
        f.write(text)
        print("Updated")
else:
    print("Not found")
