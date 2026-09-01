import { EVENTS, type Event } from "@/lib/events";

export type Brand = {
  name: string;
  categories: string[];
  logo: string;
  image: string;
  description: string;
  stores: { name: string; available: boolean }[];
  /** What the brand is holding next - the sheet ends on a row of them. */
  events: Event[];
};

export const BRAND_CATEGORIES = [
  "Одежда",
  "Обувь",
  "Аксессуары",
  "Косметика",
  "Дом",
  "Еда",
  "Мужчинам",
  "Девушкам",
  "Детям",
];

/** Latin A-Z plus the two buckets the mockup ends the row with. */
export const BRAND_INDEX = [
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  "RU",
  "#",
];

const DESCRIPTION = Array.from(
  { length: 10 },
  () =>
    "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона"
).join(" ");

const BASE: Omit<Brand, "name"> = {
  categories: ["Одежда", "Обувь", "Мужчинам", "Девушкам", "Детям"],
  logo: "/images/brands/abercrombie-fitch.svg",
  image: "/images/home/journal/1.jpg",
  description: DESCRIPTION,
  stores: [
    { name: 'ТЦ "Вегас"', available: true },
    { name: 'ТЦ "Авеню"', available: false },
  ],
  events: EVENTS.slice(0, 2),
};

/** Nine under A and nine under B, the way the mockup shows them. */
export const BRANDS: Brand[] = [
  ...Array.from({ length: 9 }, () => ({ ...BASE, name: "Abercrombie & Fitch" })),
  ...Array.from({ length: 9 }, () => ({ ...BASE, name: "Balenciaga" })),
];

/** Bucket a brand under its first character, matching BRAND_INDEX. */
export function indexKey(name: string) {
  const first = name[0].toUpperCase();
  if (first >= "A" && first <= "Z") return first;
  if (first >= "А" && first <= "Я") return "RU";
  return "#";
}
