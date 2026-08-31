"use client";

import { useState } from "react";
import { STORES, type Store } from "@/lib/stores";
import { buttonClass } from "@/components/ui/Button";
import { CardImage } from "@/components/ui/CardImage";
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
                <CardImage src={store.image} sizes="273px" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col px-4 py-4 lg:px-6 lg:pt-6">
                <p className="text-base font-medium tracking-[1px] lg:text-2xl/[29px]">
                  {store.name}
                </p>
                <dl className="mt-3 space-y-1 text-sm lg:mt-6 lg:space-y-4 lg:text-base/5">
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

        {/* 429 of text beside the map at the file's own width, stacked under it
            below that. No smaller breakpoint here on purpose: paired with one,
            `wide:` loses - see the note in globals.css. */}
        <div className="grid bg-surface wide:grid-cols-[429px_minmax(0,1fr)] wide:gap-10">
          <div className="flex flex-col p-6">
            <p className="text-lg font-medium tracking-[1px] lg:text-2xl/[29px]">
              {active.name}
            </p>

            {/* 20 tall and 16 apart, the same rows the card carries */}
            <dl className="mt-4 space-y-2 text-sm lg:mt-6 lg:space-y-4 lg:text-base/5">
              <Row label="Адрес" value={active.address} />
              <Row label="Часы работы" value={active.hours} />
              <Row label="Телефон" value={active.phone} />
              <Row label="Кол-во брендов" value={active.brandCount} />
              <Row label="Ассортимент" value={active.assortment} />
            </dl>

            <p className="mt-4 text-lg font-medium tracking-[1px] lg:mt-6 lg:text-2xl/[29px]">
              Как пройти:
            </p>
            <div className="mt-4 text-sm lg:text-base/5">
              {active.directions.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setRouteFor(active)}
              className={`${buttonClass("outline")} mt-10 w-full lg:mt-auto`}
            >
              Построить маршрут
            </button>
          </div>

          {/* Stacked it has no height of its own; beside the text it stretches
              to the row and the minimum stops mattering */}
          <StoreMap
            center={active.coords}
            className="min-h-[320px] overflow-hidden"
          />
        </div>
      </div>

      {routeFor && (
        <StoreRouteModal store={routeFor} onClose={() => setRouteFor(null)} />
      )}
    </section>
  );
}

/**
 * Label and value on one line, 8 apart. The library greys the label down and
 * bolds it in both places the row appears - the card and the panel beside it.
 */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="font-bold text-muted">{label}:</dt>
      <dd className="whitespace-pre-wrap">{value}</dd>
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
