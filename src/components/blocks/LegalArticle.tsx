import type { LegalSection } from "@/lib/legal";

/**
 * The long-form legal template, shared by the user agreement, the cookie policy,
 * the consent and the privacy policy - all four are drawn identically.
 *
 * Sizes off the file: the title is 60 mono with 3 of tracking, section headings
 * 32, the body Inter Tight 20 on a 24 line. A hairline at 15% opens the title
 * and every section, and the whole page keeps a 36 rhythm except before a
 * section heading, where the file leaves 41.
 */
export function LegalArticle({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  return (
    <article className="px-6 pb-10 lg:px-10">
      <h1 className="pt-10 font-mono text-4xl/[46px] uppercase tracking-[3px] lg:text-[60px]/[78px]">
        {title}
      </h1>

      {sections.map((section, i) => (
        <section key={i}>
          {section.heading && (
            <h2 className="mt-[41px] font-mono text-2xl/[31px] uppercase tracking-[3px] lg:text-[32px]/[41px]">
              [{section.heading}]
            </h2>
          )}

          <Rule heading={Boolean(section.heading)} />

          <div className="mt-9 space-y-6 text-base/6 lg:text-xl/6">
            {section.paragraphs.map((paragraph, j) => (
              <p key={j}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}

/** 37 under a section heading, 36 under the title - the file draws both. */
function Rule({ heading }: { heading: boolean }) {
  return <div className={`h-px bg-ink/15 ${heading ? "mt-[37px]" : "mt-9"}`} />;
}
