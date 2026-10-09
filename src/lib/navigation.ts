/** `hidden` takes an entry off the site for now without losing it. */
export type NavItem = {
  label: string;
  slug: string;
  hidden?: boolean;
  children?: { label: string; slug: string; hidden?: boolean }[];
};

export type SocialLink = { label: string; href: string; icon: string };

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Журнал",
    slug: "journal",
    children: [
      { label: "Люди", slug: "people", hidden: true },
      { label: "Находки", slug: "finds", hidden: true },
      { label: "Сообщество", slug: "community", hidden: true },
    ],
  },
  { label: "Новости", slug: "news" },
  // One entry, and no children: the shops live on the one page rather than on
  // pages of their own, and /stores/1 was never a route.
  { label: "Магазины", slug: "stores" },
  { label: "Бренды", slug: "brands" },
  {
    label: "Компания",
    slug: "company",
    children: [
      { label: "О нас", slug: "about" },
      { label: "Пространство", slug: "space" },
      { label: "Коллаборации", slug: "collaborations" },
      { label: "Сотрудничество", slug: "cooperation", hidden: true },
      { label: "Вакансии", slug: "careers", hidden: true },
      { label: "Контакты", slug: "contacts" },
      { label: "Обратная связь", slug: "feedback", hidden: true },
    ],
  },
  { label: "Система лояльности", slug: "loyalty", hidden: true },
  { label: "Подарочные карты", slug: "gift-cards", hidden: true },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Telegram", href: "#", icon: "/images/social/telegram.svg" },
  { label: "VK", href: "#", icon: "/images/social/vk.svg" },
  // The national messenger, not a placeholder for one. No link yet.
  { label: "MAX", href: "#", icon: "/images/social/max.svg" },
];
