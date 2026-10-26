/**
 * Вакансии as a page of its own in the space, taken from what the route drew
 * until now, redrawn for the 2.0 file: the cover, the lead and three cards, the
 * mission band and the informer that leads to Контакты. The route is gone;
 * this story answers at /company/careers like the rest of the section.
 *
 * It only creates: once the page exists it is the editor's, and running this
 * again would overwrite her work (--force says that is wanted).
 *
 * npm run storyblok:seed-careers
 */
import { api, block, folder, putStory } from "./mapi.mjs";

const { stories } = await api("/stories?with_slug=company/careers");
if (stories[0] && !process.argv.includes("--force")) {
  console.log("company/careers уже есть и теперь принадлежит редактору - пропускаю");
  process.exit(0);
}

const parent = await folder("company", "Компания");

// Wording from the file's frame (04.10.2026). The list of open vacancies is left
// to the editor: the file's three are demo lines, not posts anyone has opened.
const body = [
  block("page_cover", { crumb: "Вакансии", title: "Вакансии", subtitle: "" }),
  block("text_section", {
    title: "Кому понравится у нас",
    body: "Тем, кто любит хорошие вещи и людей вокруг них: в магазинах, в мастерской, в редакции и в офисе.",
  }),
  block("photo_cards", {
    cards: [
      block("photo_card", {
        title: "Кураторство",
        body: "Отбираем вещи, которые стоит найти, и учимся делать это лучше с каждой поставкой.",
      }),
      block("photo_card", {
        title: "Новое",
        body: "Ассортимент, события и сервисы всё время обновляются — скучно не будет.",
      }),
      block("photo_card", {
        title: "Рядом с районом",
        body: "Магазины, мастерская и ателье — места, куда люди приходят не только за покупками.",
      }),
    ],
  }),
  block("mission_band", {
    heading: "Наша миссия",
    body: "Осознанный выбор, который всегда оставляет место для нового.",
  }),
  block("informer", {
    title: "Не нашли подходящую вакансию?",
    text: "Напишите нам — расскажите, чем хотите заниматься.",
    button_label: "Написать",
    link: "company/contacts",
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
