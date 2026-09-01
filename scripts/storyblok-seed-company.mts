/**
 * The four settled pages of the Компания section, taken from src/lib/company.ts
 * and src/lib/contacts.ts. Вакансии is left out on purpose: the designer marked
 * that frame a draft - every heading on it still reads «Наша миссия» and two of
 * its blocks are lying loose outside the frame.
 *
 * npm run storyblok:seed-company
 */
import {
  ABOUT_CARDS,
  ABOUT_FEATURE,
  ABOUT_MISSION,
  COLLABORATIONS,
  SPACE_CARDS,
  SPACE_INTRO,
  TEAM,
} from "../src/lib/company.ts";
import { CONTACT_GROUPS } from "../src/lib/contacts.ts";
import { block, folder, putStory } from "./mapi.mjs";

const cover = (crumb: string, title: string, subtitle?: string) =>
  block("page_cover", { crumb, title, subtitle: subtitle ?? "" });

const photoCards = (cards: { title: string; body: string }[]) =>
  block("photo_cards", {
    cards: cards.map((card) =>
      block("photo_card", { title: card.title, body: card.body })
    ),
  });

const spaceCards = (cards: { title: string }[]) =>
  block("space_cards", {
    cards: cards.map((card) => block("space_card", { title: card.title })),
  });

const parent = await folder("company", "Компания");

const pages: [string, string, unknown[]][] = [
  [
    "about",
    "О нас",
    [
      cover("О нас", "О нас", "История, наша миссия и цели"),
      block("text_with_photo", {
        title: ABOUT_FEATURE.title,
        body: ABOUT_FEATURE.body,
      }),
      block("mission_band", { heading: "Наша миссия", body: ABOUT_MISSION }),
      photoCards(ABOUT_CARDS),
      block("team_grid", {
        members: TEAM.map((member) =>
          block("team_member", { name: member.name, role: member.role })
        ),
      }),
      block("contact_form", {}),
    ],
  ],
  [
    "space",
    "Пространство",
    [
      cover("Пространство", "Пространство", "Для всей семьи"),
      block("intro_text", { text: SPACE_INTRO }),
      spaceCards(SPACE_CARDS),
      block("contact_form", {}),
    ],
  ],
  [
    "collaborations",
    "Коллаборации",
    [
      cover("Коллаборации", "Коллаборации", "Для всей семьи"),
      block("intro_text", { text: SPACE_INTRO }),
      spaceCards(COLLABORATIONS),
      block("contact_form", {}),
    ],
  ],
  [
    "contacts",
    "Контакты",
    [
      cover("Контакты", "Контакты"),
      block("contact_details", {
        groups: CONTACT_GROUPS.map((group) =>
          block("contact_group", {
            title: group.title,
            // One line each, which is how the field reads them back
            lines: group.lines.join("\n"),
          })
        ),
      }),
      block("contact_form", {}),
    ],
  ],
];

for (const [slug, name, body] of pages) {
  const done = await putStory(
    slug,
    name,
    { component: "page", body },
    parent,
    `company/${slug}`
  );
  console.log(`${done}  company/${slug}  (блоков ${body.length})`);
}
