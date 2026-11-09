/**
 * Puts the "Планы магазинов" block - the three shops as an accordion, the first
 * with the file's thirteen zones - into the Пространство story, right after the
 * tiles, so the editor can change them there. A story that already has a plan
 * block is left as it is.
 *
 * node --env-file=.env.local scripts/storyblok-seed-store-plans.mts          # dry run
 * node --env-file=.env.local scripts/storyblok-seed-store-plans.mts --apply  # writes and publishes
 */
import { randomUUID } from "node:crypto";
import { STORE_PLAN } from "../src/lib/fallbackPages.ts";
import { api } from "./mapi.mjs";

type Blok = { _uid: string; component: string; [key: string]: unknown };
const fresh = (blok: Blok): Blok =>
  Object.fromEntries(
    Object.entries(blok).map(([key, value]) => [
      key,
      key === "_uid"
        ? randomUUID()
        : Array.isArray(value)
          ? value.map((item) => (item && typeof item === "object" ? fresh(item as Blok) : item))
          : value,
    ]),
  ) as Blok;

const { stories } = await api("/stories?with_slug=company/space");
const { story } = await api(`/stories/${stories[0].id}`);
const body = story.content.body as Blok[];

if (body.some((blok) => blok.component === "store_plan" || blok.component === "store_plans")) {
  console.log("В Пространстве уже есть план магазина - не трогаю");
  process.exit(0);
}
const at = body.map((blok) => blok.component).lastIndexOf("space_cards");
if (at === -1) {
  console.error("В Пространстве нет блока space_cards");
  process.exit(1);
}
body.splice(at + 1, 0, fresh(STORE_PLAN as Blok));
console.log(`• планы магазинов вставлены после блока ${at + 1} (магазинов: ${(STORE_PLAN.plans as unknown[]).length})`);

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
