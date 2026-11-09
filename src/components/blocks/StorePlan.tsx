"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SpaceModal } from "@/components/blocks/SpaceModal";

export type PlanZone = { name: string; kind?: string; body?: string; image?: string };

export type StorePlanData = {
  label?: string;
  title: string;
  text?: string;
  image?: string;
  zones: PlanZone[];
};

/**
 * The file's Store plan under "[План магазина]": on the left a Paper card with
 * the shop's name and address, and the list of its zones - number in Caption,
 * name in Body, kind in Caption, two columns of them (one at 375) - and on the
 * right the plan itself, 899 across. At 375 the plan comes first. A zone opens
 * the zone sheet with its own photo and write-up; one with neither stays a plain
 * line.
 *
 * With more than one shop the cards stand one under another in the left column
 * like an accordion: the open one carries its zones under it and its plan on the
 * right, a press on another closes the first and opens that one. One shop is the
 * file's own drawing - a card that is not a button.
 *
 * The file's plan is a drawing the designer has yet to hand over, so the plan
 * is whatever picture the editor sets; until then its slot is the Paper plate the
 * file draws.
 */
export function StorePlans({ plans }: { plans: StorePlanData[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const number = (i: number) => String(i + 1).padStart(2, "0");
  if (plans.length === 0) return null;

  const current = plans[Math.min(active, plans.length - 1)];
  const many = plans.length > 1;
  const zone = open === null ? undefined : current.zones[open];

  const choose = (i: number) => {
    setActive(i);
    setOpen(null);
  };

  return (
    <section className="px-4 pb-32 pt-16 md:px-10 md:pt-32">
      <SectionTitle heading="План магазина" />

      <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[437px_1fr]">
        <div className="flex flex-col gap-6">
          {plans.map((plan, p) => {
            const isOpen = plan === current;
            const card = (
              <>
                <span className="flex min-w-0 flex-1 flex-col gap-3">
                  {plan.label && <span className="type-caption uppercase text-brand">[{plan.label}]</span>}
                  <span className="type-h3 text-ink">{plan.title}</span>
                  {plan.text && <span className="type-body-s text-ink">{plan.text}</span>}
                </span>
                {many && <Chevron open={isOpen} />}
              </>
            );
            return (
              <div key={p} className="flex flex-col gap-6">
                {many ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => choose(p)}
                    className="flex items-start gap-4 bg-surface p-6 text-left transition-colors duration-150 hover:bg-surface-active"
                  >
                    {card}
                  </button>
                ) : (
                  <div className="flex items-start gap-4 bg-surface p-6">{card}</div>
                )}

                {isOpen && plan.zones.length > 0 && (
                  <ul className="grid gap-x-4 md:grid-cols-2">
                    {plan.zones.map((item, i) => {
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
                )}
              </div>
            );
          })}
        </div>

        <div className="relative aspect-[343/300] w-full overflow-hidden bg-surface max-md:order-first md:aspect-[899/560]">
          {current.image && (
            <Image
              key={current.image}
              src={current.image}
              alt={`План магазина ${current.title}`}
              fill
              sizes="(min-width: 768px) 66vw, 92vw"
              className="object-contain"
            />
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

/** One shop: the block the editor puts in alone, drawn as before. */
export function StorePlan(props: StorePlanData) {
  return <StorePlans plans={[props]} />;
}

/** A plus that turns into a minus, the 24 box and 1.5 line the icon set draws in. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.5" />
      {!open && <path d="M12 4v16" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}
