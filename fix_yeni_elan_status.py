with open("src/app/yeni-elan/page.tsx", "r") as f:
    text = f.read()

# Bad words dictionary
bad_words_logic = """
    // Basic AI Moderation: Text checking
    const badWords = ["söyüş", "pis söz", "porno", "scam", "saxta", "şiddət", "fuck", "bitch", "блядь", "сука", "qəhbə", "cındır"];
    const textToCheck = `${formData.title} ${formData.description}`.toLowerCase();
    
    let initialStatus = 'pending';
    if (badWords.some(word => textToCheck.includes(word))) {
      initialStatus = 'rejected';
      // In a real app we'd still let it insert but as rejected, 
      // or we can reject it right here before uploading images.
    }
    
    setIsSubmitting(true);
"""

old_is_submitting = "    setIsSubmitting(true);"
text = text.replace(old_is_submitting, bad_words_logic)

# Insert with the calculated status
old_insert = """          user_id: user.id,
          title: formData.title,"""
new_insert = """          user_id: user.id,
          title: formData.title,
          status: initialStatus,"""
text = text.replace(old_insert, new_insert)

with open("src/app/yeni-elan/page.tsx", "w") as f:
    f.write(text)
