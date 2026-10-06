/**
 * Вакансии as a page of its own in the space, taken from what the route drew
 * until now: the cover, «Наша миссия» with its paragraph, the three cards, the
 * mission band and the card that leads to Обратная связь. The route is gone;
 * this story answers at /company/careers like the rest of the section.
 *
 * It only creates: once the page exists it is the editor's, and running this
 * again would overwrite her work (--force says that is wanted).
 *
 * npm run storyblok:seed-careers
 */
import { ABOUT_CARDS, ABOUT_MISSION, CAREERS_INTRO } from "../src/lib/company.ts";
import { api, block, folder, putStory } from "./mapi.mjs";

const { stories } = await api("/stories?with_slug=company/careers");
if (stories[0] && !process.argv.includes("--force")) {
  console.log("company/careers уже есть и теперь принадлежит редактору - пропускаю");
  process.exit(0);
}

const parent = await folder("company", "Компания");

const body = [
  block("page_cover", { crumb: "Вакансии", title: "Вакансии", subtitle: "" }),
  block("text_section", {
    title: CAREERS_INTRO.title,
    body: CAREERS_INTRO.body,
  }),
  block("photo_cards", {
    cards: ABOUT_CARDS.map((card: { title: string; body: string }) =>
      block("photo_card", { title: card.title, body: card.body })
    ),
  }),
  block("spacer", { size: "40" }),
  block("mission_band", { heading: "Наша миссия", body: ABOUT_MISSION }),
  block("help_cards", {
    cards: [
      block("help_card", {
        title: "Обратная связь",
        text: "Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»",
        link: "company/feedback",
        icon: "support",
      }),
    ],
  }),
];

const done = await putStory(
  "careers",
  "Вакансии",
  {
    component: "page",
    body,
    meta_title: "Вакансии",
    meta_description:
      "Открытые вакансии TRENDSETTER и что мы предлагаем тем, кто к нам приходит.",
  },
  parent,
  "company/careers"
);
console.log(`${done}  company/careers  (блоков ${body.length})`);
