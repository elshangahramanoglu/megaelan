import re

with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

# 1. Remove 'required' from inputs
text = text.replace('required\n', '')
text = text.replace('required ', '')
text = text.replace(' required>', '>')

# 2. Add manual validation to handleSubmit
old_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {"""

new_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!formData.title || !formData.price || !formData.city || !formData.description || !formData.contactName || !formData.contactPhone) {
      alert("Zəhmət olmasa bütün vacib xanaları (*) doldurun.");
      return;
    }

    if (files.length === 0) {
      alert("Ən azı 1 şəkil yükləməyiniz mütləqdir!");
      return;
    }
    
    setIsSubmitting(true);
    
    try {"""

text = text.replace(old_submit, new_submit)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
