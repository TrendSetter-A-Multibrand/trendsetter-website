/**
 * Hanging prepositions and conjunctions (the brief of 06.11): a short word - «а», «и»,
 * «в», «на», «для» - must not be left at the end of a line, so it is tied to the
 * word after it with a non-breaking space and travels to the next line with it.
 * The same goes for a number and its unit («2 магазина»), and a dash is kept
 * from starting a line («слово — слово»: the space before it does not break).
 */
const NBSP = " ";

/** A Cyrillic word of one to three letters, after the start of the text or a space or an opening mark. */
const SHORT_WORD = /(^|[\s(«"„“—–-])([А-Яа-яЁё]{1,3}) (?=\S|$)/g;
const NUMBER_UNIT = /(\d) (?=[А-Яа-яЁёA-Za-z%°])/g;
const BEFORE_DASH = / ([—–])(?=[  ]|$)/g;

export function bindShortWords(text: string): string {
  let out = text;
  // Twice: «и в магазинах» - the first pass ties «и», and the second sees «в» now that «и» is no longer a plain space
  for (let pass = 0; pass < 2; pass++) {
    out = out.replace(SHORT_WORD, (_, before: string, word: string) => `${before}${word}${NBSP}`);
  }
  return out.replace(NUMBER_UNIT, `$1${NBSP}`).replace(BEFORE_DASH, `${NBSP}$1`);
}
