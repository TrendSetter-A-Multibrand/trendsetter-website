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

/** A story written before the plan existed gets it right after the tiles. */
export function withFallbackBlocks(path: string, body: Block[]): Block[] {
  if (path !== "company/space" || body.some((block) => block.component === "store_plan")) return body;
  const at = body.map((block) => block.component).lastIndexOf("space_cards");
  if (at === -1) return body;
  return [...body.slice(0, at + 1), STORE_PLAN, ...body.slice(at + 1)];
}
