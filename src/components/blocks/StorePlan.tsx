"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SpaceModal } from "@/components/blocks/SpaceModal";

export type PlanZone = { name: string; kind?: string; body?: string; image?: string };

/**
 * The file's Store plan under "[План магазина]": on the left a Paper card with
 * the shop's name and address, and the list of its zones - number in Caption,
 * name in Body, kind in Caption, two columns of them (one at 375) - and on the
 * right the plan itself, 899 across. At 375 the plan comes first. A zone opens
 * the zone sheet with its own photo and write-up; one with neither stays a plain
 * line.
 *
 * The file's plan is a drawing the designer has yet to hand over, so the plan
 * is whatever picture the editor sets; until then its slot is the Paper plate the
 * file draws.
 */
export function StorePlan({
  label,
  title,
  text,
  image,
  zones,
}: {
  label?: string;
  title: string;
  text?: string;
  image?: string;
  zones: PlanZone[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const number = (i: number) => String(i + 1).padStart(2, "0");
  const zone = open === null ? undefined : zones[open];

  return (
    <section className="px-4 pb-32 pt-16 md:px-10 md:pt-32">
      <SectionTitle heading="План магазина" />

      <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[437px_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 bg-surface p-6">
            {label && <p className="type-caption uppercase text-brand">[{label}]</p>}
            <h3 className="type-h3 text-ink">{title}</h3>
            {text && <p className="type-body-s text-ink">{text}</p>}
          </div>

          <ul className="grid gap-x-4 md:grid-cols-2">
            {zones.map((item, i) => {
              const inside = (
                <>
                  <span className="type-caption shrink-0 uppercase text-text-2">[{number(i)}]</span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="type-body text-ink">{item.name}</span>
                    {item.kind && (
                      <span className="type-caption uppercase text-text-2">{item.kind}</span>
                    )}
                  </span>
                </>
              );
              const row = "flex items-baseline gap-3 py-3 text-left";
              return (
                <li key={i}>
                  {item.body || item.image ? (
                    <button
                      type="button"
                      onClick={() => setOpen(i)}
                      className={`${row} w-full transition-colors duration-150 hover:text-brand`}
                    >
                      {inside}
                    </button>
                  ) : (
                    <div className={row}>{inside}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative aspect-[343/300] w-full overflow-hidden bg-surface max-md:order-first md:aspect-[899/560]">
          {image && (
            <Image src={image} alt="План магазина" fill sizes="(min-width: 768px) 66vw, 92vw" className="object-contain" />
          )}
        </div>
      </div>

      {zone && open !== null && (
        <SpaceModal
          card={{ title: zone.name, body: zone.body, image: zone.image, label: `Зона ${number(open)}` }}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
