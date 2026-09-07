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

/**
 * How the badges read the date: the day large, the month small under it in the
 * genitive, the hour over the minute.
 *
 * Two lists, because the same month is written two ways. The plate is 64 square
 * with 12 of padding, so the month has 40 to live in at 10px with 3 of tracking
 * - about four letters. «сентября» wants some seventy and ran out of the plate
 * on both sides; the file draws «июля», which is short enough to have hidden
 * that. So the plates take three letters and prose takes the whole word.
 *
 * Written out rather than left to Intl either way: Intl's own name for the
 * month is «июль», and a date needs «июля», which is a different word.
 */
const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/** The same twelve as the plates wear them: three letters, no full stop. */
const MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

/**
 * Storyblok keeps a date and time as "2026-07-27 18:00" - the wall clock the
 * editor typed, with no zone on it. Read as text rather than through Date, which
 * would take it for UTC and could move the day for a reader in another country.
 */
export function eventDate(value: string) {
  const [date = "", time = ""] = value.split(" ");
  const [, month = "", day = ""] = date.split("-");
  const index = Number(month) - 1;
  return {
    day: String(Number(day) || ""),
    /** For the plates on a card, which have room for no more. */
    month: MONTHS_SHORT[index] ?? "",
    /** For a date read as a sentence: «22 сентября 2026». */
    monthFull: MONTHS[index] ?? "",
    time: time.slice(0, 5),
  };
}
