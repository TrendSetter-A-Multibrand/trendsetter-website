import { fetchStory } from "@/lib/storyblok/fetchStory";
import {
  DEFAULT_SETTINGS,
  type Cover,
  type FooterColumn,
  type SubjectOption,
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

/** An asset field arrives as an object even when empty; the filename is the answer. */
function cover(content: Blok, key: string, fallback: Cover): Cover {
  const image = content[`${key}_cover_image`] as { filename?: string } | undefined;
  return {
    title: str(content[`${key}_cover_title`]) || fallback.title,
    subtitle: str(content[`${key}_cover_subtitle`]) || fallback.subtitle,
    image: image?.filename || fallback.image,
  };
}

/** One subject a line; "длинное | короткое" gives the phone its own wording. */
function subjects(value: unknown, fallback: SubjectOption[]): SubjectOption[] {
  const found = str(value)
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([long]) => long)
    .map(([long, short]) => (short ? { value: long, short } : { value: long }));
  return found.length ? found : fallback;
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
    notFound: {
      heading: str(content.not_found_heading) || d.notFound.heading,
      cta: str(content.not_found_cta) || d.notFound.cta,
    },
    search: {
      heading: str(content.search_heading) || d.search.heading,
      placeholder: str(content.search_placeholder) || d.search.placeholder,
      empty: str(content.search_empty) || d.search.empty,
      recommended: str(content.search_recommended) || d.search.recommended,
      filters: {
        all: str(content.search_filter_all) || d.search.filters.all,
        news: str(content.search_filter_news) || d.search.filters.news,
        journal: str(content.search_filter_journal) || d.search.filters.journal,
      },
    },
    form: {
      placeholder: str(content.form_placeholder) || d.form.placeholder,
      subjects: subjects(content.form_subjects, d.form.subjects),
      button: str(content.form_button) || d.form.button,
      sent: str(content.form_sent) || d.form.sent,
      subjectPlaceholder:
        str(content.form_subject_placeholder) || d.form.subjectPlaceholder,
      namePlaceholder:
        str(content.form_name_placeholder) || d.form.namePlaceholder,
      emailPlaceholder:
        str(content.form_email_placeholder) || d.form.emailPlaceholder,
      consent: str(content.form_consent) || d.form.consent,
    },
    covers: {
      journal: cover(content, "journal", d.covers.journal),
      news: cover(content, "news", d.covers.news),
      brands: cover(content, "brands", d.covers.brands),
    },
    storesHeading: str(content.stores_heading) || d.storesHeading,
    ticker: {
      enabled: flag(content.ticker_enabled, d.ticker.enabled),
      text: str(content.ticker_text) || d.ticker.text,
      ctaLabel: str(content.ticker_cta) || d.ticker.ctaLabel,
      href: str(content.ticker_link) || d.ticker.href,
      tone: TONES.includes(tone) ? tone : d.ticker.tone,
    },
    cookieText: str(content.cookie_text) || d.cookieText,
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
