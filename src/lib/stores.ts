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
};

export const STORES: Store[] = [
  {
    name: "Avenue Sever",
    address: "Коровинское шоссе, 2",
    directions: ["2 этаж"],
    image: "/images/home/stores/1.jpg",
    coords: [37.544638, 55.866713],
    ...FILLER,
  },
  {
    name: "ТРЦ Мозаика",
    address: "7-я Кожуховская улица, 9",
    directions: ["1 этаж"],
    image: "/images/home/stores/2.jpg",
    coords: [37.675109, 55.710692],
    ...FILLER,
  },
  {
    name: "ТРЦ Vegas",
    address: "МКАД, 24-й километр, владение 1",
    directions: ["1 этаж"],
    image: "/images/home/stores/3.jpg",
    coords: [37.723202, 55.585051],
    ...FILLER,
  },
];
