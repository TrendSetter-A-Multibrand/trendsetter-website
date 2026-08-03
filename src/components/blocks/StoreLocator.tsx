"use client";

import { useState } from "react";
import Image from "next/image";

type Store = {
  name: string;
  address: string;
  hours: string;
  phone: string;
  image?: string;
  findHref?: string;
  directionsHref?: string;
};

type StoreLocatorProps = {
  heading?: string;
  stores?: Store[];
};

const DEFAULT_STORES: Store[] = [
  {
    name: "Дубровка",
    address: 'Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»',
    hours: "12:00 – 21:00",
    phone: "8 926 794 97 42",
    findHref: "#",
    directionsHref: "#",
  },
  {
    name: "Дубровка",
    address: 'Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»',
    hours: "12:00 – 21:00",
    phone: "8 926 794 97 42",
    findHref: "#",
    directionsHref: "#",
  },
  {
    name: "Дубровка",
    address: 'Новодмитровская 1 стр. 13. Пространство «Хлебозавод №9»',
    hours: "12:00 – 21:00",
    phone: "8 926 794 97 42",
    findHref: "#",
    directionsHref: "#",
  },
];

export function StoreLocator({
  heading = "Магазины",
  stores = DEFAULT_STORES,
}: StoreLocatorProps) {
  const [selected, setSelected] = useState(0);
  const active = stores[selected];

  return (
    <section className="px-6 py-16 lg:px-10">
      <h2 className="mb-8 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em]">
        [{heading}]
      </h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          {stores.map((store, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex items-center gap-4 p-4 text-left ${
                i === selected ? "bg-surface-strong" : "bg-surface"
              }`}
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden bg-neutral-300">
                {store.image && (
                  <Image
                    src={store.image}
                    alt=""
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{store.name}</p>
                <p className="text-sm text-foreground/70">{store.address}</p>
                <p className="text-sm text-foreground/70">Телефон: {store.phone}</p>
              </div>
              <span className="whitespace-nowrap text-sm text-foreground/70">
                {store.hours}
              </span>
              <span aria-hidden="true">›</span>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2">
          <div className="flex flex-col gap-4 bg-surface p-6">
            <p className="font-semibold">{active.address}</p>
            <p className="text-sm text-foreground/70">Часы работы: {active.hours}</p>
            <p className="text-sm text-foreground/70">Телефон: {active.phone}</p>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <a
                href={active.findHref ?? "#"}
                className="border border-neutral-900 bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-wider"
              >
                Найти магазин
              </a>
              <a
                href={active.directionsHref ?? "#"}
                className="border border-neutral-900 bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-wider"
              >
                Как пройти
              </a>
            </div>
          </div>

          <div className="min-h-64 bg-surface-strong" />
        </div>
      </div>
    </section>
  );
}
