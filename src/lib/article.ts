/**
 * The article body is a sequence of blocks, which is the shape Storyblok will
 * hand us later. Each variant matches one layout in the mockup.
 */
export type ArticleBlock =
  | { kind: "text"; subtitle?: string; body: string[] }
  | {
      kind: "text-image";
      subtitle?: string;
      body: string[];
      image: string;
      caption?: string;
    }
  | { kind: "images"; images: string[] }
  /** The red band, quote marks either side of it. The file dropped the two
      running lines this replaces. */
  | { kind: "quote"; subtitle?: string; body: string[] };

export type ArticleMeta = {
  section: string;
  sectionHref: string;
  title: string;
  author: string;
  publishedAt: string;
  views: number;
  readingMinutes: number;
  heroImage: string;
  /** The tags shown as chips over the title - the card's own, not a fixed list. */
  tags: string[];
  /** What the article invites you to, if it invites you to anything. */
  event?: { day: string; month: string; time: string; label: string; href: string };
};

const LOREM =
  "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона";
const PARAGRAPH = Array.from({ length: 6 }, () => LOREM).join(" ");
const SUBTITLE = LOREM;

export const PLACEHOLDER_ARTICLE: { meta: ArticleMeta; blocks: ArticleBlock[] } = {
  meta: {
    section: "Журнал",
    sectionHref: "journal",
    title: "Какой-то заголовок статьи в три строки без описания",
    author: "Имя Фамилия (доп. поле)",
    publishedAt: "22 сентября 2026",
    views: 715,
    readingMinutes: 5,
    heroImage: "/images/home/journal/1.jpg",
    tags: ["Мода", "Тренды"],
    event: {
      day: "27",
      month: "июл",
      time: "18:00",
      label: "Записаться",
      href: "#",
    },
  },
  blocks: [
    {
      kind: "text-image",
      subtitle: SUBTITLE,
      body: [PARAGRAPH],
      image: "/images/home/news/1.jpg",
      caption: "Описание к фото / подпись",
    },
    { kind: "images", images: ["/images/home/news/2.jpg", "/images/home/news/3.jpg"] },
    { kind: "text", subtitle: SUBTITLE, body: [PARAGRAPH] },
    {
      kind: "images",
      images: [
        "/images/home/news/4.jpg",
        "/images/home/journal/2.jpg",
        "/images/home/news/1.jpg",
      ],
    },
    { kind: "quote", subtitle: SUBTITLE, body: [PARAGRAPH] },
  ],
};
