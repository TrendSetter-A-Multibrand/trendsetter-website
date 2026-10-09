"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SpaceModal } from "@/components/blocks/SpaceModal";
import type { SpaceCardData } from "@/lib/space";

export type SpaceCard = SpaceCardData;

const CARD = "on-dark relative block aspect-[587/727] w-full overflow-hidden";

function CardFace({ card, live = true }: { card: SpaceCard; live?: boolean }) {
  return (
    <>
      <ImagePlaceholder />
      {card.image && (
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 31vw, 92vw"
          className={`object-cover grayscale ${
            live
              ? "transition-[filter,transform] duration-300 group-hover:scale-[1.15] group-hover:grayscale-0"
              : ""
          }`}
        />
      )}

      {/* Black at 60% at the foot, clear by the halfway line */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent to-50%" />

      <p className="absolute inset-x-0 bottom-10 px-10 text-center text-2xl font-medium uppercase tracking-[1px] text-white lg:text-[32px]/[38.72px] lg:tracking-[0.32px]">
        {card.title}
      </p>
    </>
  );
}

/**
 * Three 587x727 photos with their name across the foot, 40 apart on lg. At 375
 * the cards run one to a column, 16 apart instead. A card opens the sheet the
 * file draws for it (2452:7426, the library's Modal reused) with its own
 * title/photo/body, plus the shops and upcoming events where the editor gave
 * the card a section and availability rows (see SpaceCardsSection); a card
 * without them shows only the first half. A card with an address (a
 * Collaboration) is a plain link to its article page, drawn the same way. On
 * the Collaborations page (`linksOnly`) there is no sheet at all: a card with
 * no address is just a picture, not clickable and with no hover.
 *
 * The file draws the first in colour and the other two fully desaturated, which
 * is a hover state written down rather than three different pictures: at rest
 * they are grey, and the one under the pointer comes back to colour and draws
 * 15% closer, same as the other cards on the site (confirmed with the designer
 * 15.09.2026).
 */
export function SpaceCards({
  cards,
  linksOnly = false,
}: {
  cards: SpaceCard[];
  /** Collaborations: a card is a link to its article or nothing - never a sheet. */
  linksOnly?: boolean;
}) {
  const [open, setOpen] = useState<SpaceCard | null>(null);

  return (
    <section className="grid gap-4 px-4 pt-4 lg:grid-cols-3 lg:gap-10 lg:px-10 lg:py-10">
      {/* Keyed by position: the file gives all three the same name */}
      {cards.map((card, i) =>
        // A card with an address is an article page (a Collaboration); one
        // without opens the sheet (a Пространство section)
        card.href ? (
          <Link key={i} href={card.href} className={`${CARD} group`}>
            <CardFace card={card} />
          </Link>
        ) : linksOnly ? (
          <div key={i} className={CARD}>
            <CardFace card={card} live={false} />
          </div>
        ) : (
          <button key={i} type="button" onClick={() => setOpen(card)} className={`${CARD} group text-left`}>
            <CardFace card={card} />
          </button>
        ),
      )}

      {open && (
        <SpaceModal
          card={open}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
