// ===================================================
// MEGAELAN — Advanced Multi-Language Profanity Filter
// Supports: Azerbaijani, Turkish, Russian, English + dialect
// Features: Root matching, obfuscation bypass (s!k, si k, s1k), leet-speak
// ===================================================

// Normalize obfuscation tricks: leetspeak, spacer tricks, symbols replacing letters
function normalizeText(text: string): string {
  let t = text.toLowerCase();

  // Leet-speak number substitutions
  t = t.replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
       .replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
       .replace(/8/g, 'b').replace(/\$/g, 's').replace(/@/g, 'a')
       .replace(/!/g, 'i').replace(/\+/g, 't');

  // Remove diacritics / alternative chars, normalize AZ/TR special chars
  t = t.replace(/ə/g, 'e').replace(/ğ/g, 'g').replace(/ı/g, 'i')
       .replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's')
       .replace(/ç/g, 'c').replace(/â/g, 'a').replace(/î/g, 'i');

  // Strip non-word chars except spaces (removes dots, dashes used to split words like "s.i.k")
  t = t.replace(/[^a-z0-9а-яё\s]/g, '');

  // Collapse repeated spaces
  t = t.replace(/\s+/g, ' ').trim();

  return t;
}

// BAD WORD ROOTS — any word containing these roots is flagged
// These are the most critical and abuse-prone patterns
const BAD_ROOTS: string[] = [
  // AZ roots
  'sik', 'got', 'amciq', 'amcik', 'qehbe', 'qanciq', 'peyser', 'cindir',
  'gijdillaq', 'gijdillak', 'dalbayob', 'pox',

  // TR roots
  'siktir', 'orospu', 'yarrak', 'yarak', 'amina', 'sikik', 'dalyarak',
  'amcik', 'kahpe', 'gavat', 'ibne', 'yavşak', 'yavsak', 'piç', 'pic',

  // EN roots
  'fuck', 'shit', 'bitch', 'cunt', 'porn', 'nigger', 'nigga',
  'slut', 'whore', 'cock', 'pussy', 'motherfuck', 'wank',
  'asshole', 'bastard',

  // RU roots
  'хуй', 'пизд', 'ебат', 'бляд', 'сук', 'шлюх', 'порно', 'пидор',
  'мудак', 'гандон', 'залуп', 'манд', 'ёбан', 'еблан',
];

// EXACT BAD WORDS — checked as whole words only (to avoid false positives)
const EXACT_BAD_WORDS: string[] = [
  // AZ
  'sik', 'got', 'pox', 'blat', 'blet',

  // TR
  'amk', 'pic', 'oc', 'ibne', 'gavat',

  // EN
  'sex', 'dick', 'ass',

  // RU
  'сука', 'хуй', 'секс',
];

export const containsProfanity = (text: string): boolean => {
  if (!text || text.trim().length === 0) return false;

  const normalized = normalizeText(text);

  // 1. Check entire text (not split) for root matches — catches joined/spacer tricks
  for (const root of BAD_ROOTS) {
    const normalizedRoot = normalizeText(root);
    if (normalized.replace(/\s/g, '').includes(normalizedRoot)) return true;
    // also check with spaces collapsed
    if (normalized.includes(normalizedRoot)) return true;
  }

  // 2. Per-word exact match
  const words = normalized.split(/\s+/);
  for (const word of words) {
    for (const exact of EXACT_BAD_WORDS) {
      if (word === normalizeText(exact)) return true;
    }
  }

  return false;
};
