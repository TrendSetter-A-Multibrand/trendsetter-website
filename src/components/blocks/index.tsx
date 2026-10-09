import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/locales";
import type { Block } from "@/lib/storyblok/fetchStory";
import { Hero } from "@/components/blocks/Hero";
import { EventsSection } from "@/components/blocks/EventsSection";
import { NewsRow, JournalRow } from "@/components/blocks/ArticlesRow";
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
  (blok: Block, locale: Locale, path?: string) => React.ReactNode
> = {
  // The file calls the red button the first one; Hero has had them the other way
  // round since it was built, where `primaryCta` is the pale one on the left.
  hero: (blok, locale) => (
    <Hero
      locale={locale}
      tagline={text(blok.tagline)}
      imageSrc={image(blok.image)}
      primaryCta={cta(blok.secondary_label, blok.secondary_link, locale)}
      secondaryCta={cta(blok.primary_label, blok.primary_link, locale)}
    />
  ),

  // The crumbs and the cover are one thing on every page that has them: the
  // crumbs sit in a 59 band of their own, 20 either side, and the cover follows.
  // `flush` is off - the photo runs under the header only on the home page.
  page_cover: (blok, locale) => (
    <>
      <div className="lg:py-5">
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

  // 24 mono across the whole measure, centred, with 40 of air over it on lg;
  // at 375 that drops to 14 mono with 16 of air over it.
  intro_text: (blok) => (
    <p className="px-4 pt-4 text-center font-mono text-sm lg:px-10 lg:pt-10 lg:text-2xl/[31.2px]">
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

  // A heading and its paragraph across the whole measure - what Вакансии opens
  // on. 40 over it and 40 under it, so what follows needs no air of its own.
  text_section: (blok) => (
    <section className="px-6 py-10 lg:px-10">
      <h2 className="text-2xl font-medium lg:text-[32px]/[38.72px]">
        {text(blok.title)}
      </h2>
      <p className="mt-6 text-base lg:text-2xl/[29px]">{text(blok.body)}</p>
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

  mission_band: (blok) => (
    <MissionBand heading={text(blok.heading)} body={text(blok.body) ?? ""} />
  ),

  photo_cards: (blok) => (
    <PhotoCards
      cards={nested(blok.cards).map((card) => ({
        title: text(card.title) ?? "",
        body: text(card.body) ?? "",
        image: image(card.image),
      }))}
    />
  ),

  team_grid: (blok) => (
    <TeamGrid
      members={nested(blok.members).map((member) => ({
        name: text(member.name) ?? "",
        role: text(member.role) ?? "",
      }))}
    />
  ),

  space_cards: (blok, locale, path) => (
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
  ),

  contact_details: (blok) => (
    <ContactDetails
      groups={nested(blok.groups).map((group) => ({
        title: text(group.title) ?? "",
        lines: lines(group.lines),
      }))}
    />
  ),

  news_row: (blok, locale) => (
    <NewsRow heading={text(blok.heading)} locale={locale} />
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
    <div className="pt-6 lg:pt-[120px]">
      <StoresSection heading={text(blok.heading)} />
    </div>
  ),
  legal_article: (blok) => (
    <LegalArticle
      title={text(blok.title) ?? ""}
      sections={nested(blok.sections).map((section) => ({
        heading: text(section.heading),
        paragraphs: paragraphs(section.body),
      }))}
    />
  ),
  contact_form: (blok, locale) => (
    <ContactForm locale={locale} heading={text(blok.heading)} />
  ),

  // The crumbs belong to the block rather than to the page: the file drops them
  // 20 lower here than the header leaves them, and the whole gap to the chips
  // below is the block's own - 44 on lg, 16 at 375.
  faq: (blok, locale) => (
    <>
      <div className="lg:pt-5">
        <Breadcrumbs
          items={[
            { label: "Главная", href: `/${locale}` },
            { label: text(blok.crumb) ?? "FAQ" },
          ]}
        />
      </div>
      <div className="pt-4 lg:pt-11">
        <FaqAccordion
          groups={nested(blok.groups).map((group) => ({
            title: text(group.title) ?? "",
            items: nested(group.items).map((item) => ({
              question: text(item.question) ?? "",
              answer: text(item.answer) ?? "",
            })),
          }))}
        />
      </div>
    </>
  ),

  newsletter: (blok, locale) => (
    <div className="mt-6 lg:mt-10">
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
  return body.map((blok) => {
    const draw = DRAW[blok.component];
    if (!draw) return null;
    // "Скрыть блок на сайте": the block stays in Storyblok, not on the page
    if (blok.hidden === true || blok.hidden === "true") return null;
    return <Fragment key={blok._uid}>{draw(blok, locale, path)}</Fragment>;
  });
}
