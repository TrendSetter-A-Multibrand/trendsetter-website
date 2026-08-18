/**
 * One entry per event. The card in the Ближайшие события row and the article it
 * opens are two views of the same thing, which is why the date, the time and
 * the invitation live here and not in either of them - so a card and its
 * article cannot end up disagreeing about when the thing happens.
 */
export type Event = {
  slug: string;
  day: string;
  month: string;
  time: string;
  title: string;
  location: string;
  description?: string;
  ctaLabel: string;
  image?: string;
};

export const EVENTS: Event[] = [
  {
    slug: "master-class-ceramics",
    day: "27",
    month: "июл",
    time: "18:00",
    title: "Мастер-класс",
    location: 'ТЦ "Атриум"',
    description: "Мастер-класс по лепке от известного керамиста Юрия Базанова.",
    ctaLabel: "Подробнее",
    image: "/images/home/events/1.jpg",
  },
  {
    slug: "book-club",
    day: "3",
    month: "авг",
    time: "19:00",
    title: "Встреча книжного клуба",
    location: "Дубровка",
    description: "Обсуждаем новинки нон-фикшна вместе с гостями магазина.",
    ctaLabel: "Подробнее",
    image: "/images/home/events/2.jpg",
  },
  {
    slug: "capsule-show",
    day: "10",
    month: "авг",
    time: "17:30",
    title: "Показ капсульной коллекции",
    location: 'ТЦ "Атриум"',
    description: "Первыми увидите новую капсулу до старта продаж.",
    ctaLabel: "Подробнее",
    image: "/images/home/events/3.jpg",
  },
  {
    slug: "styling-workshop",
    day: "16",
    month: "авг",
    time: "12:00",
    title: "Воркшоп по стайлингу",
    location: "Хлебозавод №9",
    description: "Разбираем базовый гардероб с личным стилистом.",
    ctaLabel: "Подробнее",
    image: "/images/home/events/4.jpg",
  },
];

export const findEvent = (slug: string) =>
  EVENTS.find((event) => event.slug === slug);
