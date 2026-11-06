/**
 * Writes the social links' addresses into the "settings" story and touches nothing else.
 *
 * node --env-file=.env.local scripts/storyblok-set-socials.mts          # dry run
 * node --env-file=.env.local scripts/storyblok-set-socials.mts --apply  # writes and publishes
 */
import { api } from "./mapi.mjs";

const ADDRESSES: Record<string, string> = {
  telegram: "https://t.me/trendsetter_russia",
  wildberries: "https://www.wildberries.ru/seller/trendsetter",
};

const { stories } = await api("/stories?with_slug=settings");
const { story } = await api(`/stories/${stories[0].id}`);
const socials = story.content.socials as { label: string; href: string }[];

let changed = 0;
for (const social of socials) {
  const href = ADDRESSES[social.label.trim().toLowerCase()];
  if (href && social.href !== href) {
    console.log(`• ${social.label}: ${social.href} -> ${href}`);
    social.href = href;
    changed++;
  }
}
if (!changed) {
  console.log("Адреса уже стоят");
  process.exit(0);
}
if (!process.argv.includes("--apply")) {
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
