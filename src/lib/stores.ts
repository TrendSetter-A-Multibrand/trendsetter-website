export type Store = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  /** Only the details panel shows these two. */
  brandCount: string;
  assortment: string;
  /** One line each, set tight under «Как пройти». */
  directions: string[];
  image: string;
  /**
   * Longitude first, then latitude - the order the maps API wants, and the
   * reverse of how people read coordinates out loud.
   */
  coords: [number, number];
};

const FILLER = {
  hours: "12:00 – 21:00",
  phone: "8 926 794 97 42",
  brandCount: "50 шт.",
  assortment: "Мужской 30%   Женский 70%",
  directions: Array.from(
    { length: 4 },
    () => "Идете на второй этаж потом направо потом налево",
  ),
};

/**
 * Three shops, named as the team named them. Everything except the name and the
 * point on the map is still placeholder copy.
 *
 * The coordinates put the pin on the shopping centre, not on the shop inside
 * it, and only Мозаика's are exact - the other two are read off the address and
 * land within a block or so. All three want replacing with the real thing,
 * which is a minute's work: find the door in Яндекс Картах, right-click, «Что
 * здесь?», and copy the pair - remembering that the site wants them the other
 * way round, longitude first.
 */
export const STORES: Store[] = [
  {
    name: "Авеню Север",
    address: "Дмитровское шоссе, 9",
    image: "/images/home/stores/1.jpg",
    coords: [37.582, 55.8085], // приблизительно, по адресу
    ...FILLER,
  },
  {
    name: "ТРЦ Мозаика",
    address: "7-я Кожуховская улица, 9",
    image: "/images/home/stores/2.jpg",
    coords: [37.675109, 55.710692], // точные
    ...FILLER,
  },
  {
    name: "Вегас Каширка",
    address: "24-й километр МКАД",
    image: "/images/home/stores/3.jpg",
    coords: [37.737, 55.592], // приблизительно, по адресу
    ...FILLER,
  },
];
