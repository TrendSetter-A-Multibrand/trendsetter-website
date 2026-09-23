"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useCarousel } from "@/lib/useCarousel";
import { tagHref } from "@/lib/articles";
import { useLocale } from "@/lib/i18n/useLocale";

type NewsItem = {
  tags: string[];
  title: string;
  href?: string;
  image?: string;
};

type NewsGridProps = {
  heading?: string;
  items: NewsItem[];
};

export function NewsGrid({
  heading = "Последние новости",
  items,
}: NewsGridProps) {
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  // Dragging the row and the row walking on by itself both move the same scroll
  // position the red block is already following, so it keeps up either way
  useCarousel(trackRef, { autoplay: true });

  // No records, no row: a heading over a blank strip is worse than nothing.
  // The shops section already answers this way.
  if (items.length === 0) return null;

  return (
    <section className="px-4 pt-10 lg:px-10">
      {/* The file leaves 40 from the heading to the row, and nothing above it */}
      <SectionTitle
        heading={heading}
        trackRef={trackRef}
        controls="bar"
        className="mb-6 lg:mb-10"
      />

      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:snap-none sm:gap-10 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // Photo and title lead to the piece, each tag to the news page cut
          // down to that tag - so three links, not one wrapping the card
          <div
            key={i}
            className="group flex w-full shrink-0 snap-center flex-col sm:w-[calc(50%-20px)] sm:snap-align-none lg:w-[calc(25%-30px)]"
          >
            {/* Square now, 430x430 four across */}
            <Link
              href={item.href ?? "#"}
              tabIndex={-1}
              aria-hidden="true"
              className="relative aspect-square w-full overflow-hidden"
            >
              <CardImage
                src={item.image}
                sizes="(min-width: 1024px) 430px, (min-width: 640px) 50vw, 320px"
                label="Читать"
              />
            </Link>
            <p className="mt-6 font-mono text-sm/[18px] font-medium uppercase tracking-[1px] text-brand">
              {item.tags.map((tag, t) => (
                <Fragment key={tag}>
                  {t > 0 && " "}
                  <Link
                    href={tagHref(locale, "news", tag)}
                    className="hover:underline"
                  >
                    [{tag}]
                  </Link>
                </Fragment>
              ))}
            </p>
            <Link
              href={item.href ?? "#"}
              className="mt-2 text-xl/[24px] font-medium lg:mt-4 lg:text-2xl/[29px]"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
