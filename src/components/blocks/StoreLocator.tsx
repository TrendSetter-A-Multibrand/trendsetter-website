"use client";

import { useState } from "react";
import Image from "next/image";
import { STORES, type Store } from "@/lib/stores";

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
  const active = stores[selected];

  return (
    <section className="px-6 lg:px-10">
      {heading && (
        <h2 className="mb-5 font-mono text-xl uppercase tracking-[3px] lg:text-2xl">
          [{heading}]
        </h2>
      )}

      <div className="grid gap-6 lg:grid-cols-[619px_minmax(0,1fr)] lg:gap-10">
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
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-surface-strong lg:aspect-auto lg:w-[273px]">
                <Image
                  src={store.image}
                  alt=""
                  fill
                  sizes="273px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col px-4 py-4 lg:px-6 lg:pt-[29px]">
                <p className="text-base font-semibold lg:text-xl/6 lg:font-normal">
                  {store.name}
                </p>
                <dl className="mt-3 space-y-1 text-sm lg:mt-5 lg:space-y-[15px] lg:text-base/5">
                  <Row label="Адрес" value={store.address} />
                  <Row label="Телефон" value={store.phone} />
                  <Row label="Часы работы" value={store.hours} />
                </dl>
              </div>

              <div className="flex shrink-0 items-center pr-4 lg:pr-[33px]">
                <Chevron />
              </div>
            </button>
          ))}
        </div>

        <div className="grid bg-surface sm:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[469px_minmax(0,1fr)]">
          <div className="flex flex-col px-6 pb-6 pt-6 lg:pb-[25px] lg:pt-[27px]">
            <p className="text-lg lg:text-xl/6">{active.name}</p>

            {/* 44 apart here against the card's 35 - the panel has the room */}
            <dl className="mt-6 space-y-4 text-sm lg:space-y-6 lg:text-base/5">
              <Row label="Адрес" value={active.address} muted />
              <Row label="Часы работы" value={active.hours} muted />
              <Row label="Телефон" value={active.phone} muted />
              <Row label="Кол-во брендов" value={active.brandCount} muted />
              <Row label="Ассортимент" value={active.assortment} muted />
            </dl>

            <p className="mt-4 text-lg lg:text-xl/6">Как пройти:</p>
            <div className="mt-2 text-sm lg:text-base/[19px]">
              {active.directions.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            <a
              href={active.directionsHref ?? "#"}
              className="mt-10 flex h-[47px] w-full items-center justify-center border-2 border-ink font-mono text-sm uppercase tracking-[3px] lg:mt-auto lg:w-[379px]"
            >
              Построить маршрут
            </a>
          </div>

          <div className="relative min-h-64 bg-surface-strong">
            <Image
              src={active.map}
              alt=""
              fill
              sizes="712px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
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
    <div className="flex gap-2">
      <dt className={muted ? "text-muted" : undefined}>{label}:</dt>
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
