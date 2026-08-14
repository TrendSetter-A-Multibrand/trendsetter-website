/**
 * Copy for the five pages the footer links to. The client's own wording has not
 * arrived yet, so the bodies below are placeholders - the mockups carry the real
 * text as outlines and transcribing a privacy policy off a picture is not worth
 * the risk. Swapping them for the delivered document is a change to this file
 * only; the pages read it and nothing else.
 */

export type LegalSection = {
  /** Rendered in brackets. The lead-in paragraphs of a page carry no heading. */
  heading?: string;
  paragraphs: string[];
};

export type LegalPage = {
  slug: string;
  title: string;
  sections: LegalSection[];
};

const PLACEHOLDER =
  "Текст этого раздела ещё не передан. Здесь встанет формулировка из документа, который готовит компания.";

const stub = (heading?: string): LegalSection => ({
  heading,
  paragraphs: [PLACEHOLDER, PLACEHOLDER],
});

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "user-agreement",
    title: "Пользовательское соглашение",
    sections: [
      stub(),
      stub("Общие условия"),
      stub("Регистрация пользователя"),
      stub("Права и обязанности сторон"),
      stub("Ответственность"),
    ],
  },
  {
    slug: "cookies",
    title: "Политика обработки cookie",
    sections: [
      stub(),
      stub("Использование cookie-файлов"),
      stub("Типы cookie-файлов"),
      stub("Управление cookie-файлами"),
    ],
  },
  {
    slug: "personal-data-consent",
    title: "Согласие на обработку персональных данных",
    sections: [stub()],
  },
  {
    slug: "privacy-policy",
    title: "Политика конфиденциальности",
    sections: [
      stub(),
      stub("Общие положения"),
      stub("Состав персональных данных"),
      stub("Цели обработки"),
      stub("Права субъекта персональных данных"),
    ],
  },
];

export function findLegalPage(slug: string) {
  return LEGAL_PAGES.find((page) => page.slug === slug);
}

export type FaqGroup = {
  title: string;
  items: { question: string; answer: string }[];
};

/** The mockup fills these with lorem too, so the questions are placeholders. */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Часто задаваемые вопросы",
    items: [
      { question: "Часто задаваемые вопросы", answer: PLACEHOLDER },
      { question: "Часто задаваемые вопросы", answer: PLACEHOLDER },
      { question: "Часто задаваемые вопросы", answer: PLACEHOLDER },
    ],
  },
  {
    title: "Возврат и обмен",
    items: [
      { question: "Возврат и обмен", answer: PLACEHOLDER },
      { question: "Возврат и обмен", answer: PLACEHOLDER },
      { question: "Возврат и обмен", answer: PLACEHOLDER },
    ],
  },
  {
    title: "Служба поддержки",
    items: [
      { question: "Служба поддержки", answer: PLACEHOLDER },
      { question: "Служба поддержки", answer: PLACEHOLDER },
      { question: "Служба поддержки", answer: PLACEHOLDER },
    ],
  },
  {
    title: "Акции",
    items: [
      { question: "Акции", answer: PLACEHOLDER },
      { question: "Акции", answer: PLACEHOLDER },
      { question: "Акции", answer: PLACEHOLDER },
    ],
  },
];
