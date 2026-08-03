"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";

const THUMB_WIDTH = 40;

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
    title:
      "Не только Dolce&Gabbana: home-коллекции модных брендов, о которых мы могли не знать",
  },
  {
    tags: ["Красота", "Косметика"],
    title: "Что положить в косметичку: 8 уходовых средств на все случаи жизни",
  },
  {
    tags: ["Мода", "Тренды"],
    title:
      "Неделя моды весна-лето 2026. Чего (не) ждать от предстоящих показов нового сезона",
  },
  {
    tags: ["Комьюнити", "Общество"],
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
    <section className="px-6 py-16 lg:px-10">
      <div className="mb-8 flex items-center gap-6">
        <h2 className="whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em]">
          [{heading}]
        </h2>
        <div
          ref={barRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          className="relative flex h-4 flex-1 cursor-pointer touch-none select-none items-center"
        >
          <div className="h-px w-full bg-black/20" />
          <div
            ref={thumbRef}
            style={{ width: THUMB_WIDTH }}
            className="absolute left-0 h-4 cursor-grab bg-brand active:cursor-grabbing"
          />
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={syncThumb}
        className="flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href ?? "#"}
            className="flex w-[70%] shrink-0 flex-col gap-3 sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
          >
            <div className="aspect-[3/2] w-full overflow-hidden bg-surface-strong">
              {item.image && (
                <Image
                  src={item.image}
                  alt=""
                  width={400}
                  height={267}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-brand">
              {item.tags.map((tag) => `[${tag}]`).join(" ")}
            </p>
            <p className="font-medium leading-snug">{item.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
