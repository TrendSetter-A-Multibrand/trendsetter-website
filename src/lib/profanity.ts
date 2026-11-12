/**
 * A short, careful check for obscene words in what a visitor types, Russian
 * and English. It works on whole words: the roots below catch the Russian
 * words with their prefixes and endings, the lists catch the exact words the
 * team added. Ordinary words that merely contain the same letters -
 * "потребитель", "хулиган", "небо", "class", "assess" - pass. It cannot catch
 * everything and is not meant to: it stops the plain cases.
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
  new RegExp(`^${PREFIX}ху(?:й|и|е|я|ю)`),
  /^(?:вы|на|по|раз|от|рас|с)?пизд/,
  new RegExp(`^${PREFIX}еб(?:а|у|и|ы|е|л|н|о)`),
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

/** The exact Russian words the team listed ("ё" and "е" are the same here). */
const RUSSIAN = `
блядь блять бля блядский блядство выблядок сука сучка сучара сукин хуй хуя хуем хуёвый хуевый хуйня хер нахуй нахуя
похуй похуист охуеть охуенный охуевший ахуеть хуесос хуеплёт хуеплет пизда пиздец пиздёж пиздеж пиздеть пиздобол
пиздатый пиздюк пиздюля пиздюли спиздить распиздяй ебать ебаться ебал ебала ебало ебаный ёбаный ебанный ебанутый
еблан ебучий ебливый ебля заебать заебал заебись заёбывать заебывать наебать наебал наебалово наёбка наебка
выебать выебываться уёбок уебок уёбище уебище долбоёб долбоеб дебил мудак мудила мудозвон мразь гандон гондон
залупа дрочить дрочила дрочер дрочёр говно говнюк говноед дерьмо жопа жопошник срать сраный засранец засранка
задрот шлюха шалава проститутка стерва
`;

/** The exact English words; several-word phrases are checked separately. */
const ENGLISH = `
fuck fucks fucked fucker fuckers fucking fuckin fuckoff fuckface fuckhead fuckwit fuckboy motherfucker motherfuckers
motherfucking mofo shit shits shitty shithead shitface shitbag shitshow bullshit horseshit batshit dipshit dumbshit
bitch bitches bitchy bitching bastard bastards ass asses asshole assholes arse arsehole jackass dumbass badass
smartass dick dicks dickhead cock cocks cocksucker cunt cunts twat prick pussy pussies wanker wank tosser bollocks
bugger bloody damn goddamn crap piss pissed slut sluts slutty whore whores hoe skank douche douchebag jerk jerkoff
stfu wtf fml lmfao
`;

const ENGLISH_PHRASES = ["son of a bitch", "piss off", "jerk off", "screw you", "screw off"];

const words = (list: string) => new Set(list.trim().split(/\s+/).map(unyo));

/** "ё" read as "е", so either spelling of a listed word matches. */
function unyo(word: string): string {
  return word.replace(/ё/g, "е");
}

const RUSSIAN_WORDS = words(RUSSIAN);
const ENGLISH_WORDS = words(ENGLISH);

/** Lower case, "ё" as "е", "ууу" cut to one letter. */
function squeeze(word: string): string {
  return unyo(word.toLowerCase()).replace(/(.)\1{2,}/g, "$1");
}

function russianObscene(word: string): boolean {
  // Latin look-alikes turned to Cyrillic, for "xуй" and the like
  const w = squeeze(word).replace(/[a-z]/g, (ch) => LATIN_TO_CYRILLIC[ch] ?? ch);
  return RUSSIAN_WORDS.has(w) || ROOTS.some((root) => root.test(w));
}

export function hasProfanity(text: string): boolean {
  const tokens = text.split(/[^\p{L}]+/u).filter(Boolean);
  const hit = tokens.some((word) => {
    if (/^[a-z]+$/i.test(word)) return ENGLISH_WORDS.has(squeeze(word));
    return russianObscene(word);
  });
  if (hit) return true;
  const spaced = ` ${tokens.join(" ").toLowerCase()} `;
  return ENGLISH_PHRASES.some((phrase) => spaced.includes(` ${phrase} `));
}
