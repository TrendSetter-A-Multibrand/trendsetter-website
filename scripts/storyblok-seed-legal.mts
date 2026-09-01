/**
 * Puts the four legal documents and the FAQ into the space, taking the text from
 * src/lib/legal.ts - where it was lifted out of the designer's PDF exports and
 * so has never been retyped by hand.
 *
 * The file stays the source: a space brought up from nothing is one run away
 * from having these pages, and nobody has to paste two hundred clauses into a
 * browser.
 *
 * npm run storyblok:seed-legal
 */
import { LEGAL_PAGES, FAQ_GROUPS } from "../src/lib/legal.ts";
import { block, putStory } from "./mapi.mjs";

for (const page of LEGAL_PAGES) {
  const done = await putStory(page.slug, page.title, {
    component: "page",
    body: [
      block("legal_article", {
        title: page.title,
        sections: page.sections.map((section) =>
          block("legal_section", {
            heading: section.heading ?? "",
            // A blank line between paragraphs is how the field reads them back
            body: section.paragraphs.join("\n\n"),
          })
        ),
      }),
      block("contact_form", {}),
    ],
  });
  console.log(`${done}  ${page.slug}  (разделов ${page.sections.length})`);
}

const done = await putStory("faq", "Часто задаваемые вопросы", {
  component: "page",
  body: [
    block("faq", {
      crumb: "FAQ",
      groups: FAQ_GROUPS.map((group) =>
        block("faq_group", {
          title: group.title,
          items: group.items.map((item) =>
            block("faq_item", { question: item.question, answer: item.answer })
          ),
        })
      ),
    }),
    block("contact_form", {}),
  ],
});
console.log(`${done}  faq  (групп ${FAQ_GROUPS.length})`);
