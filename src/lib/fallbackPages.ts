import type { Block } from "@/lib/storyblok/fetchStory";

const cover = (title: string, subtitle: string): Block => ({
  _uid: "fallback-cover",
  component: "page_cover",
  crumb: title,
  title,
  subtitle,
});

const rows = (items: [string, string][]): Block => ({
  _uid: "fallback-rows",
  component: "text_rows",
  rows: items.map(([title, body], i) => ({ _uid: `fallback-row-${i}`, component: "text_row", title, body })),
});

const informer: Block = {
  _uid: "fallback-informer",
  component: "informer",
  title: "Остались вопросы?",
  text: "Ответы — в частых вопросах.",
  button_label: "Частые вопросы",
  link: "faq",
  icon: true,
};

/**
 * Pages the redesign draws before anyone has made them in Storyblok: what stands
 * in for a story with no story. The words are the file's own, "уточнить" and
 * all - they are the designer's placeholders for conditions nobody has agreed,
 * and the editor's page replaces the whole of this the moment it exists.
 */
const PAGES: Record<string, { name: string; body: Block[] }> = {
  loyalty: {
    name: "Система лояльности",
    body: [
      cover("Система лояльности", "Как вступить, копить и тратить"),
      { _uid: "fallback-loyalty-demo", component: "loyalty_demo_actions" },
      rows([
        ["Как вступить", "Карта оформляется на кассе любого магазина. Условия — уточнить."],
        ["Как копить", "Баллы начисляются за покупки в магазинах TRENDSETTER. Условия начисления — уточнить."],
        ["Как тратить", "Баллами можно оплатить часть следующей покупки. Правила списания — уточнить."],
        ["Где посмотреть баланс", "Где посмотреть баланс — уточнить."],
      ]),
      informer,
    ],
  },
  "gift-cards": {
    name: "Подарочные карты",
    body: [
      cover("Подарочные карты", "Когда хочется подарить выбор"),
      { _uid: "fallback-giftcard-demo", component: "giftcard_demo_actions" },
      rows([
        ["Где купить", "Подарочную карту можно купить на кассе любого магазина TRENDSETTER."],
        ["Номинал", "Номиналы — уточнить."],
        ["Как использовать", "В каких магазинах принимают карту — уточнить."],
        ["Срок действия", "Срок действия — уточнить."],
      ]),
      informer,
    ],
  },
};

export const fallbackPage = (path: string) => PAGES[path];

/**
 * The file's "План магазина" on Пространство: the card of the shop that is about
 * to open, its thirteen zones and the plate the plan will stand on. Put in only
 * while the page's own story has no plan block.
 */
const STORE_PLAN: Block = {
  _uid: "fallback-store-plan",
  component: "store_plan",
  label: "Скоро открытие",
  title: "ТРЦ «Авеню Север»",
  text: "Коровинское шоссе, 2. Нажмите на зону на плане или в списке — расскажем, что там.",
  zones: (
    [
      ["Товары для дома", "зал"],
      ["3D-печать", "мастерская"],
      ["Гончарная мастерская", "мастерская"],
      ["Продукты", "зал"],
      ["Косметика", "зал"],
      ["Касса и упаковка", "сервис"],
      ["Детское", "зал"],
      ["Обувь", "зал"],
      ["Зона ожидания", "сервис"],
      ["Примерочные", "сервис"],
      ["Ателье", "мастерская"],
      ["Бренд-зона", "зал"],
      ["Одежда М/Ж", "зал"],
    ] as const
  ).map(([name, kind], i) => ({ _uid: `fallback-zone-${i}`, component: "store_plan_zone", name, kind })),
};

const nest = (component: string, items: Record<string, string>[], key: string): Block[] =>
  items.map((item, i) => ({ _uid: `fallback-${key}-${i}`, component, ...item }));

/**
 * Вакансии as the file draws it: the cover with its line, "Кому понравится у нас"
 * over three cards, the mission band, "[Актуальные вакансии]" as an accordion and
 * the informer that leads to Контакты. The three vacancies are the file's demo
 * lines - no one has opened a post - and their descriptions are the designer's
 * "уточнить". Stands in for a page whose story is still the old site's: that one
 * has no list to open, and a block the schema does not hold yet cannot be added to
 * it by an editor.
 */
const CAREERS: Block[] = [
  cover("Вакансии", "Ищем людей, которым нравится находить ценное"),
  {
    _uid: "fallback-careers-intro",
    component: "text_section",
    title: "Кому понравится у нас",
    body: "Тем, кто любит хорошие вещи и людей вокруг них: в магазинах, в мастерской, в редакции и в офисе.",
  },
  {
    _uid: "fallback-careers-cards",
    component: "photo_cards",
    cards: nest(
      "photo_card",
      [
        {
          title: "Кураторство",
          body: "Отбираем вещи, которые стоит найти, и учимся делать это лучше с каждой поставкой.",
        },
        {
          title: "Новое",
          body: "Ассортимент, события и сервисы всё время обновляются — скучно не будет.",
        },
        {
          title: "Рядом с районом",
          body: "Магазины, мастерские и ателье — места, куда люди приходят не только за покупками.",
        },
      ],
      "careers-card",
    ),
  },
  {
    _uid: "fallback-careers-mission",
    component: "mission_band",
    heading: "Наша миссия",
    body: "Осознанный выбор, который всегда оставляет место для нового.",
  },
  {
    _uid: "fallback-careers-list",
    component: "accordion_list",
    heading: "Актуальные вакансии",
    items: nest(
      "accordion_item",
      [
        { question: "Менеджер PR-проектов · Москва, офис", answer: "Описание вакансии — уточнить." },
        { question: "Автор-журналист · Москва, гибрид", answer: "Описание вакансии — уточнить." },
        { question: "Консультант в магазин · Москва, магазины", answer: "Описание вакансии — уточнить." },
      ],
      "careers-item",
    ),
  },
  {
    _uid: "fallback-careers-informer",
    component: "informer",
    title: "Не нашли подходящую вакансию?",
    text: "Напишите нам — расскажем, чем хотите заниматься.",
    button_label: "Написать",
    link: "company/contacts",
  },
];

/**
 * A story written before the plan existed gets it right after the tiles; the
 * careers story that has no list of vacancies is the old site's page and gives
 * way to the file's.
 */
export function withFallbackBlocks(path: string, body: Block[]): Block[] {
  if (path === "company/careers" && !body.some((block) => block.component === "accordion_list")) {
    return CAREERS;
  }
  if (path !== "company/space" || body.some((block) => block.component === "store_plan")) return body;
  const at = body.map((block) => block.component).lastIndexOf("space_cards");
  if (at === -1) return body;
  return [...body.slice(0, at + 1), STORE_PLAN, ...body.slice(at + 1)];
}
