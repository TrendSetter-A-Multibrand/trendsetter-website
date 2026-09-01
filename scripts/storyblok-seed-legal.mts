/**
 * Puts the four legal documents into the space, taking the text from
 * src/lib/legal.ts - where it was lifted out of the designer's PDF exports and
 * so has never been retyped by hand.
 *
 * The file stays the source: a space brought up from nothing is one run away
 * from having these four pages, and nobody has to paste two hundred clauses
 * into a browser.
 *
 * node --env-file=.env.local scripts/storyblok-seed-legal.mts
 */
import { LEGAL_PAGES } from "../src/lib/legal.ts";

const HOSTS: Record<string, string> = {
  eu: "mapi.storyblok.com",
  us: "api-us.storyblok.com",
  ap: "api-ap.storyblok.com",
  ca: "api-ca.storyblok.com",
};

const space = process.env.STORYBLOK_SPACE_ID;
const token = process.env.STORYBLOK_PERSONAL_TOKEN;
const host = HOSTS[process.env.STORYBLOK_REGION ?? "eu"];

if (!space || !token) {
  console.error("Нужны STORYBLOK_SPACE_ID и STORYBLOK_PERSONAL_TOKEN");
  process.exit(1);
}

const api = async (path: string, init: RequestInit = {}) => {
  const response = await fetch(`https://${host}/v1/spaces/${space}${path}`, {
    ...init,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} -> ${response.status}\n${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
};

const block = (component: string, fields: Record<string, unknown>) => ({
  _uid: crypto.randomUUID(),
  component,
  ...fields,
});

for (const page of LEGAL_PAGES) {
  const content = {
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
  };

  const { stories } = await api(`/stories?with_slug=${page.slug}`);
  const existing = stories[0];

  if (existing) {
    await api(`/stories/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify({
        story: { name: page.title, slug: page.slug, content },
        publish: 1,
      }),
    });
    console.log(`обновлена  ${page.slug}  (разделов ${page.sections.length})`);
  } else {
    await api("/stories", {
      method: "POST",
      body: JSON.stringify({
        story: { name: page.title, slug: page.slug, content_type: "page", content },
        publish: 1,
      }),
    });
    console.log(`создана    ${page.slug}  (разделов ${page.sections.length})`);
  }
}
