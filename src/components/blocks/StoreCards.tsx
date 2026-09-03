"use client";

import { useState } from "react";
import type { Store } from "@/lib/stores";
import { CardImage } from "@/components/ui/CardImage";
import { DetailRow } from "@/components/ui/DetailRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StoreRouteModal } from "@/components/blocks/StoreRouteModal";

/**
 * The shops as three cards in a row - what the file now draws on the home page
 * and on the shops page alike (2525:6967 and 2443:6321).
 *
 * The panel that stood beside the list, with the map in it, is gone from both.
 * Everything it wrote out - the brand count, the assortment, «Как пройти» and
 * the map itself - now lives in the sheet a card opens, so the card is the way
 * in rather than a row to select.
 *
 * 1840 across: three 587 columns 40 apart. The photo keeps the 273/192 the shop
 * cards have always had, and the grey body under it is 192 tall.
 */
export function StoreCards({
  heading,
  stores,
}: {
  heading?: string;
  stores: Store[];
}) {
  /** Which shop the sheet is open for, if any. */
  const [routeFor, setRouteFor] = useState<Store | null>(null);

  return (
    <section className="px-6 lg:px-10">
      {/* The library's Title with neither control, 40 above the row */}
      {heading && <SectionTitle heading={heading} className="mb-10" />}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {stores.map((store, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRouteFor(store)}
            className="group flex h-full flex-col text-left"
          >
            <div className="relative aspect-[273/192] w-full overflow-hidden">
              <CardImage
                src={store.image}
                sizes="(min-width: 1024px) 587px, (min-width: 640px) 50vw, 100vw"
              />
            </div>

            {/* 192 in the file, but as a floor rather than a fixed height: a
                longer address should push the card down, not spill out of it. */}
            <div className="flex w-full flex-1 flex-col gap-4 bg-surface-active px-6 py-6 lg:min-h-[192px] lg:gap-6">
              <p className="text-lg font-medium tracking-[1px] lg:text-2xl/none">
                {store.name}
              </p>

              {/* 20 tall and 16 apart, the same rows the sheet carries */}
              <dl className="flex flex-1 flex-col gap-2 text-sm lg:gap-4 lg:text-base/5">
                <DetailRow label="Адрес" value={store.address} />
                <DetailRow label="Телефон" value={store.phone} />
                <DetailRow label="Часы работы" value={store.hours} />
              </dl>
            </div>
          </button>
        ))}
      </div>

      {routeFor && (
        <StoreRouteModal store={routeFor} onClose={() => setRouteFor(null)} />
      )}
    </section>
  );
}
