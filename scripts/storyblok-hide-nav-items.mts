/**
 * Temporarily takes menu and footer entries off the site: sets `hidden: true` on
 * them in the "settings" story and touches nothing else. Nothing is deleted - the
 * editor un-ticks "Скрыть временно" to bring an entry back.
 *
 * Needs the `hidden` field in the schema first (npm run storyblok:push).
 *
 * node --env-file=.env.local scripts/storyblok-hide-nav-items.mts          # dry run: prints the diff
 * node --env-file=.env.local scripts/storyblok-hide-nav-items.mts --apply  # writes it
 */
import { api } from "./mapi.mjs";

const apply = process.argv.includes("--apply");

type Blok = { label?: string; slug?: string; path?: string; hidden?: boolean; [k: string]: unknown };

/** Top-level menu entries to hide, by slug. */
const NAV_TOP = ["loyalty", "gift-cards"];
/** Sub-entries to hide: parent slug -> child slugs ("*" is all of them). */
const NAV_CHILDREN: Record<string, string[] | "*"> = {
  journal: "*",
  company: ["cooperation", "careers", "feedback"],
};
/** Footer links to hide, in the column of this title. The [Сотрудничество] column is not touched. */
const FOOTER_COLUMN = "Компания";
const FOOTER_PATHS = ["company/cooperation", "company/careers", "company/feedback"];

const changes: string[] = [];

function mark(entry: Blok, where: string) {
  if (entry.hidden === true) return;
  entry.hidden = true;
  changes.push(`${where}: ${entry.label ?? entry.slug ?? entry.path} -> hidden: true`);
}

const { stories } = await api("/stories?with_slug=settings");
if (!stories[0]) {
  console.error("Сторис settings не найдена");
  process.exit(1);
}
const { story } = await api(`/stories/${stories[0].id}`);
const content = story.content as { nav?: Blok[]; footer_columns?: { title?: string; links?: Blok[] }[] };

for (const item of content.nav ?? []) {
  if (item.slug && NAV_TOP.includes(item.slug)) mark(item, "меню");
  const rule = item.slug ? NAV_CHILDREN[item.slug] : undefined;
  if (!rule) continue;
  for (const child of (item.children as Blok[] | undefined) ?? []) {
    if (rule === "*" || (child.slug && rule.includes(child.slug))) {
      mark(child, `меню / ${item.label}`);
    }
  }
}

for (const column of content.footer_columns ?? []) {
  if (column.title?.trim() !== FOOTER_COLUMN) continue;
  for (const link of column.links ?? []) {
    if (link.path && FOOTER_PATHS.includes(link.path.trim())) mark(link, `футер / ${column.title}`);
  }
}

if (!changes.length) {
  console.log("Нечего менять: всё уже скрыто или таких пунктов нет.");
  process.exit(0);
}
console.log(changes.join("\n"));

if (!apply) {
  console.log(`\nDry-run: ${changes.length} изменений. Для записи добавьте --apply`);
  process.exit(0);
}

// A story that was published stays published; a draft stays a draft.
await api(`/stories/${story.id}`, {
  method: "PUT",
  body: JSON.stringify({ story: { content }, ...(story.published ? { publish: 1 } : {}) }),
});
console.log(`\nЗаписано: ${changes.length} изменений в settings`);
