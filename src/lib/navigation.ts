/** `hidden` takes an entry off the site for now without losing it. */
export type NavItem = {
  label: string;
  slug: string;
  hidden?: boolean;
  children?: { label: string; slug: string; hidden?: boolean }[];
};

export type SocialLink = { label: string; href: string; icon: string };

/**
 * The file's header, in its order: Бренды, Новости, Журнал, События, Компания,
 * Магазины, Контакты. Контакты is an entry of its own at the end, not a step of
 * the company's dropdown; the dropdown's «Частые вопросы» lives at /faq, which a
 * slug starting with a slash says (see `childHref`).
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Бренды", slug: "brands" },
  { label: "Новости", slug: "news" },
  {
    label: "Журнал",
    slug: "journal",
    children: [
      { label: "Люди", slug: "people", hidden: true },
      { label: "Находки", slug: "finds", hidden: true },
      { label: "Сообщество", slug: "community", hidden: true },
    ],
  },
  { label: "События", slug: "events" },
  {
    label: "Компания",
    slug: "company",
    children: [
      { label: "О нас", slug: "about" },
      { label: "Пространство", slug: "space" },
      { label: "Коллаборации", slug: "collaborations" },
      { label: "Сотрудничество", slug: "cooperation", hidden: true },
      { label: "Вакансии", slug: "careers" },
      { label: "Частые вопросы", slug: "/faq" },
      { label: "Обратная связь", slug: "feedback", hidden: true },
    ],
  },
  // One entry, and no children: the shops live on the one page rather than on
  // pages of their own, and /stores/1 was never a route.
  { label: "Магазины", slug: "stores" },
  { label: "Контакты", slug: "company/contacts" },
  { label: "Система лояльности", slug: "loyalty", hidden: true },
  { label: "Подарочные карты", slug: "gift-cards", hidden: true },
];

/** Where a dropdown link goes: under its parent, or from the root when the slug starts with a slash. */
export const childHref = (locale: string, parentSlug: string, childSlug: string) =>
  childSlug.startsWith("/") ? `/${locale}${childSlug}` : `/${locale}/${parentSlug}/${childSlug}`;

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Telegram", href: "https://t.me/trendsetter_russia", icon: "/images/social/telegram.svg" },
  { label: "VK", href: "#", icon: "/images/social/vk.svg" },
  // The national messenger, not a placeholder for one. No link yet.
  { label: "MAX", href: "#", icon: "/images/social/max.svg" },
  // Drawn in the file's footer and on the hero photo; the tile shows the name only
  { label: "Wildberries", href: "https://www.wildberries.ru/seller/trendsetter", icon: "/images/social/wildberries.svg" },
];
