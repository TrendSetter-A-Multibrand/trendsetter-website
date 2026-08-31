"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ReadOverlay } from "@/components/ui/ReadOverlay";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
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
  items?: NewsItem[];
};

const BASE_ITEMS: NewsItem[] = [
  {
    tags: ["Впечатления", "Дом"],
    image: "/images/home/news/1.jpg",
    title:
      "Не только Dolce&Gabbana: home-коллекции модных брендов, о которых мы могли не знать",
  },
  {
    tags: ["Красота", "Косметика"],
    image: "/images/home/news/2.jpg",
    title: "Что положить в косметичку: 8 уходовых средств на все случаи жизни",
  },
  {
    tags: ["Мода", "Тренды"],
    image: "/images/home/news/3.jpg",
    title:
      "Неделя моды весна-лето 2026. Чего (не) ждать от предстоящих показов нового сезона",
  },
  {
    tags: ["Комьюнити", "Общество"],
    image: "/images/home/news/4.jpg",
    title:
      "Карабин, пленка и Тарковский: как «нишевость» и стремление быть «не как все» превратились в мем",
  },
];

const DEFAULT_ITEMS: NewsItem[] = Array.from(
  { length: 20 },
  (_, i) => BASE_ITEMS[i % BASE_ITEMS.length]
);

export function NewsGrid({
  heading = "Последние новости",
  items = DEFAULT_ITEMS,
}: NewsGridProps) {
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  // Dragging the row and the row walking on by itself both move the same scroll
  // position the red block is already following, so it keeps up either way
  useCarousel(trackRef, { autoplay: true });

  return (
    <section className="px-6 pt-10 lg:px-10">
      {/* The heading row carries 20 of its own air top and bottom, and the file
          leaves 24 from there to the cards */}
      <SectionTitle
        heading={heading}
        trackRef={trackRef}
        controls="bar"
        className="mb-6 py-5"
      />

      <div
        ref={trackRef}
        className="flex gap-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // Photo and title lead to the piece, each tag to the news page cut
          // down to that tag - so three links, not one wrapping the card
          <div
            key={i}
            className="group flex w-[70%] shrink-0 flex-col sm:w-[calc(50%-20px)] lg:w-[calc(25%-30px)]"
          >
            {/* Square now, 430x430 four across */}
            <Link
              href={item.href ?? "#"}
              tabIndex={-1}
              aria-hidden="true"
              className="relative aspect-square w-full overflow-hidden"
            >
              <ImagePlaceholder />
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  width={430}
                  height={430}
                  // `relative` only so the photo paints over the placeholder
                  // underneath it - this is the one card whose image is not `fill`
                  className="relative h-full w-full object-cover"
                />
              )}
              <ReadOverlay />
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
              className="mt-4 text-2xl/[29px] font-medium"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
