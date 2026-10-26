"use client";

import { useEffect, useState } from "react";
import { FilterChip } from "@/components/ui/FilterChip";
import { AccordionItem } from "@/components/cards/AccordionItem";
import type { FaqGroup } from "@/lib/legal";

const groupId = (i: number) => `faq-group-${i}`;

/**
 * The FAQ page: a bar that sticks under the header with a Chip for every group -
 * the one in view Selected, a press scrolling to its group - and then the groups
 * as the file's faq-sec. On a desktop the group's name in H3 stands on columns
 * 1-4 and its questions, the file's Accordion items, on the right, 576 in; below
 * 1280 the name is over them. A rule between questions and none under the last;
 * only one is open at a time. 48 over the first group and between groups (24 and
 * 32 at 375).
 */
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  // The chip of the group that crosses the upper third of the screen is the current one
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(Number(entry.target.getAttribute("data-index")));
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    document.querySelectorAll("[data-faq-group]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [groups.length]);

  return (
    <div>
      <div className="sticky top-[var(--header-h,116px)] z-20 border-b border-line bg-white py-3">
        {/* One row that swipes on a phone, wraps on a desktop */}
        <div className="flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:flex-wrap md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden">
          {groups.map((group, i) => (
            <FilterChip
              key={group.title}
              label={group.title}
              active={current === i}
              onClick={() => {
                setCurrent(i);
                document.getElementById(groupId(i))?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 px-4 py-6 md:gap-12 md:px-10 md:py-12">
        {groups.map((group, i) => (
          <section
            key={group.title}
            id={groupId(i)}
            data-faq-group
            data-index={i}
            className="flex scroll-mt-[calc(var(--header-h,116px)+80px)] flex-col gap-4 xl:grid xl:grid-cols-[437px_1fr] xl:gap-x-[139px]"
          >
            <h2 className="type-h3 text-ink">{group.title}</h2>

            <div className="[&>div:last-child]:border-b-0">
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
    </div>
  );
}
