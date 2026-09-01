/**
 * The articles: the seven from src/lib/articles.ts, and one for each event so
 * that the invitation to sign up has a page to sit on - which is what the mock
 * did by matching a slug against the events list.
 *
 * All of them live under journal/, because that is the one article route the
 * file draws; whether a piece shows under Журнал or under Новости is the
 * section field's business, not the path's.
 *
 * npm run storyblok:seed-articles
 */
import { EVENTS } from "../src/lib/events.ts";
import { api, block, folder, putStory } from "./mapi.mjs";

const LOREM =
  "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона";
const PARAGRAPH = Array.from({ length: 6 }, () => LOREM).join(" ");

/**
 * Written out rather than imported: src/lib/articles.ts reaches for other
 * modules through the `@/` alias, which means nothing to node.
 */
const ARTICLES = [
  { slug: "cosmetics-bag", tags: ["Красота", "Косметика"], title: "Что положить в косметичку: 8 уходовых средств на все случаи жизни", image: "/images/home/news/2.jpg" },
  { slug: "fashion-week", tags: ["Мода", "Тренды"], title: "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона", image: "/images/home/news/3.jpg" },
  { slug: "community", tags: ["Комьюнити", "Общество"], title: "Карабин, плёнка и Тарковский: как «нишевость» и стремление быть «не как все» превратились в мем", image: "/images/home/news/4.jpg" },
  { slug: "home-collections", tags: ["Впечатления", "Дом"], title: "Не только Dolce&Gabbana: home-коллекции модных брендов, о которых мы могли не знать", image: "/images/home/news/1.jpg" },
  { slug: "stylist-day", tags: ["Люди", "Истории"], title: "Как устроен день стилиста: от утреннего кофе до примерочной", image: "/images/home/journal/1.jpg" },
  { slug: "ceramics-basics", tags: ["Мастерская"], title: "Керамика для начинающих: что нужно знать перед первым занятием", image: "/images/home/journal/2.jpg" },
  { slug: "second-life", tags: ["Впечатления", "Дом"], title: "Вторая жизнь вещей: как мы собираем и передаём одежду", image: "/images/home/news/1.jpg" },
];

/** The body every article shares until real ones are written. */
const body = () => [
  block("article_text_image", {
    subtitle: LOREM,
    body: PARAGRAPH,
    image: { filename: "/images/home/news/1.jpg" },
    caption: "Описание к фото / подпись",
  }),
  block("article_images", {
    images: [
      { filename: "/images/home/news/2.jpg" },
      { filename: "/images/home/news/3.jpg" },
    ],
  }),
  block("article_text", { subtitle: LOREM, body: PARAGRAPH }),
  block("article_images", {
    images: [
      { filename: "/images/home/news/4.jpg" },
      { filename: "/images/home/journal/2.jpg" },
      { filename: "/images/home/news/1.jpg" },
    ],
  }),
  block("article_quote", { subtitle: LOREM, body: PARAGRAPH }),
];

/** The events already in the space, so an article can point at one. */
const { stories: events } = await api("/stories?content_type=event&per_page=100");
const uuidBySlug = new Map<string, string>(
  events.map((event: { uuid: string; slug: string }) => [event.slug, event.uuid])
);

const parent = await folder("journal", "Журнал");

for (const [i, article] of ARTICLES.entries()) {
  const done = await putStory(
    article.slug,
    article.title,
    {
      component: "article",
      // Alternating, as the mock did: nothing yet says which is which
      section: i % 2 === 0 ? "news" : "journal",
      title: article.title,
      tags: article.tags,
      // Only some of the cards in the file carry one, so only some do here
      excerpt: i % 3 === 0 ? LOREM : "",
      hero: { filename: article.image },
      author: "Имя Фамилия (доп. поле)",
      published_at: "2026-09-22 12:00",
      reading_minutes: "5",
      views: "715",
      event: "",
      body: body(),
    },
    parent,
    `journal/${article.slug}`
  );
  console.log(`${done}  journal/${article.slug}`);
}

for (const event of EVENTS) {
  const done = await putStory(
    event.slug,
    event.title,
    {
      component: "article",
      section: "journal",
      title: event.title,
      tags: ["Впечатления"],
      hero: { filename: event.image ?? "" },
      author: "Имя Фамилия (доп. поле)",
      published_at: "2026-09-22 12:00",
      reading_minutes: "5",
      views: "715",
      event: uuidBySlug.get(event.slug) ?? "",
      body: body(),
    },
    parent,
    `journal/${event.slug}`
  );
  console.log(`${done}  journal/${event.slug}  → мероприятие ${uuidBySlug.has(event.slug) ? "есть" : "НЕ НАЙДЕНО"}`);
}
