import re

with open("src/app/elan/[id]/page.tsx", "r") as f:
    text = f.read()

# Remove the rest of the inline payment UI
remnant_1 = re.compile(r'          \{isOwner && showPromo && !paymentPlan && \(.*?\n          \)}', re.DOTALL)
text = remnant_1.sub('', text)

remnant_2 = re.compile(r'          \{isOwner && showPromo && paymentPlan && \(.*?\n          \)}', re.DOTALL)
text = remnant_2.sub('', text)

with open("src/app/elan/[id]/page.tsx", "w") as f:
    f.write(text)
