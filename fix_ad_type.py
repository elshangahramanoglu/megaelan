with open("src/context/AppContext.tsx", "r") as f:
    text = f.read()

text = text.replace("imagePlaceholder: string;", "imagePlaceholder: string;\\n  images?: string[];")

with open("src/context/AppContext.tsx", "w") as f:
    f.write(text)
