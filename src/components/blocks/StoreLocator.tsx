"use client";

import { useState } from "react";
import Image from "next/image";
import { STORES, type Store } from "@/lib/stores";

type StoreLocatorProps = {
  heading?: string;
  stores?: Store[];
  /** 24 between the rows on the home page, 40 on the Магазины page. */
  rowGap?: 24 | 40;
};

/**
 * List of shops on the left, details of the selected one on the right. Drawn at
 * 1840 wide: two 900 columns 40 apart, rows 156 tall with a flush 156 square
 * thumbnail, and the details panel split 462 (text) + 438 (map).
 */
export function StoreLocator({
  heading,
  stores = STORES,
  rowGap = 24,
}: StoreLocatorProps) {
  const [selected, setSelected] = useState(0);
  const active = stores[selected];

  return (
    <section className="px-6 lg:px-10">
      {heading && (
        <h2 className="mb-8 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em]">
          [{heading}]
        </h2>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div
          className="flex flex-col gap-3"
          style={{ rowGap: `${rowGap}px` }}
        >
          {stores.map((store, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex items-center text-left transition-colors lg:h-[156px] ${
                i === selected ? "bg-ink/12" : "bg-ink/6 hover:bg-ink/10"
              }`}
            >
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-surface-strong lg:w-[156px]">
                <Image
                  src={store.image}
                  alt=""
                  fill
                  sizes="156px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2 px-4 lg:gap-5 lg:px-6">
                <p className="text-base font-semibold lg:text-xl/6">{store.name}</p>
                <p className="text-sm lg:text-base/6">{store.address}</p>
                <p className="text-sm lg:text-base/6">Телефон: {store.phone}</p>
              </div>

              <div className="flex shrink-0 items-center gap-4 pr-4 lg:gap-9 lg:pr-[34px]">
                <span className="whitespace-nowrap text-sm lg:text-xl/6">
                  {store.hours}
                </span>
                <Chevron />
              </div>
            </button>
          ))}
        </div>

        <div className="grid bg-ink/6 sm:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_438px]">
          <div className="flex flex-col p-6 lg:p-[17px]">
            <p className="text-lg font-semibold lg:text-xl/9">{active.address}</p>
            <p className="mt-6 text-sm lg:mt-5 lg:text-base/7">
              Часы работы: {active.hours}
            </p>
            <p className="mt-6 text-sm lg:text-base/7">Телефон: {active.phone}</p>
            <a
              href={active.directionsHref ?? "#"}
              className="mt-10 flex h-[47px] w-full max-w-[404px] items-center justify-center border-2 border-ink font-mono text-sm uppercase tracking-[3px] lg:mt-auto"
            >
              Как пройти
            </a>
          </div>

          <div className="relative min-h-64 bg-surface-strong">
            <Image
              src={active.map}
              alt=""
              fill
              sizes="438px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <path d="M3 1.5 8.5 7 3 12.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
