/**
 * Fills the home story with the sections the site already shows, so a space
 * brought up from nothing - the corporate account, when it exists - starts where
 * this one is rather than empty.
 *
 * Photos are left out on purpose: assets live under the space they were uploaded
 * to and would have to be uploaded again anyway, so the components keep falling
 * back to the ones in the repository until there is a space worth filling.
 *
 * node --env-file=.env.local scripts/storyblok-seed-home.mjs
 */
const HOSTS = {
  eu: "mapi.storyblok.com",
  us: "api-us.storyblok.com",
  ap: "api-ap.storyblok.com",
  ca: "api-ca.storyblok.com",
};

const space = process.env.STORYBLOK_SPACE_ID;
const token = process.env.STORYBLOK_PERSONAL_TOKEN;
const host = HOSTS[process.env.STORYBLOK_REGION ?? "eu"];

if (!space || !token) {
  console.error("Нужны STORYBLOK_SPACE_ID и STORYBLOK_PERSONAL_TOKEN");
  process.exit(1);
}

const api = async (path, init = {}) => {
  const response = await fetch(`https://${host}/v1/spaces/${space}${path}`, {
    ...init,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} -> ${response.status}\n${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
};

const block = (component, fields) => ({
  _uid: crypto.randomUUID(),
  component,
  ...fields,
});

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

const { stories } = await api("/stories?with_slug=home");
const home = stories[0];
if (!home) {
  console.error("Истории home в пространстве нет - создайте её в редакторе");
  process.exit(1);
}

await api(`/stories/${home.id}`, {
  method: "PUT",
  body: JSON.stringify({
    story: { name: home.name, slug: home.slug, content: { component: "page", body } },
    publish: 1,
  }),
});

console.log(`home заполнена и опубликована: ${body.length} секций`);
body.forEach((b) => console.log("  " + b.component));
