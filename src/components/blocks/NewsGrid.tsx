"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";

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
  const [thumb, setThumb] = useState({ left: 0, width: 100 });

  useEffect(() => {
    updateThumb();
  }, [items.length]);

  function updateThumb() {
    const track = trackRef.current;
    if (!track) return;
    const widthPct = Math.min(100, (track.clientWidth / track.scrollWidth) * 100);
    const maxScroll = track.scrollWidth - track.clientWidth;
    const leftPct =
      maxScroll > 0 ? (track.scrollLeft / maxScroll) * (100 - widthPct) : 0;
    setThumb({ left: leftPct, width: widthPct });
  }

  function handleDragStart(e: ReactPointerEvent) {
    const bar = barRef.current;
    const track = trackRef.current;
    if (!bar || !track) return;
    const barRect = bar.getBoundingClientRect();
    const maxScroll = track.scrollWidth - track.clientWidth;

    function moveTo(clientX: number) {
      const ratio = Math.min(1, Math.max(0, (clientX - barRect.left) / barRect.width));
      track!.scrollLeft = ratio * maxScroll;
    }
    moveTo(e.clientX);

    function onMove(ev: PointerEvent) {
      moveTo(ev.clientX);
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <section className="px-6 py-16 lg:px-10">
      <div className="mb-8 flex items-center gap-6">
        <h2 className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em]">
          [{heading}]
        </h2>
        <div
          ref={barRef}
          onPointerDown={handleDragStart}
          className="relative h-px flex-1 cursor-pointer bg-black/20"
        >
          <div
            className="absolute top-1/2 h-2 min-w-10 -translate-y-1/2 cursor-grab bg-brand active:cursor-grabbing"
            style={{ left: `${thumb.left}%`, width: `${thumb.width}%` }}
          />
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateThumb}
        className="flex gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href ?? "#"}
            className="flex w-[70%] shrink-0 flex-col gap-3 sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
          >
            <div className="aspect-[3/2] w-full overflow-hidden bg-neutral-200">
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
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {item.tags.map((tag) => `[${tag}]`).join(" ")}
            </p>
            <p className="font-medium leading-snug">{item.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
