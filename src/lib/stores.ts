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
  /** Static render of the mockup's map until a map provider is picked. */
  map: string;
  directionsHref?: string;
};

const FILLER = {
  address: "Новодмитровская 1 стр. 13",
  hours: "12:00 – 21:00",
  phone: "8 926 794 97 42",
  brandCount: "50 шт.",
  assortment: "Мужской 30%   Женский 70%",
  directions: Array.from(
    { length: 4 },
    () => "Идете на второй этаж потом направо потом налево",
  ),
  map: "/images/stores/map-placeholder.jpg",
  directionsHref: "#",
};

export const STORES: Store[] = [
  { name: "Дубровка", image: "/images/home/stores/1.jpg", ...FILLER },
  { name: "Дубровка", image: "/images/home/stores/2.jpg", ...FILLER },
  { name: "Дубровка", image: "/images/home/stores/3.jpg", ...FILLER },
];
