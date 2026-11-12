/**
 * A short, careful check for obscene Russian words in what a visitor types.
 * It works on whole words (each one cleaned of look-alike Latin letters and
 * stretched letters) and on the well-known roots only, so ordinary words that
 * merely contain the same letters - "потребитель", "хулиган", "небо" - pass.
 * It cannot catch everything and is not meant to: it stops the plain cases.
 */

const LATIN_TO_CYRILLIC: Record<string, string> = {
  a: "а",
  b: "в",
  c: "с",
  e: "е",
  h: "н",
  k: "к",
  m: "м",
  o: "о",
  p: "р",
  t: "т",
  x: "х",
  y: "у",
};

const PREFIX = "(?:за|вы|на|по|у|о|от|до|про|раз|об|при|съ|с|под|подъ|пере|недо)?";

const ROOTS: RegExp[] = [
  new RegExp(`^${PREFIX}ху(?:й|и|е|ё|я|ю)`),
  /^(?:вы|на|по|раз|от|рас)?пизд/,
  new RegExp(`^${PREFIX}еб(?:а|у|и|ы|е|ё|л|н|о)`),
  /^бл(?:я|е)(?:д|т)/,
  /^бля$/,
  /^муд(?:ак|ил|оз)/,
  /^пид(?:о|а)р/,
  /^(?:га|го)ндон/,
  /^залуп/,
  /^шлюх/,
  /^сучар/,
  /^сук(?:а|и|у|е|ой)$/,
];

/** Lower case, "ё" as "е" is not needed (roots list both), Latin look-alikes turned to Cyrillic, "ууу" cut to one letter. */
function clean(word: string): string {
  return word
    .toLowerCase()
    .replace(/[a-z]/g, (ch) => LATIN_TO_CYRILLIC[ch] ?? ch)
    .replace(/(.)\1{2,}/g, "$1");
}

export function hasProfanity(text: string): boolean {
  return text
    .split(/[^\p{L}]+/u)
    .filter(Boolean)
    .some((word) => {
      const w = clean(word);
      return ROOTS.some((root) => root.test(w));
    });
}
