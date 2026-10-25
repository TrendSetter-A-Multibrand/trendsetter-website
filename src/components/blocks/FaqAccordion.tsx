"use client";

import { useState } from "react";
import { FilterChip } from "@/components/ui/FilterChip";
import { AccordionItem } from "@/components/cards/AccordionItem";
import type { FaqGroup } from "@/lib/legal";

const groupId = (i: number) => `faq-group-${i}`;

/**
 * The FAQ page: chips that jump down to the groups, then each group as a
 * "[Заголовок]" section head over the file's Accordion items - the question in
 * H4, a plus that turns into a minus, the answer in Text-2 opening over 300 ms.
 * Only one is open at a time.
 */
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="px-4 pb-10 md:px-10">
      {/* Four chips run to about 650 wide, more than a phone measures, so there
          the row swipes edge to edge: negative margins cancel the container's
          padding so the first and last chip do not sit flush to the screen. */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
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
          />
        ))}
      </div>

      {groups.map((group, i) => (
        <section key={group.title} id={groupId(i)} className="mt-12 scroll-mt-24">
          {/* The page title is the first group's own heading, so it carries the h1 */}
          {i === 0 ? (
            <h1 className="type-h2 mb-4">{group.title}</h1>
          ) : (
            <h2 className="type-h2 mb-4">{group.title}</h2>
          )}

          <div className="border-t border-ink">
            {group.items.map((item, j) => {
              const key = `${i}-${j}`;
              return (
                <AccordionItem
                  key={key}
                  question={item.question}
                  open={open === key}
                  onToggle={() => setOpen(open === key ? null : key)}
                >
                  {item.answer}
                </AccordionItem>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
