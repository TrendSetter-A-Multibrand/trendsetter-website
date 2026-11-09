/**
 * Gives every shop of "Планы магазинов" in the Пространство story that has no
 * zones the zones of the first shop, so none of them stands empty until its own
 * plan is drawn. A shop with zones of its own is left alone.
 *
 * node --env-file=.env.local scripts/storyblok-fill-store-zones.mts          # dry run
 * node --env-file=.env.local scripts/storyblok-fill-store-zones.mts --apply  # writes and publishes
 */
import { randomUUID } from "node:crypto";
import { api } from "./mapi.mjs";

type Blok = { _uid: string; component: string; plans?: Blok[]; zones?: Blok[]; [key: string]: unknown };

const { stories } = await api("/stories?with_slug=company/space");
const { story } = await api(`/stories/${stories[0].id}`);
const holders = (story.content.body as Blok[]).filter((blok) => blok.component === "store_plans");

let changed = 0;
for (const holder of holders) {
  const [first, ...rest] = holder.plans ?? [];
  if (!first?.zones?.length) continue;
  for (const plan of rest) {
    if (plan.zones?.length) continue;
    plan.zones = first.zones.map((zone) => ({ ...zone, _uid: randomUUID() }));
    console.log(`• ${plan.title}: зон ${plan.zones.length}`);
    changed++;
  }
}
if (!changed) {
  console.log("Менять нечего");
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
