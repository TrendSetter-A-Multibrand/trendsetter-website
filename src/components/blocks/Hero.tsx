import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { buttonClass } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";

type HeroProps = {
  locale: Locale;
  tagline?: string;
  /** A sentence under the headline. */
  lead?: string;
  /** The categories in brackets above it, one per entry. */
  descriptor?: string[];
  /** The red button. */
  primaryCta?: { label: string; href: string };
  /** The underlined link beside it. */
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
};

/**
 * The headline was written in capitals for the old design. The new one sets it in
 * sentence case, so a line typed wholly in capitals is brought down to one.
 */
function sentenceCase(text: string) {
  if (text !== text.toUpperCase() || text === text.toLowerCase()) return text;
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

const DESCRIPTOR = ["Одежда", "Дом", "Еда", "Мастерская", "Ателье"];

/**
 * The file's Home hero. A desktop screen is split: the text on the left six
 * columns - the categories in brackets at the top, then at the foot the headline
 * in Display, a lead in Body L held to 420 and the two actions - and the photo
 * on the right, running off the edge of the screen. The block is the window less
 * the bar above it, 920 at most, so the first screen ends exactly at the fold.
 *
 * On a phone the photo comes first, edge to edge (240 tall), then the headline,
 * the lead and the red button across the full width, then the link, and last the
 * categories as one line that swipes between two rules.
 */
export function Hero({
  locale,
  tagline = "Доверьте поиск нам, а выбор — себе",
  lead = "Отбираем одежду, вещи для дома и косметику известных брендов — и привозим их в магазины рядом с вами.",
  descriptor = DESCRIPTOR,
  primaryCta = { label: "Найти магазин", href: `/${locale}/stores` },
  secondaryCta = { label: "Читать журнал", href: `/${locale}/journal` },
  imageSrc = "/images/home/hero.jpg",
}: HeroProps) {
  const tags = descriptor.map((word, i) => `[${i + 1}] ${word}`);

  return (
    <section className="flex flex-col md:h-[min(920px,calc(100svh-var(--header-h,116px)))] md:min-h-[560px] md:flex-row">
      <div className="flex flex-col md:justify-between md:py-12 md:pl-10 md:max-[1199px]:w-1/2 md:max-[1199px]:pr-[63px] min-[1200px]:w-[46.3%]">
        {/* Desktop: a row at the top of the column */}
        <p className="type-caption hidden gap-4 whitespace-nowrap text-ink md:flex">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </p>

        {/* The photo leads on a phone */}
        <div className="relative h-60 w-full md:hidden">
          {imageSrc && (
            <Image src={imageSrc} alt="" fill priority sizes="100vw" className="object-cover" />
          )}
        </div>

        <div className="flex flex-col gap-6 px-4 pt-6 md:gap-8 md:p-0">
          <h1 className="type-display text-ink">{sentenceCase(tagline)}</h1>
          <p className="type-body-l max-w-[420px] text-ink">{lead}</p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <Link
              href={primaryCta.href}
              className={`${buttonClass("primary", "L")} w-full md:w-auto`}
            >
              {primaryCta.label}
            </Link>
            <LinkArrow href={secondaryCta.href} className="self-start">
              {secondaryCta.label}
            </LinkArrow>
          </div>

          {/* Phone: the categories as a swiping line between two rules */}
          <p className="type-caption -mx-4 flex gap-4 overflow-x-auto whitespace-nowrap border-y border-line px-4 py-3 text-ink [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {tags.map((tag) => (
              <span key={tag} className="shrink-0">
                {tag}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* The 63 between the text and the photo, from 1200 up where the text column has no padding of its own on that side */}
      <div aria-hidden="true" className="hidden w-[63px] shrink-0 min-[1200px]:block" />

      {/* Desktop photo: fills the right half and runs to the edge */}
      <div className="relative hidden flex-1 md:block">
        {imageSrc && (
          <Image src={imageSrc} alt="" fill priority sizes="50vw" className="object-cover" />
        )}
      </div>
    </section>
  );
}
