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
export type FooterLink = { label: string; path: string; hidden?: boolean };
export type FooterColumn = { title: string; links: FooterLink[] };

export type Cover = { title: string; subtitle: string; image: string };

/** One choice in the form's subject list; `short` is what a phone shows. */
export type SubjectOption = { value: string; short?: string };

export type SiteSettings = {
  notFound: { heading: string; cta: string };
  search: {
    heading: string;
    placeholder: string;
    empty: string;
    recommended: string;
    filters: { all: string; news: string; journal: string };
  };
  form: {
    placeholder: string;
    subjects: SubjectOption[];
    button: string;
    sent: string;
    subjectPlaceholder: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    /** Words in {braces} become the link to the user agreement. */
    consent: string;
  };
  /** The sign-up sheet an event article opens. `{n}` is the seats left. */
  eventSignup: {
    button: string;
    seatsLeft: string;
    seatsNone: string;
    closed: string;
    placeholder: string;
    submit: string;
    done: string;
    already: string;
    /** Words in {braces} become the link to the personal-data consent. */
    consent: string;
  };
  /** The band that opens each section page. */
  covers: { journal: Cover; news: Cover; brands: Cover };
  /** The title over the shop cards at 375. */
  storesHeading: string;
  ticker: {
    enabled: boolean;
    text: string;
    ctaLabel: string;
    href: string;
    tone: TickerTone;
  };
  /** Words in {braces} become the link to the cookie policy. */
  cookieText: string;
  /** What a link to the home page shows under its title; the home story's own wins. */
  homeDescription: string;
  nav: NavItem[];
  footer: {
    columns: FooterColumn[];
    cooperationTitle: string;
    email: string;
  };
  socials: SocialLink[];
};

// Картинка обложки брендов по умолчанию; заменяется картинкой из Storyblok, если она задана
export const BRANDS_COVER = "/images/covers/brands.jpg";

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
      { label: "Сотрудничество", path: "company/cooperation", hidden: true },
      { label: "Вакансии", path: "company/careers", hidden: true },
      { label: "Контакты", path: "company/contacts" },
      { label: "Обратная связь", path: "company/feedback", hidden: true },
    ],
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  notFound: { heading: "Страница не найдена", cta: "Вернуться на главную" },
  search: {
    heading: "Результаты поиска",
    placeholder: "Поиск статьи",
    empty: "Результатов не найдено. Попробуйте использовать другое слово.",
    recommended: "Рекомендованные материалы",
    filters: { all: "Все", news: "Новости", journal: "Журнал" },
  },
  form: {
    placeholder: "Задайте вопрос или напишите ваши пожелания и предложения",
    subjects: [
      { value: "О нас" },
      { value: "Пространство" },
      { value: "Сотрудничество" },
      { value: "Вакансии" },
      { value: "Контакты" },
      { value: "Обратная связь" },
      {
        value: "Связаться с генеральным директором",
        short: "Связаться с ген. директором",
      },
    ],
    button: "Отправить",
    sent: "Отправлено",
    subjectPlaceholder: "Тема обращения",
    namePlaceholder: "Ваше имя",
    emailPlaceholder: "E-mail",
    consent:
      "Нажимая на кнопку «Отправить», Вы соглашаетесь на обработку персональных данных в соответствии с {пользовательским соглашением}",
  },
  eventSignup: {
    button: "Записаться",
    seatsLeft: "Осталось мест: {n}",
    seatsNone: "Мест не осталось",
    closed: "Регистрация закрыта",
    placeholder: "E-mail",
    submit: "Записаться",
    done: "Вы записаны. Ждём вас!",
    already: "Вы уже записаны на это событие",
    consent:
      "Нажимая на кнопку «Записаться», Вы соглашаетесь на обработку персональных данных в соответствии с {согласием на обработку персональных данных}",
  },
  covers: {
    journal: {
      title: "Журнал",
      subtitle: "Разбираемся, сравниваем, считаем",
      image: "/images/covers/journal.jpg",
    },
    news: {
      title: "Новости",
      subtitle: "Главное в новостном потоке",
      image: "/images/covers/news.jpg",
    },
    brands: {
      title: "Бренды",
      subtitle: "Разбираемся, сравниваем, делимся",
      image: BRANDS_COVER,
    },
  },
  storesHeading: "Наши магазины",
  ticker: {
    enabled: true,
    text: "Скоро открытие нового магазина",
    ctaLabel: "Узнать подробнее",
    href: "#",
    tone: "red",
  },
  cookieText:
    "Мы используем {файлы cookies}, чтобы сайт работал лучше и быстрее.\nНадеемся, вы не против.",
  homeDescription:
    "TRENDSETTER — оффпрайс магазин в Москве: одежда, обувь, товары для дома и косметика известных брендов ниже обычной цены. Магазины рядом с домом.",
  nav: NAV_ITEMS,
  footer: {
    columns: FOOTER_COLUMNS,
    cooperationTitle: "Сотрудничество",
    email: "trader@calledagarment.com",
  },
  socials: SOCIAL_LINKS,
};
