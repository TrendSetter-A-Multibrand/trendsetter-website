/**
 * The first fill of the "settings" story - the strip above the header, the menu,
 * the footer and the social tiles - taken from what the code carried until now,
 * so the site looks the same the moment it starts reading from here.
 *
 * It only ever creates. Once the story exists it is the editor's, and running
 * this again would overwrite her work with the defaults; --force says that is
 * what is wanted.
 *
 * npm run storyblok:seed-settings
 */
import { DEFAULT_SETTINGS as d } from "../src/lib/siteDefaults.ts";
import { api, block, putStory } from "./mapi.mjs";

const { stories } = await api("/stories?with_slug=settings");
if (stories[0] && !process.argv.includes("--force")) {
  console.log("settings уже есть и теперь принадлежит редактору - пропускаю");
  process.exit(0);
}

const icon = (path: string) => path.split("/").pop()!.replace(".svg", "");

const content = {
  component: "site_settings",
  ticker_enabled: d.ticker.enabled,
  ticker_text: d.ticker.text,
  ticker_cta: d.ticker.ctaLabel,
  ticker_link: d.ticker.href,
  ticker_tone: d.ticker.tone,
  nav: d.nav.map((item) =>
    block("nav_item", {
      label: item.label,
      slug: item.slug,
      children: (item.children ?? []).map((child) =>
        block("nav_link", { label: child.label, slug: child.slug })
      ),
    })
  ),
  footer_columns: d.footer.columns.map((column) =>
    block("footer_column", {
      title: column.title,
      links: column.links.map((link) =>
        block("footer_link", { label: link.label, path: link.path })
      ),
    })
  ),
  footer_cooperation_title: d.footer.cooperationTitle,
  footer_email: d.footer.email,
  socials: d.socials.map((social) =>
    block("social_link", {
      label: social.label,
      href: social.href,
      icon: icon(social.icon),
    })
  ),
};

console.log(`${await putStory("settings", "Настройки сайта", content)}  settings`);
