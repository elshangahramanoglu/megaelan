export const BAD_WORDS = [
  // AZ
  "göt", "gijdillaq", "gijdıllaq", "cindir", "cındır", "peyser", "peysər", "amciq", "amcıq", 
  "pox", "sikis", "sikiş", "qehbe", "qəhbə", "petux", "zorlama", "sik", "dalbayob", 
  "peys", "qanciq", "qancıq", "ambal", "got", "blat", "blət", "söyüş", "scam", "saxta",
  
  // TR
  "amk", "amina", "amına", "siktir", "orospu", "pic", "piç", "yarrak", "yarak", "gavat", 
  "kahpe", "yavsak", "yavşak", "ibne", "oc", "o.c", "sikik", "dalyarak", "amcik",
  
  // EN
  "fuck", "shit", "bitch", "asshole", "cunt", "dick", "porn", "porno", "sex", "nigger", 
  "nigga", "slut", "whore", "cock", "pussy", "motherfucker", "bastard", "wanker",
  
  // RU
  "хуй", "пизда", "ебать", "блядь", "сука", "шлюха", "порно", "секс", "еблан", 
  "пидор", "пидорас", "мудак", "гандон", "говно", "залупа", "манда", "хуйня"
];

// Helper to normalize and check for bad words
export const containsProfanity = (text: string): boolean => {
  if (!text) return false;
  
  // Normalize text (lowercase, remove punctuation)
  let normalized = text.toLowerCase();
  
  // Basic punctuation removal to avoid things like "f.u.c.k" or "s!k"
  // Keep letters (including az, tr, ru specific chars)
  normalized = normalized.replace(/[^\w\sа-яёşğüöçıə]/gi, '');
  
  const words = normalized.split(/\s+/);
  
  for (const word of words) {
    // Exact match or substring match for certain severe roots
    for (const bad of BAD_WORDS) {
      if (word === bad) return true;
      
      // Some words are roots and any word containing them is bad
      const roots = ["sikiş", "siktir", "qəhbə", "orospu", "yarrak", "хуй", "пизд", "ебат", "бляд"];
      if (roots.includes(bad) && word.includes(bad)) return true;
    }
  }
  
  return false;
};
