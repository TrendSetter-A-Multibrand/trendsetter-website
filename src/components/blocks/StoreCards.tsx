"use client";

import { useState } from "react";
import type { Store } from "@/lib/stores";
import { ShopCard } from "@/components/cards/ShopCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StoreRouteModal } from "@/components/blocks/StoreRouteModal";
import { useLocale } from "@/lib/i18n/useLocale";

/**
 * The shops as the file's Shop cards, three across on a desktop and two from 768,
 * 24 apart; on a phone a row that swipes, the cards 343 wide with 16 between so
 * the next one shows. A card is the way in to the sheet with the route, the
 * assortment and the map - everything the old side panel held.
 */
export function StoreCards({
  heading,
  stores,
}: {
  heading?: string;
  stores: Store[];
}) {
  const locale = useLocale();
  /** Which shop the sheet is open for, if any. */
  const [routeFor, setRouteFor] = useState<Store | null>(null);

  return (
    <section className="px-4 md:px-10">
      {heading && (
        <SectionTitle
          heading={heading}
          href={`/${locale}/stores`}
          linkLabel="Все магазины"
          className="mb-6 md:mb-8"
        />
      )}

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 [scrollbar-width:none] max-md:scroll-pl-4 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {stores.map((store, i) => (
          <div key={i} className="w-[343px] max-w-[88vw] shrink-0 snap-start md:w-auto md:max-w-none">
            <ShopCard
              name={store.name}
              image={store.image}
              phone={store.phone}
              facts={[
                { label: "Адрес", value: store.address },
                { label: "Часы", value: store.hours },
                { label: "Телефон", value: store.phone },
              ]}
              onOpen={() => setRouteFor(store)}
            />
          </div>
        ))}
      </div>

      {routeFor && (
        <StoreRouteModal store={routeFor} onClose={() => setRouteFor(null)} />
      )}
    </section>
  );
}
