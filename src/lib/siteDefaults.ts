import {
  NAV_ITEMS,
  SOCIAL_LINKS,
  type NavItem,
  type SocialLink,
} from "./navigation.ts";
import type { TickerTone } from "../components/blocks/PromoTicker.tsx";

/**
 * What the shell of the site - the strip above the header, the menu, the footer
 * and the social tiles - is made of, as the editor wrote it in the "settings"
 * story. Anything left empty falls back to what is below, so a space that has
 * not been filled in yet (or a Storyblok that does not answer) still draws a
 * whole page.
 */
export type FooterLink = { label: string; path: string };
export type FooterColumn = { title: string; links: FooterLink[] };

export type SiteSettings = {
  ticker: {
    enabled: boolean;
    text: string;
    ctaLabel: string;
    href: string;
    tone: TickerTone;
  };
  /** Words in {braces} become the link to the cookie policy. */
  cookieText: string;
  nav: NavItem[];
  footer: {
    columns: FooterColumn[];
    cooperationTitle: string;
    email: string;
  };
  socials: SocialLink[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Меню",
    links: [
      { label: "Журнал", path: "journal" },
      { label: "Бренды", path: "brands" },
      { label: "Магазины", path: "stores" },
      { label: "Коллаборации", path: "company/collaborations" },
      { label: "Компания", path: "company" },
    ],
  },
  {
    title: "Покупателям",
    links: [
      { label: "Часто задаваемые вопросы", path: "faq" },
      { label: "Пользовательское соглашение", path: "user-agreement" },
      { label: "Политика обработки cookie", path: "cookies" },
      {
        label: "Согласие на обработку персональных данных",
        path: "personal-data-consent",
      },
      {
        label: "Политика обработки персональных данных",
        path: "privacy-policy",
      },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О нас", path: "company/about" },
      { label: "Пространство", path: "company/space" },
      { label: "Сотрудничество", path: "company/cooperation" },
      { label: "Вакансии", path: "company/careers" },
      { label: "Контакты", path: "company/contacts" },
      { label: "Обратная связь", path: "company/feedback" },
    ],
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  ticker: {
    enabled: true,
    text: "Скоро открытие нового магазина",
    ctaLabel: "Узнать подробнее",
    href: "#",
    tone: "red",
  },
  cookieText:
    "Мы используем {файлы cookies}, чтобы сайт работал лучше и быстрее.\nНадеемся, вы не против.",
  nav: NAV_ITEMS,
  footer: {
    columns: FOOTER_COLUMNS,
    cooperationTitle: "Сотрудничество",
    email: "trader@calledagarment.com",
  },
  socials: SOCIAL_LINKS,
};
