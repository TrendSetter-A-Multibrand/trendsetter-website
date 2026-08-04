export type Store = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  image: string;
  /** Static render of the mockup's map until a map provider is picked. */
  map: string;
  directionsHref?: string;
};

export const STORES: Store[] = [
  {
    name: "Дубровка",
    address: "Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»",
    hours: "12:00 – 21:00",
    phone: "8 926 794 97 42",
    image: "/images/home/stores/1.jpg",
    map: "/images/stores/map-placeholder.jpg",
    directionsHref: "#",
  },
  {
    name: "Дубровка",
    address: "Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»",
    hours: "12:00 – 21:00",
    phone: "8 926 794 97 42",
    image: "/images/home/stores/2.jpg",
    map: "/images/stores/map-placeholder.jpg",
    directionsHref: "#",
  },
  {
    name: "Дубровка",
    address: "Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»",
    hours: "12:00 – 21:00",
    phone: "8 926 794 97 42",
    image: "/images/home/stores/3.jpg",
    map: "/images/stores/map-placeholder.jpg",
    directionsHref: "#",
  },
];
