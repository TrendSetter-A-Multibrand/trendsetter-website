/**
 * Fifteen test records for each row that scrolls, and nothing else.
 *
 * The home page has three: Последние новости (articles with section=news),
 * Ближайшие события (events) and Журнал (articles with section=journal). The
 * shops and the brands stand in a plain row of three and do not scroll, so they
 * are left alone.
 *
 * Why fifteen: four news cards measure exactly the row they sit in - 4x430 with
 * 40 between them is the 1840 the content is capped at - so with only the four
 * the space holds there is nothing to scroll and dragging looks broken while
 * working perfectly. Fifteen gives every row something to move.
 *
 * All of it is test content: the slugs are test-news-NN, test-journal-NN and
 * test-event-NN, and the titles are numbered, so it is easy to see in the row
 * and easy to take out again.
 *
 * A test event's card leads to /journal/test-event-NN, which is not written -
 * these are for measuring the row, not for reading. The real seed pairs an
 * event with an article; this one does not.
 *
 * npm run storyblok:seed-test-rows
 * npm run storyblok:seed-test-rows -- --clean
 */
import { api, block, folder, putStory } from "./mapi.mjs";

const COUNT = 15;

const TAILS = [
  "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона",
  "Что положить в косметичку: 8 уходовых средств на все случаи жизни",
  "Не только Dolce&Gabbana: home-коллекции модных брендов, о которых мы могли не знать",
  "Как устроен день стилиста: от утреннего кофе до примерочной",
  "Вторая жизнь вещей: как мы собираем и передаём одежду",
];

const TAGS = [
  ["Мода", "Тренды"],
  ["Красота", "Косметика"],
  ["Комьюнити", "Общество"],
  ["Впечатления", "Дом"],
  ["Люди", "Истории"],
];

/** Everything the repository actually carries, cycled. */
const IMAGES = [
  "/images/home/news/1.jpg",
  "/images/home/news/2.jpg",
  "/images/home/news/3.jpg",
  "/images/home/news/4.jpg",
  "/images/home/journal/1.jpg",
  "/images/home/journal/2.jpg",
  "/images/home/events/1.jpg",
  "/images/home/events/2.jpg",
  "/images/home/events/3.jpg",
  "/images/home/events/4.jpg",
];

const PLACES = [
  'ТЦ "Атриум"',
  "Хлебозавод №9",
  "Дубровка",
  'ТЦ "Мозаика"',
  'ТЦ "Вегас"',
];

const LOREM = TAILS[0];
const PARAGRAPH = Array.from({ length: 6 }, () => LOREM).join(" ");

/** Numbered so the order in the row is readable at a glance. */
const two = (n: number) => String(n).padStart(2, "0");

/** The same shape the real seed gives an article, so the page opens too. */
const body = () => [
  block("article_text_image", {
    subtitle: LOREM,
    body: PARAGRAPH,
    image: { filename: IMAGES[0] },
    caption: "Описание к фото / подпись",
  }),
  block("article_text", { subtitle: LOREM, body: PARAGRAPH }),
  block("article_quote", { subtitle: LOREM, body: PARAGRAPH }),
];

/**
 * Spread across the autumn so the day and the month on the badge both change -
 * a row of fifteen cards all reading «8 сентября» would hide a date bug rather
 * than show it.
 */
function eventDate(n: number) {
  const start = new Date(Date.UTC(2026, 8, 8, 0, 0));
  start.setUTCDate(start.getUTCDate() + (n - 1) * 5);
  const iso = start.toISOString().slice(0, 10);
  const hour = 10 + (n % 9);
  return `${iso} ${two(hour)}:${n % 2 ? "30" : "00"}`;
}

/** Which prefixes belong to this script, and which folder each sits in. */
const KINDS = [
  { prefix: "test-news-", folder: "journal" },
  { prefix: "test-journal-", folder: "journal" },
  { prefix: "test-event-", folder: "events" },
];

type Listed = { id: number; slug: string; full_slug: string };

/**
 * Takes the test records back out. Asked by path rather than by a list of slugs,
 * so a run that was interrupted half way still cleans up completely.
 */
async function clean() {
  let removed = 0;

  for (const kind of KINDS) {
    const { stories } = (await api(
      `/stories?starts_with=${kind.folder}/${kind.prefix}`
    )) as { stories: Listed[] };
    const mine = stories.filter((story) => story.slug.startsWith(kind.prefix));

    for (const story of mine) {
      await api(`/stories/${story.id}`, { method: "DELETE" });
      console.log(`удалена   ${story.full_slug}`);
      removed++;
    }
  }

  console.log(removed ? `\nвсего удалено: ${removed}` : "тестовых записей нет");
}

/** One article, under journal/ whichever section it shows in. */
async function article(
  n: number,
  section: "news" | "journal",
  parent: number
) {
  const slug = `test-${section}-${two(n)}`;
  const label = section === "news" ? "новость" : "материал";
  const title = `Тестовая ${label} ${two(n)}. ${TAILS[(n - 1) % TAILS.length]}`;

  const done = await putStory(
    slug,
    title,
    {
      component: "article",
      section,
      title,
      tags: TAGS[(n - 1) % TAGS.length],
      // Every third card in the file carries one, as in the real seed
      excerpt: n % 3 === 0 ? LOREM : "",
      hero: { filename: IMAGES[(n - 1) % IMAGES.length] },
      author: "Имя Фамилия (тест)",
      published_at: "2026-09-22 12:00",
      reading_minutes: "5",
      views: "715",
      event: "",
      body: body(),
    },
    parent,
    `journal/${slug}`
  );
  console.log(`${done}  journal/${slug}`);
}

async function event(n: number, parent: number) {
  const slug = `test-event-${two(n)}`;
  const date = eventDate(n);
  const title = `Тестовое событие ${two(n)}`;

  const done = await putStory(
    slug,
    title,
    {
      component: "event",
      title,
      location: PLACES[(n - 1) % PLACES.length],
      date,
      description: "Тестовое описание события для проверки ряда на главной.",
      cta_label: "Подробнее",
      image: { filename: IMAGES[(n - 1) % IMAGES.length] },
    },
    parent,
    `events/${slug}`
  );
  console.log(`${done}  events/${slug}  ${date}`);
}

async function seed() {
  const journal = await folder("journal", "Журнал");
  const events = await folder("events", "Мероприятия");

  for (let n = 1; n <= COUNT; n++) await article(n, "news", journal);
  for (let n = 1; n <= COUNT; n++) await article(n, "journal", journal);
  for (let n = 1; n <= COUNT; n++) await event(n, events);

  console.log(
    `\nзасеяно по ${COUNT} в каждый ряд: новости, журнал, события` +
      ` - вместе со своими записями поедут все три`
  );
}

if (process.argv.includes("--clean")) await clean();
else await seed();
