export type Brand = {
  name: string;
  categories: string[];
  logo: string;
  image: string;
  description: string;
  stores: { name: string; available: boolean }[];
  /** The editor can hide the logo; a brand with none then has no empty slot. */
  showLogo: boolean;
  /**
   * The brand's own colour, the one its logo is drawn in - the sheet writes the
   * shop names in it. Every brand has its own and none of them is a style in the
   * file, so it arrives as data rather than as a token; the names fall back to
   * ink where a brand has none.
   */
  color?: string;
};

export const BRAND_CATEGORIES = [
  "Одежда",
  "Обувь",
  "Аксессуары",
  "Косметика",
  "Дом",
  "Еда",
  "Мужчинам",
  "Девушкам",
  "Детям",
];

export type Alphabet = "en" | "ru";

/** The bucket for digits - and, without a filter, for every other symbol. */
export const OTHER_KEY = "#";

const EN_LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
// А-Я is 32 letters; Ё is not among them and is filed under Е (see indexKey)
const RU_LETTERS = Array.from({ length: 32 }, (_, i) => String.fromCharCode(0x410 + i));

/** The row the directory draws for an alphabet, ending on the «#» bucket. */
export function alphabetLetters(alphabet: Alphabet) {
  return [...(alphabet === "ru" ? RU_LETTERS : EN_LETTERS), OTHER_KEY];
}

/**
 * Bucket a brand under its first character. Anything that is not a letter of
 * the alphabet in use - digits, symbols, the other script - lands in «#», so
 * that without a filter every brand still has a group to sit in.
 */
export function indexKey(name: string, alphabet: Alphabet = "en") {
  let first = name.trim().charAt(0).toUpperCase();
  // Ё (U+0401) sits outside А-Я (U+0410-042F)
  if (alphabet === "ru" && first === "Ё") first = "Е";
  return alphabetLetters(alphabet).includes(first) && first !== OTHER_KEY
    ? first
    : OTHER_KEY;
}

/** Whether a brand answers to a selected letter; «#» means digits only. */
export function matchesLetter(name: string, letter: string, alphabet: Alphabet) {
  if (letter === OTHER_KEY) return /^\d/.test(name.trim());
  return indexKey(name, alphabet) === letter;
}

export function filterBrands(
  brands: Brand[],
  {
    query = "",
    categories = [],
    letter = null,
    alphabet = "en",
  }: {
    query?: string;
    categories?: string[];
    letter?: string | null;
    alphabet?: Alphabet;
  }
) {
  const needle = query.trim().toLowerCase();
  return brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(needle) &&
      categories.every((category) => brand.categories.includes(category)) &&
      (letter === null || matchesLetter(brand.name, letter, alphabet))
  );
}

/** The letters that have at least one brand among these (for greying the rest). */
export function filledLetters(brands: Brand[], alphabet: Alphabet) {
  const filled = new Set<string>();
  for (const brand of brands) {
    const key = indexKey(brand.name, alphabet);
    // «#» as a filter holds digits only, so it is live only where one starts a name
    if (key !== OTHER_KEY) filled.add(key);
    else if (matchesLetter(brand.name, OTHER_KEY, alphabet)) filled.add(OTHER_KEY);
  }
  return filled;
}

/** Storyblok's boolean arrives as true/false or as the text of it; absent means shown. */
export function parseShowLogo(value: unknown) {
  return value !== false && value !== "false";
}

/**
 * Every shop, in the order given, with the brand's own mark where it has one.
 * A shop the brand has no row for counts as stocked: the default is that the
 * goods are there, and only an explicit "no" turns the marker red.
 */
export function brandStores(
  shops: { uuid: string; name: string }[],
  rows: { store?: string; available?: boolean | string }[]
) {
  return shops.map((shop) => {
    const row = rows.find((candidate) => candidate.store === shop.uuid);
    return {
      name: shop.name,
      available: row ? row.available !== false && row.available !== "false" : true,
    };
  });
}
