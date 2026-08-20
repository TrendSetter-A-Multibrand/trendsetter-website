"use client";

import { useState } from "react";
import Image from "next/image";
import { STORES, type Store } from "@/lib/stores";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StoreMap } from "@/components/ui/StoreMap";
import { StoreRouteModal } from "@/components/blocks/StoreRouteModal";

type StoreLocatorProps = {
  heading?: string;
  stores?: Store[];
};

/**
 * Shops down the left, the selected one written out on the right. Drawn at 1840:
 * a 619 column of 192-tall cards 24 apart, then 40 of air, then a 1181 panel
 * split into 469 of text and a 712 map. Three cards and the panel come to the
 * same 624.
 */
export function StoreLocator({ heading, stores = STORES }: StoreLocatorProps) {
  const [selected, setSelected] = useState(0);
  /** Which shop the route sheet is open for, if any. */
  const [routeFor, setRouteFor] = useState<Store | null>(null);
  const active = stores[selected];

  return (
    <section className="px-6 lg:px-10">
      {heading && (
        <h2 className="mb-6 pb-5 font-mono text-xl uppercase tracking-[3px] lg:text-2xl/[31.2px]">
          [{heading}]
        </h2>
      )}

      <div className="grid gap-6 wide:grid-cols-[619px_minmax(0,1fr)] wide:gap-10">
        <div className="flex flex-col gap-6">
          {stores.map((store, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex text-left transition-colors lg:h-[192px] ${
                i === selected
                  ? "bg-surface-active"
                  : "bg-surface hover:bg-surface-active"
              }`}
            >
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden lg:aspect-auto lg:w-[273px]">
                <ImagePlaceholder />
                <Image
                  src={store.image}
                  alt=""
                  fill
                  sizes="273px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col px-4 py-4 lg:px-6 lg:pt-[29px]">
                <p className="text-base font-semibold lg:text-xl/[24px]">
                  {store.name}
                </p>
                {/* Nothing is greyed down here - only the panel does that */}
                <dl className="mt-3 space-y-1 text-sm lg:mt-6 lg:space-y-4 lg:text-base/[19px]">
                  <Row label="Адрес" value={store.address} />
                  <Row label="Телефон" value={store.phone} />
                  <Row label="Часы работы" value={store.hours} />
                </dl>
              </div>

              <div className="flex shrink-0 items-center pr-4 lg:pr-6">
                <Chevron />
              </div>
            </button>
          ))}
        </div>

        <div className="grid bg-surface sm:grid-cols-[minmax(0,1fr)_240px] wide:grid-cols-[429px_minmax(0,1fr)] wide:gap-10">
          <div className="flex flex-col p-6">
            <p className="text-lg font-bold lg:text-xl/[30px]">{active.name}</p>

            {/* Rows are 36 tall and 8 apart, and only here is the label greyed */}
            <dl className="mt-2 space-y-2 text-sm lg:text-base/9">
              <Row label="Адрес" value={active.address} muted />
              <Row label="Часы работы" value={active.hours} muted />
              <Row label="Телефон" value={active.phone} muted />
              <Row label="Кол-во брендов" value={active.brandCount} muted />
              <Row label="Ассортимент" value={active.assortment} muted />
            </dl>

            <p className="mt-2 text-lg font-semibold lg:text-xl/[24px]">
              Как пройти:
            </p>
            <div className="mt-2 text-sm font-medium lg:text-base/[19px]">
              {active.directions.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setRouteFor(active)}
              className="mt-10 flex h-[49px] w-full items-center justify-center border-2 border-ink text-sm uppercase tracking-[3px] transition-colors hover:bg-surface-active lg:mt-auto"
            >
              Построить маршрут
            </button>
          </div>

          <StoreMap
            center={active.coords}
            className="min-h-64 overflow-hidden"
          />
        </div>
      </div>

      {routeFor && (
        <StoreRouteModal store={routeFor} onClose={() => setRouteFor(null)} />
      )}
    </section>
  );
}

/** Label and value on one line; only the panel greys the label down. */
function Row({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <dt className={muted ? "font-bold text-muted" : undefined}>{label}:</dt>
      <dd className={`whitespace-pre-wrap ${muted ? "font-medium" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <path d="M3 1.5 8.5 7 3 12.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
