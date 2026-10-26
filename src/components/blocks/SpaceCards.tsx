"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/Icons";
import { SpaceModal } from "@/components/blocks/SpaceModal";
import type { SpaceCardData } from "@/lib/space";

export type SpaceCard = SpaceCardData;

const TILE = "on-dark relative block aspect-[4/3] w-full overflow-hidden bg-ink text-white md:aspect-[3/4]";

function TileFace({ card, live = true }: { card: SpaceCard; live?: boolean }) {
  return (
    <>
      {card.image && (
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(min-width: 768px) 31vw, 92vw"
          className="object-cover"
        />
      )}

      {/* Sage at 30% over the whole photo, 40% under the pointer */}
      <div
        className={`absolute inset-0 bg-ink/30 ${
          live ? "transition-colors duration-200 group-hover:bg-ink/40" : ""
        }`}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-4 md:p-6">
        <p className="type-h3 min-w-0 flex-1">{card.title}</p>
        {live && <ArrowIcon size={24} />}
      </div>
    </>
  );
}

/**
 * The file's Tile, three to a row: a 3:4 photo (4:3 at 375) under a Sage veil
 * of 30%, the section's name in H3 White at the foot with an arrow, 24 apart
 * (12 at 375, one to a column). A tile opens the sheet the file draws for it
 * (title, photo, write-up; the shops and events after it only where the editor
 * gave the card availability rows or a section - see SpaceCardsSection). A tile
 * with an address (a Collaboration) is a plain link to its article, drawn the
 * same way. On the Collaborations page (`linksOnly`) there is no sheet at all:
 * a tile with no address is just a picture, not clickable and with no hover.
 */
export function SpaceCards({
  cards,
  linksOnly = false,
}: {
  cards: SpaceCard[];
  /** Collaborations: a tile is a link to its article or nothing - never a sheet. */
  linksOnly?: boolean;
}) {
  const [open, setOpen] = useState<SpaceCard | null>(null);

  return (
    <section className="grid gap-3 px-4 pt-8 md:grid-cols-3 md:gap-6 md:px-10 md:pt-12">
      {/* Keyed by position: the file gives all three the same name */}
      {cards.map((card, i) =>
        // A card with an address is an article page (a Collaboration); one
        // without opens the sheet (a Пространство section)
        card.href ? (
          <Link key={i} href={card.href} className={`${TILE} group`}>
            <TileFace card={card} />
          </Link>
        ) : linksOnly ? (
          <div key={i} className={TILE}>
            <TileFace card={card} live={false} />
          </div>
        ) : (
          <button key={i} type="button" onClick={() => setOpen(card)} className={`${TILE} group text-left`}>
            <TileFace card={card} />
          </button>
        ),
      )}

      {open && <SpaceModal card={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
