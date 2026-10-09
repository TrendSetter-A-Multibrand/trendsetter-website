/**
 * Gives every brand a brand_store row for every shop: the sheet lists all the
 * shops, and an editor should see a row for each one rather than guess which
 * are missing. Rows a brand already has, and every other field, are left alone.
 *
 * A story that was published with no unpublished edits is published again after
 * the change; any other story is saved as a draft, so that nothing half-written
 * goes live. Those drafts are listed at the end.
 *
 * It only reports unless asked:
 *   node --env-file=.env.local scripts/storyblok-migrate-brand-stores.mts          (dry run)
 *   node --env-file=.env.local scripts/storyblok-migrate-brand-stores.mts --apply  (writes)
 */
import { api, block } from "./mapi.mjs";

const apply = process.argv.includes("--apply");

async function all(query: string) {
  const found: Record<string, any>[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (let page = 1; ; page++) {
    const { stories } = await api(`/stories?${query}&per_page=100&page=${page}`);
    found.push(...stories);
    if (stories.length < 100) return found;
  }
}

// The list's content_type filter is not trusted (it returns every story): the
// shops and brands are the stories in their own folders, and the brand's own
// component is checked again below before anything is written.
const shops = (await all("starts_with=stores/")).filter(
  (story) => !story.is_folder && story.full_slug.startsWith("stores/")
);
const brands = (await all("starts_with=brands/")).filter(
  (story) => !story.is_folder && story.full_slug.startsWith("brands/")
);
console.log(`${apply ? "ЗАПИСЬ" : "dry-run"}: магазинов ${shops.length}, брендов ${brands.length}`);

const asDraft: string[] = [];
let changed = 0;

for (const summary of brands) {
  const { story } = await api(`/stories/${summary.id}`);
  if (story.content.component !== "brand") continue;
  const rows: { store?: string }[] = story.content.availability ?? [];
  const have = new Set(rows.map((row) => row.store));
  const missing = shops.filter((shop) => !have.has(shop.uuid));

  if (missing.length === 0) continue;
  changed++;

  const publish = story.published && !story.unpublished_changes;
  console.log(
    `${story.full_slug}: +${missing.map((shop) => shop.name).join(", ")} (${publish ? "публикуется" : "черновик"})`
  );
  if (!publish) asDraft.push(story.full_slug);
  if (!apply) continue;

  const availability = [
    ...rows,
    ...missing.map((shop) => block("brand_store", { store: shop.uuid, available: true })),
  ];
  await api(`/stories/${story.id}`, {
    method: "PUT",
    body: JSON.stringify({
      story: { content: { ...story.content, availability } },
      ...(publish ? { publish: 1 } : {}),
    }),
  });
}

console.log(`Брендов к изменению: ${changed}`);
if (asDraft.length) {
  console.log("Остались черновиком (были не опубликованы или с правками):");
  for (const slug of asDraft) console.log(`  ${slug}`);
}
if (!apply) console.log("Ничего не записано. Для записи: --apply");
