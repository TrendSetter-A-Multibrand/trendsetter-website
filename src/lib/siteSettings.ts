import { fetchStory } from "@/lib/storyblok/fetchStory";
import {
  DEFAULT_SETTINGS,
  type FooterColumn,
  type SiteSettings,
} from "@/lib/siteDefaults";
import type { NavItem, SocialLink } from "@/lib/navigation";
import type { TickerTone } from "@/components/blocks/PromoTicker";

export { DEFAULT_SETTINGS };
export type { FooterColumn, FooterLink, SiteSettings } from "@/lib/siteDefaults";

type Blok = { _uid?: string; [field: string]: unknown };

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const list = (value: unknown): Blok[] => (Array.isArray(value) ? value : []);

const TONES: TickerTone[] = ["red", "yellow", "green", "blue"];
const ICONS = ["telegram", "vk", "max"];

/** Storyblok keeps a checkbox as a boolean, but an old story may have a string. */
const flag = (value: unknown, fallback: boolean) =>
  value === undefined || value === "" ? fallback : value === true || value === "true";

function nav(content: Blok): NavItem[] {
  const items = list(content.nav)
    .map((item) => {
      const children = list(item.children)
        .map((child) => ({ label: str(child.label), slug: str(child.slug) }))
        .filter((child) => child.label && child.slug);
      return {
        label: str(item.label),
        slug: str(item.slug),
        ...(children.length ? { children } : {}),
      };
    })
    .filter((item) => item.label && item.slug);
  return items.length ? items : DEFAULT_SETTINGS.nav;
}

function columns(content: Blok): FooterColumn[] {
  const found = list(content.footer_columns)
    .map((column) => ({
      title: str(column.title),
      links: list(column.links)
        .map((link) => ({ label: str(link.label), path: str(link.path) }))
        .filter((link) => link.label && link.path),
    }))
    .filter((column) => column.title);
  return found.length ? found : DEFAULT_SETTINGS.footer.columns;
}

function socials(content: Blok): SocialLink[] {
  const found = list(content.socials)
    .map((social) => ({
      label: str(social.label),
      href: str(social.href) || "#",
      icon: `/images/social/${
        ICONS.includes(str(social.icon)) ? str(social.icon) : "telegram"
      }.svg`,
    }))
    .filter((social) => social.label);
  return found.length ? found : DEFAULT_SETTINGS.socials;
}

/** Read from the "settings" story; everything the editor left empty is a default. */
export async function getSiteSettings(): Promise<SiteSettings> {
  let content: Blok | undefined;
  try {
    content = (await fetchStory<Blok>("settings"))?.content;
  } catch {
    // A page without its menu is worse than a menu a day behind
    content = undefined;
  }
  if (!content) return DEFAULT_SETTINGS;

  const d = DEFAULT_SETTINGS;
  const tone = str(content.ticker_tone) as TickerTone;

  return {
    ticker: {
      enabled: flag(content.ticker_enabled, d.ticker.enabled),
      text: str(content.ticker_text) || d.ticker.text,
      ctaLabel: str(content.ticker_cta) || d.ticker.ctaLabel,
      href: str(content.ticker_link) || d.ticker.href,
      tone: TONES.includes(tone) ? tone : d.ticker.tone,
    },
    nav: nav(content),
    footer: {
      columns: columns(content),
      cooperationTitle:
        str(content.footer_cooperation_title) || d.footer.cooperationTitle,
      email: str(content.footer_email) || d.footer.email,
    },
    socials: socials(content),
  };
}

/** A path in the editor's hand is relative to the market; a full address is not. */
export function resolveHref(locale: string, value: string) {
  if (/^(https?:|mailto:|tel:|#|\/)/.test(value)) return value;
  return `/${locale}/${value}`;
}
