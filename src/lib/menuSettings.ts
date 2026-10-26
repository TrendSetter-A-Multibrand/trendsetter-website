import { DEFAULT_SETTINGS, type FooterColumn } from "./siteDefaults.ts";
import type { NavItem } from "./navigation.ts";

type Blok = { _uid?: string; [field: string]: unknown };

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const list = (value: unknown): Blok[] => (Array.isArray(value) ? value : []);

/** A checkbox is a boolean in Storyblok, a string in an old story, absent before the field existed. */
export const isHidden = (value: unknown) => value === true || value === "true";

/**
 * Off the site for now, whatever the Storyblok menu says - the content is not
 * ready (gift cards, loyalty, the company's cooperation, careers and feedback,
 * the journal's sub-sections). Nothing is deleted: empty these lists, or the
 * editor's own `hidden` switch, and the entries are back.
 */
const OFF_SLUGS = new Set([
  "loyalty",
  "gift-cards",
  "gift-card",
  "people",
  "finds",
  "community",
  "cooperation",
  "careers",
  "feedback",
]);
const OFF_LABELS = new Set([
  "система лояльности",
  "подарочные карты",
  "подарочная карта",
  "обратная связь",
  "сотрудничество",
  "вакансии",
]);
/**
 * Pages the redesign has drawn since the menu was written: they are on the site
 * whatever the editor's `hidden` switch or the lists above still say. Careers
 * belongs to the company's dropdown; the loyalty and gift-card pages to the
 * footer's links (the header has no entry for them in the file).
 */
const READY_IN_MENU = new Set(["careers"]);
const READY_IN_FOOTER = new Set(["careers", "loyalty", "gift-cards", "gift-card"]);
const lastOf = (slug: string) => slug.trim().replace(/^\/+|\/+$/g, "").split("/").pop() ?? "";

const labelOff = (label: string) => OFF_LABELS.has(label.trim().toLowerCase());
const slugOff = (slug: string) => OFF_SLUGS.has(slug.trim().replace(/^\/+|\/+$/g, "").split("/").pop() ?? "");

/** The same entry without the `hidden` flag, which only the filters below need. */
function plain<T extends { hidden?: boolean }>(entry: T): Omit<T, "hidden"> {
  const copy = { ...entry };
  delete copy.hidden;
  return copy;
}

/** What the visitor sees: hidden entries gone, and no empty dropdown left behind. */
export function visibleNav(items: NavItem[]): NavItem[] {
  return items
    .filter((item) => !item.hidden && !slugOff(item.slug) && !labelOff(item.label))
    .map((item) => {
      const { children, ...rest } = plain(item);
      const shown = (children ?? []).filter(
        (child) =>
          READY_IN_MENU.has(lastOf(child.slug)) ||
          (!child.hidden && !slugOff(child.slug) && !labelOff(child.label)),
      ).map(plain);
      return shown.length ? { ...rest, children: shown } : rest;
    });
}

export function visibleColumns(columns: FooterColumn[]): FooterColumn[] {
  return columns.map((column) => ({
    ...column,
    links: column.links.filter(
      (link) =>
        READY_IN_FOOTER.has(lastOf(link.path)) ||
        (!link.hidden && !slugOff(link.path) && !labelOff(link.label)),
    ).map(plain),
  }));
}

/**
 * Hidden entries are still entries: a menu where the editor hid everything stays
 * empty rather than falling back to the defaults, which are filtered the same way.
 */
export function nav(content: Blok): NavItem[] {
  const items = list(content.nav)
    .map((item) => {
      const children = list(item.children)
        .map((child) => ({
          label: str(child.label),
          slug: str(child.slug),
          ...(isHidden(child.hidden) ? { hidden: true } : {}),
        }))
        .filter((child) => child.label && child.slug);
      return {
        label: str(item.label),
        slug: str(item.slug),
        ...(isHidden(item.hidden) ? { hidden: true } : {}),
        ...(children.length ? { children } : {}),
      };
    })
    .filter((item) => item.label && item.slug);
  return visibleNav(items.length ? items : DEFAULT_SETTINGS.nav);
}

/**
 * The events page came after the editor wrote the menu: it goes in after the
 * news unless the editor has already placed it (hidden counts as placed). Done on
 * the visible menu, so an empty or all-hidden one stays empty.
 */
export function withEvents(items: NavItem[]): NavItem[] {
  if (!items.length || items.some((item) => item.slug === "events")) return items;
  const at = items.findIndex((item) => item.slug === "news");
  const next = [...items];
  next.splice(at >= 0 ? at + 1 : next.length, 0, { label: "События", slug: "events" });
  return next;
}

export function columns(content: Blok): FooterColumn[] {
  const found = list(content.footer_columns)
    .map((column) => ({
      title: str(column.title),
      links: list(column.links)
        .map((link) => ({
          label: str(link.label),
          path: str(link.path),
          ...(isHidden(link.hidden) ? { hidden: true } : {}),
        }))
        .filter((link) => link.label && link.path),
    }))
    .filter((column) => column.title);
  // A footer written for the old design - a «Меню» group and one for cooperation
  // - gives way to the file's four groups until the editor has written its own
  const old = found.some((column) => ["меню", "сотрудничество"].includes(column.title.toLowerCase()));
  return visibleColumns(found.length && !old ? found : DEFAULT_SETTINGS.footer.columns);
}
