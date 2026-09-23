"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { CardImage } from "@/components/ui/CardImage";
import { CardScrim } from "@/components/ui/CardScrim";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useCarousel } from "@/lib/useCarousel";
import { tagHref } from "@/lib/articles";
import { useLocale } from "@/lib/i18n/useLocale";

type JournalItem = {
  tags: string[];
  title: string;
  excerpt?: string;
  href?: string;
  image?: string;
};

type JournalCarouselProps = {
  heading?: string;
  items: JournalItem[];
};

export function JournalCarousel({
  heading = "Журнал",
  items,
}: JournalCarouselProps) {
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  useCarousel(trackRef, { autoplay: true });

  // No records, no row: a heading over a blank strip is worse than nothing.
  // The shops section already answers this way.
  if (items.length === 0) return null;

  return (
    <section className="px-4 pt-10 lg:px-10">
      <SectionTitle
        heading={heading}
        trackRef={trackRef}
        controls="arrows"
        className="mb-6 lg:mb-10"
      />

      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:snap-none sm:gap-10 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // The photo is the click target, so the link is stretched over the
          // whole card and the tags ride above it. The stack below the tags
          // lets clicks through to it rather than swallowing them.
          <div
            key={i}
            className="on-dark group relative h-[430px] w-full shrink-0 snap-center overflow-hidden sm:w-[calc(50%-20px)] sm:snap-align-none"
          >
            <CardImage src={item.image} sizes="(min-width: 640px) 900px, 320px" />
            <CardScrim />

            <Link
              href={item.href ?? "#"}
              aria-label={item.title}
              className="absolute inset-0 z-10"
            />

            <p className="absolute left-4 top-4 z-20 font-mono text-sm/[18px] font-medium uppercase tracking-[1px] text-white lg:left-6 lg:top-6">
              {item.tags.map((tag, t) => (
                <Fragment key={tag}>
                  {t > 0 && " "}
                  <Link
                    href={tagHref(locale, "journal", tag)}
                    className="hover:underline"
                  >
                    [{tag}]
                  </Link>
                </Fragment>
              ))}
            </p>

            {/* Title and write-up both stand at the foot at rest, 16 apart; it is
                the button that arrives on hover, lifting them by its own 48 and
                the 24 above it. Below lg the button starts open, since
                `group-hover` never fires on touch. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 text-white lg:p-6">
              <div className="flex flex-col gap-4">
                <p className="text-xl/[26px] font-medium sm:text-2xl/[29px]">
                  {item.title}
                </p>
                {item.excerpt && (
                  <p className="text-[13px]/[15px] lg:text-base/5">{item.excerpt}</p>
                )}
              </div>

              <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-200 lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <div className="pt-4 lg:pt-6">
                    <span
                      className={`${buttonClass("whiteOpacity")} w-full backdrop-blur-[2px]`}
                    >
                      Читать
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
