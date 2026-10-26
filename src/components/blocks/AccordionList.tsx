"use client";

import { useState } from "react";
import { AccordionItem } from "@/components/cards/AccordionItem";
import { SectionTitle } from "@/components/ui/SectionTitle";

/**
 * "[Заголовок]" on the file's Section head over a list of Accordion items - the
 * open vacancies on Вакансии: the post and the place in H4, the description
 * opening under it. A rule between items and none under the last. One open at a
 * time. 128 of air over it on a desktop, 64 at 375.
 */
export function AccordionList({
  heading,
  items,
}: {
  heading?: string;
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 pt-16 md:px-10 md:pt-32">
      {heading && <SectionTitle heading={heading} />}
      <div className={`${heading ? "mt-6 md:mt-8" : ""} [&>div:last-child]:border-b-0`}>
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            question={item.question}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          >
            <span className="whitespace-pre-line">{item.answer}</span>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}
