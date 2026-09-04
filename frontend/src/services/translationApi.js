const API_URL = 'https://api.mymemory.translated.net/get';
const CACHE_KEY = 'aureliaMenuTranslationsV1';

const readCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
  catch { return {}; }
};

const translateText = async (text, language, cache) => {
  if (!text || language === 'bg') return text;
  const key = `${language}:${text}`;
  if (cache[key]) return cache[key];
  const params = new URLSearchParams({ q: text, langpair: `bg|${language}`, mt: '1' });
  const response = await fetch(`${API_URL}?${params}`);
  if (!response.ok) throw new Error('Translation service unavailable');
  const result = await response.json();
  const translated = result.responseData?.translatedText;
  if (!translated) throw new Error('Missing translation');
  cache[key] = translated;
  return translated;
};

export const translateMenu = async (menu, language) => {
  if (language === 'bg') return menu;
  const cache = readCache();
  const texts = [...new Set(menu.flatMap((category) => [
    category.name, category.description,
    ...category.dishes.flatMap((dish) => [
      dish.name, dish.description, ...(dish.allergens || []), ...(dish.dietaryTags || []),
    ]),
  ]).filter(Boolean))];
  const pairs = await Promise.all(texts.map(async (text) => {
    try { return [text, await translateText(text, language, cache)]; }
    catch { return [text, text]; }
  }));
  const lookup = Object.fromEntries(pairs);
  const translated = menu.map((category) => ({
    ...category,
    name: lookup[category.name] || category.name,
    description: lookup[category.description] || category.description,
    dishes: category.dishes.map((dish) => ({
      ...dish,
      name: lookup[dish.name] || dish.name,
      description: lookup[dish.description] || dish.description,
      allergens: (dish.allergens || []).map((item) => lookup[item] || item),
      dietaryTags: (dish.dietaryTags || []).map((item) => lookup[item] || item),
    })),
  }));
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {}
  return translated;
};
