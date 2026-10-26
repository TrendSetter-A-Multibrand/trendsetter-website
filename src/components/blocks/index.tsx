import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/locales";
import type { Block } from "@/lib/storyblok/fetchStory";
import { Hero } from "@/components/blocks/Hero";
import { EventsSection } from "@/components/blocks/EventsSection";
import { NewsRow, JournalRow } from "@/components/blocks/ArticlesRow";
import { SeasonWall } from "@/components/blocks/SeasonWall";
import { CategoriesRow } from "@/components/blocks/CategoriesRow";
import { StoresSection } from "@/components/blocks/StoresSection";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { LegalArticle } from "@/components/blocks/LegalArticle";
import { ContactForm } from "@/components/blocks/ContactForm";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { TextWithPhoto } from "@/components/blocks/TextWithPhoto";
import { MissionBand } from "@/components/blocks/MissionBand";
import { PhotoCards } from "@/components/blocks/PhotoCards";
import { TeamGrid } from "@/components/blocks/TeamGrid";
import { SpaceCardsSection } from "@/components/blocks/SpaceCardsSection";
import { isLinksOnlyPage, type SpaceCardInput } from "@/lib/space";
import { AccordionList } from "@/components/blocks/AccordionList";
import { TextRows } from "@/components/blocks/TextRows";
import { Informer } from "@/components/blocks/Informer";
import { StorePlan } from "@/components/blocks/StorePlan";
import { ContactDetails } from "@/components/blocks/ContactDetails";
import { HelpCards } from "@/components/blocks/HelpCards";
import { resolveHref } from "@/lib/siteSettings";

/** As much of a Storyblok link field as we read. */
type Link = { url?: string; cached_url?: string };

/**
 * Paths are kept in Storyblok without a locale in front of them - one story then
 * serves every market - so the locale goes on here. An address to somewhere else
 * is left as it is.
 */
function href(link: unknown, locale: Locale) {
  const path = (link as Link | undefined)?.url || (link as Link | undefined)?.cached_url;
  if (!path) return undefined;
  if (/^[a-z]+:/i.test(path)) return path;
  return `/${locale}/${path.replace(/^\//, "")}`;
}

const text = (value: unknown) =>
  typeof value === "string" && value ? value : undefined;

/** A button is only a button once it has something written on it. */
function cta(label: unknown, link: unknown, locale: Locale) {
  const written = text(label);
  return written ? { label: written, href: href(link, locale) ?? "#" } : undefined;
}

/**
 * An empty asset field still arrives as an object, so it is the filename that
 * says whether anything was chosen. Nothing chosen means the component keeps the
 * picture it ships with.
 */
const image = (value: unknown) => {
  const filename = (value as { filename?: string } | undefined)?.filename;
  return filename || undefined;
};

/**
 * A blank line starts a new paragraph, which is what the field tells the editor
 * it does. Anything else in the gap - stray spaces, a third newline - is the
 * same gap.
 */
/** The nested blocks of a field, whatever the editor put in it. */
const nested = (value: unknown) => (value as Block[] | undefined) ?? [];

/** One line each, as the field says. */
const lines = (value: unknown) =>
  (text(value) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const paragraphs = (body: unknown) =>
  (text(body) ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

/**
 * Which component each block in the space draws, and how its fields reach that
 * component's props. One table rather than a file per block: our components
 * already exist with props of their own, and a wrapper each would only restate
 * these six lines.
 */
const DRAW: Record<
  string,
  (
    blok: Block,
    locale: Locale,
    path?: string,
    previous?: Block,
    next?: Block,
  ) => React.ReactNode
> = {
  // The red button is the first one, the underlined link beside it the second.
  hero: (blok, locale) => (
    <Hero
      locale={locale}
      tagline={text(blok.tagline)}
      imageSrc={image(blok.image)}
      lead={text(blok.lead)}
      descriptor={lines(blok.descriptor).length ? lines(blok.descriptor) : undefined}
      primaryCta={cta(blok.primary_label, blok.primary_link, locale)}
      secondaryCta={cta(blok.secondary_label, blok.secondary_link, locale)}
    />
  ),

  // The crumbs and the cover are one thing on every page that has them: the
  // crumbs sit in a 59 band of their own, 20 either side, and the cover follows.
  // `flush` is off - the photo runs under the header only on the home page.
  page_cover: (blok, locale) => (
    <>
      <div>
        <Breadcrumbs
          items={[
            { label: "Главная", href: `/${locale}` },
            { label: text(blok.crumb) ?? text(blok.title) ?? "" },
          ]}
        />
      </div>
      <PageCover
        title={text(blok.title) ?? ""}
        subtitle={text(blok.subtitle)}
        imageSrc={image(blok.image) ?? "/images/covers/articles.jpg"}
        flush={false}
      />
    </>
  ),

  // The file's Intro: Body L, centred, 640 at most, 64 over it (32 at 375)
  intro_text: (blok) => (
    <p className="type-body-l mx-auto max-w-[640px] px-4 pt-8 text-center md:px-10 md:pt-16">
      {text(blok.text)}
    </p>
  ),

  // Air between two blocks that carry none of their own; the editor picks how much.
  spacer: (blok) => {
    const SIZES: Record<string, string> = {
      "16": "h-4",
      "24": "h-6",
      "40": "h-10",
      "64": "h-16",
    };
    return <div aria-hidden="true" className={SIZES[text(blok.size) ?? "40"] ?? "h-10"} />;
  },

  // The head of a page's own section: an H2 and a Body L lead of up to 640,
  // 48 over it on a desktop (24 at 375) and none under, for the cards that follow
  text_section: (blok) => (
    <section className="flex flex-col gap-6 px-4 pt-6 md:gap-8 md:px-10 md:pt-12">
      <h2 className="type-h2 text-ink">{text(blok.title)}</h2>
      <p className="type-body-l max-w-[640px] text-ink">{text(blok.body)}</p>
    </section>
  ),

  // Cards that lead somewhere: a title, a line, a link and one of three icons.
  help_cards: (blok, locale) => (
    <div className="py-10">
      <HelpCards
        locale={locale}
        cards={nested(blok.cards).map((card) => ({
          title: text(card.title) ?? "",
          text: text(card.text) ?? "",
          href: resolveHref(locale, text(card.link) ?? "#"),
          icon: (["support", "phone", "faq"].includes(text(card.icon) ?? "")
            ? text(card.icon)
            : "support") as "support" | "phone" | "faq",
        }))}
      />
    </div>
  ),

  text_with_photo: (blok) => (
    <TextWithPhoto
      title={text(blok.title) ?? ""}
      body={text(blok.body) ?? ""}
      image={image(blok.image)}
    />
  ),

  // 128 of white over the red band, on a phone as on a desktop
  mission_band: (blok, _locale, _path, _previous, next) => (
    <div className="mt-32">
      <MissionBand
        heading={text(blok.heading)}
        body={text(blok.body) ?? ""}
        closing={next?.component !== "photo_cards"}
      />
    </div>
  ),

  // On the red when it follows the mission band, as on О нас; on its own, as on
  // Вакансии, it stays on white.
  photo_cards: (blok, _locale, _path, previous) => (
    <PhotoCards
      onBrand={previous?.component === "mission_band"}
      cards={nested(blok.cards).map((card) => ({
        title: text(card.title) ?? "",
        body: text(card.body) ?? "",
        image: image(card.image),
        label: text(card.label),
      }))}
    />
  ),

  team_grid: (blok) => (
    <TeamGrid
      members={nested(blok.members).map((member) => ({
        name: text(member.name) ?? "",
        role: text(member.role) ?? "",
        image: image(member.photo),
      }))}
    />
  ),

  // The tiles end on 128 of air before whatever follows - the form - unless the
  // store plan follows, which opens with that 128 itself
  space_cards: (blok, locale, path, _previous, next) => (
    <div className={next?.component === "store_plan" ? "" : "pb-32"}>
    <SpaceCardsSection
      locale={locale}
      linksOnly={isLinksOnlyPage(path)}
      cards={nested(blok.cards).map((card) => ({
        title: text(card.title) ?? "",
        body: text(card.body) ?? "",
        image: image(card.image),
        href: href(card.link, locale),
        sectionKey: text(card.section_key),
        availability: nested(card.availability) as SpaceCardInput["availability"],
      }))}
    />
    </div>
  ),

  store_plan: (blok) => (
    <StorePlan
      label={text(blok.label)}
      title={text(blok.title) ?? ""}
      text={text(blok.text)}
      image={image(blok.image)}
      zones={nested(blok.zones).map((zone) => ({
        name: text(zone.name) ?? "",
        kind: text(zone.kind),
        body: text(zone.body),
        image: image(zone.photo),
      }))}
    />
  ),

  accordion_list: (blok) => (
    <AccordionList
      heading={text(blok.heading)}
      items={nested(blok.items).map((item) => ({
        question: text(item.question) ?? "",
        answer: text(item.answer) ?? "",
      }))}
    />
  ),

  informer: (blok, locale) => (
    <Informer
      title={text(blok.title) ?? ""}
      text={text(blok.text)}
      label={text(blok.button_label)}
      href={text(blok.link) ? resolveHref(locale, text(blok.link) ?? "#") : undefined}
      icon={blok.icon === true || blok.icon === "true"}
    />
  ),

  text_rows: (blok) => (
    <TextRows
      rows={nested(blok.rows).map((row) => ({
        title: text(row.title) ?? "",
        body: text(row.body) ?? "",
      }))}
    />
  ),

  contact_details: (blok) => (
    <ContactDetails
      groups={nested(blok.groups).map((group) => ({
        title: text(group.title) ?? "",
        lines: lines(group.lines),
      }))}
    />
  ),

  // The old heading, "Последние новости", is what the file now calls "Новости"
  news_row: (blok, locale) => (
    <NewsRow
      heading={text(blok.heading) === "Последние новости" ? undefined : text(blok.heading)}
      locale={locale}
    />
  ),
  events_row: (blok, locale) => (
    <EventsSection heading={text(blok.heading)} locale={locale} />
  ),
  journal_row: (blok, locale) => (
    <JournalRow heading={text(blok.heading)} locale={locale} />
  ),

  // The two below carry the air around them: the shops block has none of its own
  // so the Магазины page can sit it flush under the breadcrumbs, and the red
  // band runs to the page edges, so its 40 has to sit outside it.
  stores_row: (blok) => (
    <div className="pt-16 md:pt-32">
      <StoresSection heading={text(blok.heading)} />
    </div>
  ),

  // The giant lowercase wall that changes with the season; 128 of air above it
  season_wall: (blok, locale) => (
    <div className="mt-16 md:mt-32">
      <SeasonWall
        dark={text(blok.dark)}
        red={text(blok.red)}
        label={text(blok.label)}
        title={text(blok.title) ?? ""}
        text={text(blok.text)}
        linkLabel={text(blok.link_label)}
        href={href(blok.link, locale)}
        image={image(blok.image)}
      />
    </div>
  ),

  categories_row: (blok, locale) => (
    <CategoriesRow
      heading={text(blok.heading)}
      href={`/${locale}/brands`}
      items={nested(blok.tiles).map((tile) => ({
        label: text(tile.label) ?? "",
        href: href(tile.link, locale) ?? "#",
        image: image(tile.image),
      }))}
    />
  ),
  legal_article: (blok, locale) => (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: `/${locale}` },
          { label: text(blok.title) ?? "" },
        ]}
      />
      <LegalArticle
        title={text(blok.title) ?? ""}
        note={text(blok.note)}
        sections={nested(blok.sections).map((section) => ({
        heading: text(section.heading),
        paragraphs: paragraphs(section.body),
      }))}
      />
    </>
  ),
  contact_form: (blok, locale) => (
    <ContactForm locale={locale} heading={text(blok.heading)} />
  ),

  // The crumbs belong to the block rather than to the page: the file drops them
  // 20 lower here than the header leaves them, then the band with the page's name
  // (the file draws it with no line under it), then the bar of chips and the groups.
  faq: (blok, locale) => (
    <>
      <div>
        <Breadcrumbs
          items={[
            { label: "Главная", href: `/${locale}` },
            { label: text(blok.crumb) ?? "FAQ" },
          ]}
        />
      </div>
      <PageCover title={text(blok.title) ?? "Частые вопросы"} />
      <FaqAccordion
        groups={nested(blok.groups).map((group) => ({
          title: text(group.title) ?? "",
          items: nested(group.items).map((item) => ({
            question: text(item.question) ?? "",
            answer: text(item.answer) ?? "",
          })),
        }))}
      />
    </>
  ),

  newsletter: (blok, locale) => (
    <div className="mt-16 md:mt-32">
      <NewsletterSignup
        locale={locale}
        heading={text(blok.heading)}
        description={text(blok.description)}
        imageSrc={image(blok.image)}
      />
    </div>
  ),
};

/**
 * The sections of a story, in the order the editor put them. `path` is the
 * page's own slug without the locale, for the few blocks that draw differently
 * on one page (the Collaborations cards are only links).
 */
export function Blocks({
  body,
  locale,
  path,
}: {
  body: Block[];
  locale: Locale;
  path?: string;
}) {
  return body.map((blok, i) => {
    const draw = DRAW[blok.component];
    if (!draw) return null;
    // "Скрыть блок на сайте": the block stays in Storyblok, not on the page
    if (blok.hidden === true || blok.hidden === "true") return null;
    return <Fragment key={blok._uid}>{draw(blok, locale, path, body[i - 1], body[i + 1])}</Fragment>;
  });
}
