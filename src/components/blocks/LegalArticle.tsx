"use client";

import { useState } from "react";
import { Drop } from "@/components/ui/Drop";
import type { LegalSection } from "@/lib/legal";

/**
 * The long-form legal template, shared by the user agreement, the cookie policy,
 * the consent and the privacy policy - all four are drawn identically.
 *
 * Sizes off the file: the title is 60 mono with 3 of tracking, section headings
 * 32, the body Inter Tight 20 on a 24 line. A hairline at 15% opens the title
 * and closes every section. At 375 the title and the section headings converge
 * on one plain 24px, no caps, while the body drops to 14 on a 16 line with a
 * point of tracking; the desktop numbers above are untouched.
 *
 * The sections are drops, at the designer's asking - these pages run to a couple
 * of hundred clauses and nobody reads them from the top. The lead-in has no
 * heading of its own and so stays open above them.
 */
export function LegalArticle({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <article className="px-4 pb-10 lg:px-10">
      <h1 className="pt-4 font-mono text-2xl/[30px] tracking-[1px] lg:pt-10 lg:uppercase lg:tracking-[3px] lg:text-[60px]/[78px]">
        {title}
      </h1>

      <div className="mt-9 h-px bg-ink/15" />

      {sections.map((section, i) =>
        section.heading ? (
          <Drop
            key={i}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
            title={
              <h2 className="font-mono text-2xl/[30px] tracking-[1px] lg:uppercase lg:tracking-[3px] lg:text-[32px]/[41px]">
                [{section.heading}]
              </h2>
            }
          >
            <Paragraphs section={section} />
          </Drop>
        ) : (
          // The lead-in: no heading in the file, so nothing to drop it behind
          <div key={i} className="mt-9">
            <Paragraphs section={section} />
          </div>
        )
      )}
    </article>
  );
}

function Paragraphs({ section }: { section: LegalSection }) {
  return (
    <div className="space-y-6 text-sm/[16px] tracking-[1px] lg:tracking-normal lg:text-xl/6">
      {section.paragraphs.map((paragraph, j) => (
        <p key={j}>{paragraph}</p>
      ))}
    </div>
  );
}
