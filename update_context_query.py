import re

with open("src/context/AppContext.tsx", "r") as f:
    text = f.read()

old_query = """        const { data: realAds, error } = await supabase
          .from('ads')
          .select('*')
          .order('created_at', { ascending: false });"""

new_query = """        const { data: realAds, error } = await supabase
          .from('ads')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });"""

text = text.replace(old_query, new_query)

with open("src/context/AppContext.tsx", "w") as f:
    f.write(text)
