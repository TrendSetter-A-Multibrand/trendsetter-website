"use client";

import { useState } from "react";
import { FilterChip } from "@/components/ui/FilterChip";
import { Drop } from "@/components/ui/Drop";
import type { FaqGroup } from "@/lib/legal";

const groupId = (i: number) => `faq-group-${i}`;

/**
 * The FAQ page: chips that jump down to the groups, then each group as a 60px
 * mono heading over rows 100 tall separated by hairlines, at lg. A row carries
 * its question in Inter Tight 24 and a 22px plus at the right margin; opened,
 * the plus becomes a minus and the answer drops in under it. At 375 the group
 * heading is 24/30 without the uppercase/tracking, the question drops to 16,
 * and the rows themselves thin out (see Drop.tsx).
 */
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="px-4 pb-10 lg:px-10">
      {/* Four chips run to about 650 wide, more than the 375 measure, so below
          lg the row scrolls edge-to-edge the same way ArticleFilters does:
          negative margins cancel the container's own padding so the first/last
          chip doesn't sit flush against the viewport. */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&>*]:shrink-0 [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
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
            <h1 className="mt-[41px] font-mono text-2xl/[30px] tracking-[1px] lg:text-[60px]/[78px] lg:uppercase lg:tracking-[3px]">
              {group.title}
            </h1>
          ) : (
            <h2 className="mt-[56px] font-mono text-2xl/[30px] tracking-[1px] lg:text-[60px]/[78px] lg:uppercase lg:tracking-[3px]">
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
                  <span className="text-base/5 uppercase lg:text-2xl/6">
                    {item.question}
                  </span>
                }
              >
                <p className="text-sm/[18px] tracking-[1px] lg:text-xl/6 lg:tracking-normal">
                  {item.answer}
                </p>
              </Drop>
            );
          })}
        </section>
      ))}
    </div>
  );
}
