"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { ReadOverlay } from "@/components/ui/ReadOverlay";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useCarousel } from "@/lib/useCarousel";

const THUMB_WIDTH = 56;

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
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  /** Written straight to the DOM: running this through state would re-render every card on every scroll frame. */
  function syncThumb() {
    const track = trackRef.current;
    const bar = barRef.current;
    const thumb = thumbRef.current;
    if (!track || !bar || !thumb) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    thumb.style.transform = `translateX(${
      progress * (bar.clientWidth - THUMB_WIDTH)
    }px)`;
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncThumb();
    const observer = new ResizeObserver(syncThumb);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Dragging the row and the row walking on by itself both move the same scroll
  // position the red block is already following, so it keeps up either way
  useCarousel(trackRef, { autoplay: true });

  function scrollToPointer(clientX: number) {
    const track = trackRef.current;
    const bar = barRef.current;
    if (!track || !bar) return;

    const rect = bar.getBoundingClientRect();
    const usable = rect.width - THUMB_WIDTH;
    const offset = clientX - rect.left - THUMB_WIDTH / 2;
    const progress = usable > 0 ? Math.min(1, Math.max(0, offset / usable)) : 0;
    track.scrollLeft = progress * (track.scrollWidth - track.clientWidth);
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    barRef.current?.setPointerCapture(e.pointerId);
    scrollToPointer(e.clientX);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!barRef.current?.hasPointerCapture(e.pointerId)) return;
    scrollToPointer(e.clientX);
  }

  return (
    <section className="px-6 pt-10 lg:px-10">
      {/* The heading row carries 20 of its own air top and bottom, and the file
          leaves 24 from there to the cards */}
      <div className="mb-6 flex items-center gap-10 py-5">
        <h2 className="whitespace-nowrap font-mono text-2xl/[31.2px] uppercase tracking-[3px]">
          [{heading}]
        </h2>
        {/* The bar runs from the heading to the right margin: a 2px rule with a
            56x24 red block riding it */}
        <div
          ref={barRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          className="relative flex h-6 flex-1 cursor-pointer touch-none select-none items-center"
        >
          <div className="h-0.5 w-full bg-ink" />
          <div
            ref={thumbRef}
            style={{ width: THUMB_WIDTH }}
            className="absolute left-0 h-6 cursor-grab bg-brand active:cursor-grabbing"
          />
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={syncThumb}
        className="flex gap-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href ?? "#"}
            className="group flex w-[70%] shrink-0 flex-col sm:w-[calc(50%-20px)] lg:w-[calc(25%-30px)]"
          >
            {/* Square now, 430x430 four across */}
            <div className="relative aspect-square w-full overflow-hidden">
              <ImagePlaceholder />
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  width={430}
                  height={430}
                  className="h-full w-full object-cover"
                />
              )}
              <ReadOverlay />
            </div>
            <p className="mt-6 font-mono text-sm/[18px] font-medium uppercase tracking-[1px] text-brand">
              {item.tags.map((tag) => `[${tag}]`).join(" ")}
            </p>
            <p className="mt-4 text-2xl/[29px] font-medium">{item.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
