"use client";

import { CardImage } from "@/components/ui/CardImage";
import { Facts, type Fact } from "@/components/cards/Facts";
import { PhoneIcon, RouteIcon } from "@/components/ui/Icons";

/**
 * The file's Shop card - one object, not a photo with something stuck under it:
 * a 4:3 photo, a Paper plate with the name in H3, the distance and the compact
 * facts, and a panel fixed to the foot with "Позвонить" and "Маршрут", 56 tall,
 * Sage rules between and above, each filling Sage under the pointer. Active (the
 * shop chosen on the map) wears a 1px Sage frame - Sage, not Red. Horizontal sits
 * the photo, 256 wide, beside the plate when the column is 520 or more.
 *
 * The photo and the plate open the shop's sheet; "Маршрут" goes to Yandex Maps when it is given the address, and opens the sheet otherwise.
 */
export function ShopCard({
  name,
  distance,
  facts,
  image,
  phone,
  route,
  active = false,
  layout = "vertical",
  onOpen,
}: {
  name: string;
  /** "1,2 км" - left out when the distance is not known. */
  distance?: string;
  facts: Fact[];
  image?: string;
  /** What "Позвонить" dials. */
  phone?: string;
  /** Where "Маршрут" leads, in a new tab; without it the button opens the sheet. */
  route?: string;
  active?: boolean;
  layout?: "vertical" | "horizontal";
  onOpen: () => void;
}) {
  const horizontal = layout === "horizontal";
  const tel = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;
  const action =
    "type-mono-button flex h-14 flex-1 items-center justify-center gap-3 px-3 text-ink transition-colors duration-150 hover:bg-ink hover:text-white";

  return (
    <article
      className={`group/shop flex bg-surface ${horizontal ? "flex-row" : "flex-col"} ${
        active ? "outline outline-1 -outline-offset-1 outline-ink" : ""
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${name}: подробнее`}
        className={`group relative aspect-[4/3] shrink-0 overflow-hidden bg-surface ${
          horizontal ? "w-[256px] self-stretch" : "w-full"
        }`}
      >
        <CardImage src={image} sizes="(min-width: 1024px) 437px, 100vw" />
      </button>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <button
          type="button"
          onClick={onOpen}
          className="flex flex-col gap-3 p-4 text-left text-ink md:gap-4 md:p-6"
        >
          <span className="flex w-full items-baseline justify-between gap-3">
            <span className="type-h3 min-w-0 flex-1">{name}</span>
            {distance && <span className="type-caption shrink-0">{distance}</span>}
          </span>
          <Facts items={facts} compact />
        </button>

        <div className="flex border-t border-ink">
          {tel ? (
            <a href={tel} className={action}>
              <PhoneIcon />
              Позвонить
            </a>
          ) : (
            <span className={`${action} pointer-events-none opacity-30`}>
              <PhoneIcon />
              Позвонить
            </span>
          )}
          {route ? (
            <a
              href={route}
              target="_blank"
              rel="noopener noreferrer"
              className={`${action} border-l border-ink`}
            >
              <RouteIcon />
              Маршрут
            </a>
          ) : (
            <button type="button" onClick={onOpen} className={`${action} border-l border-ink`}>
              <RouteIcon />
              Маршрут
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
