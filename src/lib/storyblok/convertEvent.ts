/**
 * The pure part of scripts/storyblok-convert-events.mts: an article carrying a
 * placement_event becomes a news_event story. Kept free of imports so the
 * script can load it by path and the tests can load it by alias.
 */
type Content = Record<string, unknown> & { placements?: unknown };
type Blok = Record<string, unknown> & { component?: string };

const blocks = (content: Content): Blok[] =>
  Array.isArray(content.placements) ? (content.placements as Blok[]) : [];

const first = (content: Content, component: string) =>
  blocks(content).find((b) => b.component === component);

/** Has the article got a «Ближайшие события» placement. */
export const hasEventPlacement = (content: Content) =>
  first(content, "placement_event") !== undefined;

const hasValue = (value: unknown) => value !== undefined && value !== null && value !== "";

/**
 * The news_event content of an article: every field of the article except
 * section, placements and the old event pointer, plus the event's own fields
 * from its first placement_event (and the sections from placement_space).
 * The root _uid is kept. Null when there is no placement_event.
 */
export function buildNewsEventContent(content: Content): Content | null {
  const event = first(content, "placement_event");
  if (!event) return null;
  const space = first(content, "placement_space");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { section, placements, event: pointer, ...rest } = content;
  const image = event.card_image as { filename?: string } | undefined;

  return {
    ...rest,
    component: "news_event",
    date: event.date ?? "",
    location: event.location ?? "",
    card_title: event.card_title ?? "",
    ...(image?.filename ? { card_image: image } : {}),
    card_description: event.card_description ?? "",
    cta_label: event.cta_label || "Подробнее",
    signup_enabled: event.signup_enabled !== false && event.signup_enabled !== "false",
    ...(hasValue(event.seats) ? { seats: String(event.seats) } : {}),
    ...(space && Array.isArray(space.space_sections)
      ? { space_sections: space.space_sections }
      : {}),
  };
}

/**
 * An article with the event leftovers taken out: placement_event and
 * placement_space dropped from placements, the old event pointer emptied.
 * The component stays what it was.
 */
export function stripEventContent(content: Content): Content {
  return {
    ...content,
    placements: blocks(content).filter(
      (b) => b.component !== "placement_event" && b.component !== "placement_space",
    ),
    event: "",
  };
}
