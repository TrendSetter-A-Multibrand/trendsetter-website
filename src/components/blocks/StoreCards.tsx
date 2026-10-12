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
 * At 375 they are 320 wide in a row that scrolls, 16 apart, the next one
 * showing past the edge (417 tall with the photo; the file's 2610:32816).
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
    <section className="px-4 lg:px-10">
      {/* The library's Title with neither control, 40 above the row */}
      {heading && <SectionTitle heading={heading} className="mb-4 lg:mb-10" />}

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 [scrollbar-width:none] max-sm:scroll-pl-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-10 [&::-webkit-scrollbar]:hidden">
        {stores.map((store, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRouteFor(store)}
            className="group flex h-full w-[320px] shrink-0 snap-start flex-col text-left sm:w-auto"
          >
            <div className="relative aspect-[273/192] w-full overflow-hidden">
              <CardImage
                src={store.image}
                sizes="(min-width: 1024px) 587px, (min-width: 640px) 50vw, 100vw"
              />
            </div>

            {/* 192 in the file, but as a floor rather than a fixed height: a
                longer address should push the card down, not spill out of it. */}
            <div className="flex w-full flex-1 flex-col gap-4 bg-surface-active p-6 lg:min-h-[192px] lg:gap-6">
              <p className="text-xl/6 font-medium tracking-[1px] lg:text-2xl/none">
                {store.name}
              </p>

              {/* 20 tall and 16 apart at every width now - matches the sheet's
                  rows on lg+, where the sheet still lives; it hasn't followed
                  the card down to 375 yet. */}
              <dl className="flex flex-1 flex-col gap-4 text-base/5">
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
