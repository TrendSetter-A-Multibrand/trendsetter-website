/**
 * Fills the home story with the sections the site already shows, so a space
 * brought up from nothing - the corporate account, when it exists - starts where
 * this one is rather than empty.
 *
 * Photos are left out on purpose: assets live under the space they were uploaded
 * to and would have to be uploaded again anyway, so the components keep falling
 * back to the ones in the repository until there is a space worth filling.
 *
 * npm run storyblok:seed
 */
import { api, block, putStory } from "./mapi.mjs";

/** A path of our own; the locale in front of it is the site's business. */
const link = (url) => ({
  id: "",
  url,
  linktype: "url",
  fieldtype: "multilink",
  cached_url: url,
});

const body = [
  block("hero", {
    tagline: "Доверьте поиск нам, а выбор — себе",
    primary_label: "Найти магазин",
    primary_link: link("/stores"),
    secondary_label: "Читать журнал",
    secondary_link: link("/journal"),
  }),
  block("news_row", { heading: "Последние новости" }),
  block("events_row", { heading: "Ближайшие события" }),
  block("journal_row", { heading: "Журнал" }),
  block("stores_row", { heading: "Магазины" }),
  block("newsletter", {
    heading: "Подпишитесь на наши новости",
    description:
      "Будьте в числе первых, кто узнает о новинках,\nраспрождажах и интересных новостях TRENDSETTER!",
  }),
];

// The home story is made with the space, so it is only ever updated
const { stories } = await api("/stories?with_slug=home");
if (!stories[0]) {
  console.error("Истории home в пространстве нет - создайте её в редакторе");
  process.exit(1);
}

const done = await putStory("home", stories[0].name, { component: "page", body });
console.log(`home ${done}: ${body.length} секций`);
body.forEach((b) => console.log("  " + b.component));
