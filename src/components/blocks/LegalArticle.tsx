import type { LegalSection } from "@/lib/legal";

/**
 * The file's legal page, one template for the user agreement, the cookie policy,
 * the consent and the privacy policy: a column of 770 in the middle of the page,
 * 24 between everything in it. The title in H1, the Legal note - a Marker plate
 * with the date of the edition, only when the document has one - then each
 * section as its heading in Label and brackets over its paragraphs in Body. The
 * lead-in has no heading. Nothing folds and no mascot stands on these pages.
 * 48 of air over the column (24 at 375) and the 128 of the section gap under it.
 */
export function LegalArticle({
  title,
  note,
  sections,
}: {
  title: string;
  /** "Редакция от …": the plate under the title. */
  note?: string;
  sections: LegalSection[];
}) {
  return (
    <article className="px-4 pb-32 pt-6 md:px-10 md:pt-12">
      <div className="mx-auto flex max-w-[770px] flex-col gap-6">
        <h1 className="type-h1 text-ink">{title}</h1>

        {note && (
          <div className="bg-accent-yellow p-4">
            <p className="type-body-s text-ink">{note}</p>
          </div>
        )}

        {sections.map((section, i) => (
          <div key={i} className="contents">
            {section.heading && (
              <h2 className="type-label uppercase text-ink">[{section.heading}]</h2>
            )}
            {section.paragraphs.map((paragraph, j) => (
              <p key={j} className="type-body text-ink">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}
