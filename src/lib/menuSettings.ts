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
        (child) => !child.hidden && !slugOff(child.slug) && !labelOff(child.label),
      ).map(plain);
      return shown.length ? { ...rest, children: shown } : rest;
    });
}

export function visibleColumns(columns: FooterColumn[]): FooterColumn[] {
  return columns.map((column) => ({
    ...column,
    links: column.links.filter(
      (link) => !link.hidden && !slugOff(link.path) && !labelOff(link.label),
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
  return visibleColumns(found.length ? found : DEFAULT_SETTINGS.footer.columns);
}
