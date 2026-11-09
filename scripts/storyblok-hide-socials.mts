/**
 * Hides (or brings back) social links in the "settings" story by setting their
 * "Скрыть временно" switch, and touches nothing else. The editor can do the same
 * by hand in the story; this is for doing it from a terminal.
 *
 * Needs the `hidden` field in the schema first (npm run storyblok:push).
 *
 * node --env-file=.env.local scripts/storyblok-hide-socials.mts VK MAX          # dry run: hide these
 * node --env-file=.env.local scripts/storyblok-hide-socials.mts VK MAX --apply  # writes and publishes
 * node --env-file=.env.local scripts/storyblok-hide-socials.mts VK --show --apply  # brings it back
 */
import { api } from "./mapi.mjs";

const args = process.argv.slice(2);
const names = args.filter((arg) => !arg.startsWith("--")).map((name) => name.toLowerCase());
const hide = !args.includes("--show");
if (!names.length) {
  console.error("Назовите соцсети: VK MAX ...");
  process.exit(1);
}

const { stories } = await api("/stories?with_slug=settings");
const { story } = await api(`/stories/${stories[0].id}`);
const socials = story.content.socials as { label: string; hidden?: boolean }[];

let changed = 0;
for (const social of socials) {
  if (!names.includes(social.label.trim().toLowerCase())) continue;
  if ((social.hidden === true) === hide) continue;
  console.log(`• ${social.label}: hidden -> ${hide}`);
  social.hidden = hide;
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
