export type Store = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  /** Only the details panel shows these two. */
  brandCount: string;
  assortment: string;
  /** What the shop sells, written out in brackets under its name in the sheet. */
  tags: string[];
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
  hours: "Ежедневно 10:00 – 22:00",
  phone: "8 926 794 97 42",
  brandCount: "50 шт.",
  assortment: "Мужской 30%   Женский 70%",
  tags: ["Одежда", "Обувь", "Мужчинам", "Девушкам", "Детям"],
};

export const STORES: Store[] = [
  {
    name: "ТРЦ «Авеню Север»",
    address: "Коровинское ш., д. 2, 2 этаж",
    directions: [],
    image: "/images/home/stores/1.jpg",
    coords: [37.544638, 55.866713],
    ...FILLER,
  },
  {
    name: "ТРЦ «Мозаика»",
    address: "7-я Кожуховская ул., д. 9, 1 этаж",
    directions: [],
    image: "/images/home/stores/2.jpg",
    coords: [37.675109, 55.710692],
    ...FILLER,
  },
  {
    name: "ТРК «Вегас» Каширское",
    address: "Каширское ш., 24 км МКАД, 2 этаж",
    directions: [],
    image: "/images/home/stores/3.jpg",
    coords: [37.723202, 55.585051],
    ...FILLER,
  },
];
