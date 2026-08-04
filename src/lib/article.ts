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
  | { kind: "marquee"; text: string; size: "sm" | "lg" }
  | { kind: "brand"; subtitle?: string; body: string[] };

export type ArticleMeta = {
  section: string;
  sectionHref: string;
  title: string;
  author: string;
  publishedAt: string;
  views: number;
  readingMinutes: number;
  heroImage: string;
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
  },
  blocks: [
    {
      kind: "text-image",
      subtitle: SUBTITLE,
      body: [PARAGRAPH],
      image: "/images/home/news/1.jpg",
      caption: "Описание к фото / подпись",
    },
    { kind: "marquee", text: "Цитата бегущей строкой", size: "sm" },
    { kind: "images", images: ["/images/home/news/2.jpg", "/images/home/news/3.jpg"] },
    { kind: "text", subtitle: SUBTITLE, body: [PARAGRAPH] },
    { kind: "marquee", text: "Цитата бегущей строкой", size: "lg" },
    {
      kind: "images",
      images: [
        "/images/home/news/4.jpg",
        "/images/home/journal/2.jpg",
        "/images/home/news/1.jpg",
      ],
    },
    { kind: "brand", subtitle: SUBTITLE, body: [PARAGRAPH, PARAGRAPH] },
  ],
};
