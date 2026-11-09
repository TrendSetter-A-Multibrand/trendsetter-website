/**
 * Brings the two stories the redesign reads from into line with the file's
 * changes of 05.11-06.11, touching nothing else in them:
 *
 *  - "settings": the menu in the file's order (Бренды · Новости · Журнал ·
 *    События · Компания · Магазины · Контакты, the company's dropdown ending
 *    with «Частые вопросы»), «Wildberries» among the social links;
 *  - "home": the sections in the file's order (R46), the hero's second link
 *    «О нас» instead of «Читать журнал».
 *
 * Needs the schema first (npm run storyblok:push): the `wildberries` icon and
 * the hero's `slides` field are new. Hidden entries (loyalty, gift cards, the
 * journal's sub-sections, cooperation, feedback) keep their `hidden` mark.
 *
 * node --env-file=.env.local scripts/storyblok-redesign-1106.mts          # dry run: prints what changes
 * node --env-file=.env.local scripts/storyblok-redesign-1106.mts --apply  # writes it
 */
import { api, block } from "./mapi.mjs";

const apply = process.argv.includes("--apply");

type Blok = { _uid?: string; component?: string; label?: string; slug?: string; hidden?: boolean; [k: string]: unknown };

const changes: string[] = [];

async function load(slug: string) {
  const { stories } = await api(`/stories?with_slug=${slug}`);
  if (!stories[0]) {
    console.error(`Сторис ${slug} не найдена`);
    process.exit(1);
  }
  const { story } = await api(`/stories/${stories[0].id}`);
  return story as { id: number; name: string; slug: string; parent_id: number; content: Record<string, unknown> };
}

async function save(story: Awaited<ReturnType<typeof load>>) {
  await api(`/stories/${story.id}`, {
    method: "PUT",
    body: JSON.stringify({
      story: { name: story.name, slug: story.slug, content: story.content, parent_id: story.parent_id },
      publish: 1,
    }),
  });
}

// ---- settings: the menu and the social links ---------------------------------

const settings = await load("settings");
const nav = (settings.content.nav as Blok[]) ?? [];
const children = (entry: Blok | undefined) => (entry?.children as Blok[] | undefined) ?? [];

/** A top-level entry as it stands in the space, or a new one. Hidden marks are kept. */
const entry = (slug: string, label: string, kids?: Blok[]) => {
  const found = nav.find((item) => item.slug === slug);
  const next = found ?? block("nav_item", { label, slug, children: [] });
  if (kids) next.children = kids;
  return next as Blok;
};
const kid = (parent: Blok | undefined, slug: string, label: string) =>
  children(parent).find((child) => child.slug === slug) ?? block("nav_link", { label, slug });

const company = nav.find((item) => item.slug === "company");
const companyKids = [
  kid(company, "about", "О нас"),
  kid(company, "space", "Пространство"),
  kid(company, "collaborations", "Коллаборации"),
  kid(company, "cooperation", "Сотрудничество"),
  kid(company, "careers", "Вакансии"),
  kid(company, "/faq", "Частые вопросы"),
  kid(company, "feedback", "Обратная связь"),
];

const newNav: Blok[] = [
  entry("brands", "Бренды"),
  entry("news", "Новости"),
  entry("journal", "Журнал", children(nav.find((item) => item.slug === "journal"))),
  entry("events", "События"),
  entry("company", "Компания", companyKids),
  entry("stores", "Магазины"),
  entry("company/contacts", "Контакты"),
  ...["loyalty", "gift-cards"].map((slug) => nav.find((item) => item.slug === slug)).filter(Boolean) as Blok[],
];

const before = nav.map((item) => item.slug).join(" > ");
const after = newNav.map((item) => item.slug).join(" > ");
if (before !== after || JSON.stringify(children(company).map((c) => c.slug)) !== JSON.stringify(companyKids.map((c) => c.slug))) {
  settings.content.nav = newNav;
  changes.push(`settings.nav: ${before}  ->  ${after}; Компания: ${companyKids.map((c) => c.slug).join(", ")}`);
}

const socials = (settings.content.socials as Blok[]) ?? [];
if (!socials.some((social) => /wildberries/i.test(String(social.label)))) {
  socials.push(block("social_link", { label: "Wildberries", href: "#", icon: "wildberries" }));
  settings.content.socials = socials;
  changes.push("settings.socials: + Wildberries (ссылка # — впишет редактор)");
}

// ---- home: the sections' order and the hero's second link ---------------------

const home = await load("home");
const ORDER = ["hero", "categories_row", "news_row", "events_row", "season_wall", "journal_row", "stores_row", "newsletter"];
const body = (home.content.body as Blok[]) ?? [];
const rank = (item: Blok) => {
  const at = ORDER.indexOf(String(item.component));
  return at === -1 ? ORDER.indexOf("season_wall") - 0.5 : at;
};
const sorted = [...body].sort((a, b) => rank(a) - rank(b));
if (sorted.map((item) => item._uid).join() !== body.map((item) => item._uid).join()) {
  home.content.body = sorted;
  changes.push(`home.body: ${body.map((item) => item.component).join(" > ")}  ->  ${sorted.map((item) => item.component).join(" > ")}`);
}

const hero = sorted.find((item) => item.component === "hero");
if (hero && hero.secondary_label !== "О нас") {
  changes.push(`home.hero: вторая кнопка «${hero.secondary_label}» -> «О нас» (company/about)`);
  hero.secondary_label = "О нас";
  hero.secondary_link = { id: "", url: "company/about", linktype: "url", fieldtype: "multilink", cached_url: "company/about" };
}

// ---- report and write --------------------------------------------------------

if (!changes.length) {
  console.log("Всё уже так, как в макете — менять нечего");
  process.exit(0);
}
console.log(changes.map((line) => `• ${line}`).join("\n"));

if (!apply) {
  console.log("\nЭто пробный запуск. Записать: --apply");
  process.exit(0);
}

if (changes.some((line) => line.startsWith("settings"))) await save(settings);
if (changes.some((line) => line.startsWith("home"))) await save(home);
console.log("\nЗаписано и опубликовано");
