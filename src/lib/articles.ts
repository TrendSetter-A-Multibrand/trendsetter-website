export type Article = {
  tags: string[];
  title: string;
  href?: string;
  image?: string;
};

export const ARTICLE_FILTERS = [
  "Люди",
  "Обзоры",
  "Тренды",
  "Идеи",
  "Добрые дела",
  "Вторая жизнь вещей",
  "Мастерская",
  "Детская",
  "Савеловский",
  "ТЦ Вегас",
];

const BASE_ARTICLES: Article[] = [
  {
    tags: ["Красота", "Косметика"],
    title: "Что положить в косметичку: 8 уходовых средств на все случаи жизни",
    image: "/images/home/news/2.jpg",
  },
  {
    tags: ["Мода", "Тренды"],
    title:
      "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона",
    image: "/images/home/news/3.jpg",
  },
  {
    tags: ["Комьюнити", "Общество"],
    title:
      "Карабин, плёнка и Тарковский: как «нишевость» и стремление быть «не как все» превратились в мем",
    image: "/images/home/news/4.jpg",
  },
  {
    tags: ["Впечатления", "Дом"],
    title:
      "Не только Dolce&Gabbana: home-коллекции модных брендов, о которых мы могли не знать",
    image: "/images/home/news/1.jpg",
  },
  {
    tags: ["Люди", "Истории"],
    title: "Как устроен день стилиста: от утреннего кофе до примерочной",
    image: "/images/home/journal/1.jpg",
  },
  {
    tags: ["Мастерская"],
    title: "Керамика для начинающих: что нужно знать перед первым занятием",
    image: "/images/home/journal/2.jpg",
  },
];

/**
 * Stand-in until Storyblok is wired up. 13 cards is what the mockup's
 * 3 / 2 / 3 / 2 / 3 row pattern needs to read correctly.
 */
export const PLACEHOLDER_ARTICLES: Article[] = Array.from(
  { length: 13 },
  (_, i) => ({ ...BASE_ARTICLES[i % BASE_ARTICLES.length], href: "#" })
);
