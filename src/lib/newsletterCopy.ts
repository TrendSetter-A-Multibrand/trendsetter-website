/**
 * The words the subscribe plane carried before the redesign. The home story still
 * holds them, written by the first seed, and they are not an editor's choice but
 * the old default; the file's own - "новое — первыми" - stands in for them until
 * someone writes something else. Anything that is not exactly these is the
 * editor's and stays.
 */
const OLD_HEADINGS = ["Подпишитесь на наши новости"];
const OLD_DESCRIPTIONS = [
  "Будьте в числе первых, кто узнает о новинках,\nраспрождажах и интересных новостях TRENDSETTER!",
  "Будьте в числе первых, кто узнает о новинках, распродажах и интересных новостях TRENDSETTER!",
];

const same = (value: string | undefined, olds: string[]) =>
  value !== undefined && olds.some((old) => old.replace(/\s+/g, " ") === value.replace(/\s+/g, " ").trim());

/** What an old default has turned into: nothing, so the component's own words apply. */
export function newsletterCopy(heading?: string, description?: string) {
  return {
    heading: same(heading, OLD_HEADINGS) ? undefined : heading,
    description: same(description, OLD_DESCRIPTIONS) ? undefined : description,
  };
}
