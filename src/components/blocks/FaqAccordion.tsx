"use client";

import { useState } from "react";
import { FilterChip } from "@/components/ui/FilterChip";
import { Drop } from "@/components/ui/Drop";
import type { FaqGroup } from "@/lib/legal";

const groupId = (i: number) => `faq-group-${i}`;

/**
 * The FAQ page: chips that jump down to the groups, then each group as a 60px
 * mono heading over rows 100 tall separated by hairlines. A row carries its
 * question in Inter Tight 24 and a 22px plus at the right margin; opened, the
 * plus becomes a minus and the answer drops in under it.
 */
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="px-6 pb-10 lg:px-10">
      <div className="flex flex-wrap gap-2">
        {groups.map((group, i) => (
          // None of them is drawn as current: they only jump down the page
          <FilterChip
            key={group.title}
            label={group.title}
            onClick={() =>
              document
                .getElementById(groupId(i))
                ?.scrollIntoView({ behavior: "smooth" })
            }
            tight
          />
        ))}
      </div>

      {groups.map((group, i) => (
        <section key={group.title} id={groupId(i)}>
          {/* The page title is the first group's own heading, so it carries the h1 */}
          {i === 0 ? (
            <h1 className="mt-[41px] font-mono text-4xl/[46px] uppercase tracking-[3px] lg:text-[60px]/[78px]">
              {group.title}
            </h1>
          ) : (
            <h2 className="mt-[56px] font-mono text-4xl/[46px] uppercase tracking-[3px] lg:text-[60px]/[78px]">
              {group.title}
            </h2>
          )}

          <div className="mt-9 h-px bg-ink/15" />

          {group.items.map((item, j) => {
            const key = `${i}-${j}`;
            return (
              <Drop
                key={key}
                open={open === key}
                onToggle={() => setOpen(open === key ? null : key)}
                title={
                  <span className="text-lg/6 uppercase lg:text-2xl/6">
                    {item.question}
                  </span>
                }
              >
                <p className="text-base/6 lg:text-xl/6">{item.answer}</p>
              </Drop>
            );
          })}
        </section>
      ))}
    </div>
  );
}
