/**
 * Turns the home hero's "Только первый экран, без слайдов" switch on or off in
 * the home story and touches nothing else.
 *
 * node --env-file=.env.local scripts/storyblok-hero-only-first.mts          # dry run: switch on
 * node --env-file=.env.local scripts/storyblok-hero-only-first.mts --apply  # writes and publishes
 * node --env-file=.env.local scripts/storyblok-hero-only-first.mts --off --apply
 */
import { api } from "./mapi.mjs";

const args = process.argv.slice(2);
const on = !args.includes("--off");

const { stories } = await api("/stories?with_slug=home");
const { story } = await api(`/stories/${stories[0].id}`);
const heroes = (story.content.body as { component: string; only_first?: boolean }[]).filter(
  (blok) => blok.component === "hero",
);
if (!heroes.length) {
  console.error("В главной нет блока hero");
  process.exit(1);
}
let changed = 0;
for (const hero of heroes) {
  if ((hero.only_first === true) === on) continue;
  console.log(`• hero: only_first -> ${on}`);
  hero.only_first = on;
  changed++;
}
if (!changed) {
  console.log("Менять нечего");
  process.exit(0);
}
if (!args.includes("--apply")) {
  console.log("Пробный запуск. Записать: --apply");
  process.exit(0);
}
await api(`/stories/${story.id}`, {
  method: "PUT",
  body: JSON.stringify({
    story: { name: story.name, slug: story.slug, content: story.content, parent_id: story.parent_id },
    publish: 1,
  }),
});
console.log("Записано и опубликовано");
