"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
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
  items?: JournalItem[];
};

const BASE_ITEMS: JournalItem[] = [
  {
    tags: ["Мода", "Тренды"],
    image: "/images/home/journal/1.jpg",
    title:
      "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона",
    excerpt:
      "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона",
  },
  {
    tags: ["Впечатления", "Дом"],
    image: "/images/home/journal/2.jpg",
    title:
      "Не только Dolce&Gabbana: home-коллекции модных брендов, о которых мы могли не знать",
  },
  {
    tags: ["Красота", "Косметика"],
    image: "/images/home/journal/1.jpg",
    title: "Что положить в косметичку: 8 уходовых средств на все случаи жизни",
  },
  {
    tags: ["Комьюнити", "Общество"],
    image: "/images/home/journal/2.jpg",
    title:
      "Карабин, плёнка и Тарковский: как «нишевость» и стремление быть «не как все» превратились в мем",
  },
];

const DEFAULT_ITEMS: JournalItem[] = Array.from(
  { length: 16 },
  (_, i) => BASE_ITEMS[i % BASE_ITEMS.length]
);

export function JournalCarousel({
  heading = "Журнал",
  items = DEFAULT_ITEMS,
}: JournalCarouselProps) {
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  useCarousel(trackRef, { autoplay: true });

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section className="px-6 pt-10 lg:px-10">
      <div className="mb-6 flex items-center justify-between pb-5">
        <h2 className="whitespace-nowrap font-mono text-2xl/[31.2px] uppercase tracking-[3px]">
          [{heading}]
        </h2>
        <div className="flex gap-[44px]">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => scroll(-1)}
            className="flex h-[22px] w-[22px] items-center justify-center text-[22px] leading-none"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Вперёд"
            onClick={() => scroll(1)}
            className="flex h-[22px] w-[22px] items-center justify-center text-[22px] leading-none"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-10 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // The photo is the click target, so the link is stretched over the
          // whole card and the tags ride above it. The stack below the tags
          // lets clicks through to it rather than swallowing them.
          <div
            key={i}
            className="on-dark group relative aspect-[4/3] w-[85%] shrink-0 overflow-hidden sm:aspect-[900/444] sm:w-[calc(50%-20px)]"
          >
            <ImagePlaceholder />
            {item.image && (
              <Image src={item.image} alt="" fill className="object-cover" />
            )}

            {/* Both cards carry this in the mockup: #252120 at 80%, darkest at
                the top and bottom edges and clear through the middle */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink opacity-80" />

            <Link
              href={item.href ?? "#"}
              aria-label={item.title}
              className="absolute inset-0 z-10"
            />

            <p className="absolute left-6 top-6 z-20 font-mono text-sm/[18px] font-medium uppercase tracking-[1px] text-white">
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

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col p-6 text-white">
              <p className="text-xl/[26px] font-medium sm:text-2xl/[29px]">
                {item.title}
              </p>

              {/* Collapsed to zero height at rest so the title lands in the same
                  place on every card, whether or not there is an excerpt */}
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-4 pt-4">
                    {item.excerpt && (
                      <p className="text-sm/[17px]">{item.excerpt}</p>
                    )}
                    <span className="flex h-[49px] items-center justify-center bg-white/40 text-sm uppercase tracking-[3px] text-white backdrop-blur-[2px]">
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
