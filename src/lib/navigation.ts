export type NavItem = {
  label: string;
  slug: string;
  children?: { label: string; slug: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Журнал",
    slug: "journal",
    children: [
      { label: "Люди", slug: "people" },
      { label: "Находки", slug: "finds" },
      { label: "Сообщество", slug: "community" },
    ],
  },
  { label: "Новости", slug: "news" },
  {
    label: "Магазины",
    slug: "stores",
    children: [
      { label: "Магазин 1", slug: "1" },
      { label: "Магазин 2", slug: "2" },
      { label: "Магазин 3", slug: "3" },
    ],
  },
  { label: "Бренды", slug: "brands" },
  {
    label: "Компания",
    slug: "company",
    children: [
      { label: "О нас", slug: "about" },
      { label: "Пространство", slug: "space" },
      { label: "Сотрудничество", slug: "cooperation" },
      { label: "Вакансии", slug: "careers" },
      { label: "Контакты", slug: "contacts" },
      { label: "Обратная связь", slug: "feedback" },
    ],
  },
  { label: "Система лояльности", slug: "loyalty" },
  { label: "Подарочные карты", slug: "gift-cards" },
];

export const SOCIAL_LINKS = [
  { label: "Telegram", href: "#", icon: "/images/social/telegram.svg" },
  { label: "VK", href: "#", icon: "/images/social/vk.svg" },
  { label: "Одноклассники", href: "#", icon: "/images/social/ok.svg" },
  // The national messenger, not a placeholder for one. No link yet.
  { label: "MAX", href: "#", icon: "/images/social/max.svg" },
];
