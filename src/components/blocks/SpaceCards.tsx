"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { InfoModal } from "@/components/blocks/InfoModal";

export type SpaceCard = { title: string; body?: string; image?: string };

/**
 * Three 587x727 photos with their name across the foot, 40 apart on lg. At 375
 * the cards run one to a column, 16 apart instead. A card opens the sheet the
 * file draws for it (2452:7426, the library's Modal reused) with its own
 * title/photo/body rather than the brand fields that instance carries - a
 * Space card has neither stores nor events to show.
 *
 * The file draws the first in colour and the other two fully desaturated, which
 * is a hover state written down rather than three different pictures: at rest
 * they are grey, and the one under the pointer comes back to colour and draws
 * 15% closer, same as the other cards on the site (confirmed with the designer
 * 15.09.2026).
 */
export function SpaceCards({ cards }: { cards: SpaceCard[] }) {
  const [open, setOpen] = useState<SpaceCard | null>(null);

  return (
    <section className="grid gap-4 px-4 pt-4 lg:grid-cols-3 lg:gap-10 lg:px-10 lg:py-10">
      {/* Keyed by position: the file gives all three the same name */}
      {cards.map((card, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setOpen(card)}
          className="on-dark group relative aspect-[587/727] w-full overflow-hidden text-left"
        >
          <ImagePlaceholder />
          {card.image && (
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 31vw, 92vw"
              className="object-cover grayscale transition-[filter,transform] duration-300 group-hover:scale-[1.15] group-hover:grayscale-0"
            />
          )}

          {/* Black at 60% at the foot, clear by the halfway line */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent to-50%" />

          <p className="absolute inset-x-0 bottom-10 px-10 text-center text-2xl font-medium uppercase tracking-[1px] text-white lg:text-[32px]/[38.72px] lg:tracking-[0.32px]">
            {card.title}
          </p>
        </button>
      ))}

      {open && (
        <InfoModal
          title={open.title}
          body={open.body}
          image={open.image}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
