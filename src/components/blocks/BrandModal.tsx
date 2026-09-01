"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Brand } from "@/lib/brands";
import { useLocale } from "@/lib/i18n/useLocale";
import { CardImage } from "@/components/ui/CardImage";
import { Divider } from "@/components/ui/Divider";
import { Marker } from "@/components/ui/Marker";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { EventCard } from "@/components/blocks/EventCard";

/**
 * The library's Modal: a 1280 sheet centred over the dimmed page, 40 of air at
 * the head and the foot and 40 between its four blocks. Everything inside keeps
 * 40 off the edges except the photo, which runs the full width of the sheet.
 */
export function BrandModal({
  brand,
  onClose,
}: {
  brand: Brand;
  onClose: () => void;
}) {
  const locale = useLocale();
  const events = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={brand.name}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-full w-full max-w-[1280px] flex-col gap-10 overflow-y-auto bg-white py-10">
        <div className="flex items-center justify-between gap-6 px-6 lg:px-10">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            {/* 160x55, and the logo keeps its own colours */}
            <div className="relative hidden h-[55px] w-40 shrink-0 lg:block">
              <Image
                src={brand.logo}
                alt=""
                fill
                className="object-contain object-left"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              {/* Inter Tight 24 on a 29 line, not the mono it reads as */}
              <p className="text-2xl/[29px] font-medium uppercase tracking-[1px]">
                {brand.name}
              </p>
              <p className="flex flex-wrap gap-2 font-mono text-sm/[18px] font-medium uppercase tracking-[1px] text-brand">
                {brand.categories.map((category) => (
                  <span key={category}>[{category}]</span>
                ))}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 transition-colors hover:text-brand"
          >
            {/* 18 of ink in a 24 box, the same cross the cookie plate wears */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m3 3 18 18M21 3 3 21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* 400 tall and the full 1280 across - the one block that ignores the
              sheet's own margins */}
          <div className="relative h-[400px] w-full shrink-0">
            <CardImage src={brand.image} sizes="1280px" />
          </div>

          <p className="px-6 text-base/5 lg:px-10">{brand.description}</p>

          <div className="px-6 lg:px-10">
            <Divider />
          </div>
        </div>

        <section className="flex flex-col gap-6">
          <SectionTitle heading="Наличие в магазинах" className="px-6 lg:px-10" />

          {/* 16 apart, the marker 16 off the name. The file paints the names
              #1f3f70 rather than the ink the rest of the sheet is set in. */}
          <ul className="flex flex-col gap-4 px-6 lg:px-10">
            {brand.stores.map((store) => (
              <li
                key={store.name}
                className="flex items-center gap-4 text-sm/[19px] uppercase tracking-[1px] text-[#1F3F70]"
              >
                <Marker tone={store.available ? "green" : "red"} />
                {store.name}
              </li>
            ))}
          </ul>
        </section>

        {brand.events.length > 0 && (
          <section className="flex flex-col gap-6">
            <SectionTitle
              heading="Предстоящие мероприятия"
              trackRef={events}
              controls="bar"
              className="px-6 lg:px-10"
            />

            {/* Two across the sheet at 580, 40 between them */}
            <div
              ref={events}
              className="flex gap-10 overflow-x-auto px-6 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden"
            >
              {brand.events.map((event, i) => (
                <EventCard
                  key={i}
                  item={event}
                  href={`/${locale}/journal/${event.slug}`}
                  sizes="(min-width: 1024px) 580px, 85vw"
                  className="h-[430px] w-[85%] lg:w-[calc(50%-20px)]"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
