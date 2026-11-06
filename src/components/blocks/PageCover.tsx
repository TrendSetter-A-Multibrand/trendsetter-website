type PageCoverProps = {
  title: string;
  /** One line under the title, in Text-2. */
  subtitle?: string;
  /** The covers used to carry a photo; the new file's section header has none. Kept so callers need not change. */
  imageSrc?: string;
  flush?: boolean;
  short?: boolean;
  /** A widget set at the foot of the header, right of the title (the news page's events). */
  aside?: React.ReactNode;
};

/**
 * The file's Section header, "Band": no ground and no photo - the section's name
 * in H1 with a Body L line of Text-2 under it, set at the foot of a low band
 * that is the same height on every section (224 on a desktop, 40 left either
 * side; on a phone it takes what it needs, 16 either side). The subtitle is one
 * line. The page's crumbs sit above it.
 *
 * With an `aside` the band is a 12-column grid: the title and its line on 1-6
 * (1-5 under 1300), the aside on 7-12 (6-12), pressed to the foot. On a phone it
 * goes under the lead.
 */
export function PageCover({ title, subtitle, aside }: PageCoverProps) {
  const head = (
    <>
      <h1 className="type-h1 text-ink">{title}</h1>
      {subtitle && <p className="type-body-l text-text-2">{subtitle}</p>}
    </>
  );
  if (!aside) {
    return (
      <section className="flex flex-col justify-end gap-3 px-4 py-6 md:h-56 md:gap-4 md:px-10 md:py-8">
        {head}
      </section>
    );
  }
  return (
    <section className="grid gap-6 px-4 py-6 md:min-h-56 md:grid-cols-12 md:items-end md:gap-x-6 md:px-10 md:py-8">
      <div className="flex flex-col gap-3 md:col-span-5 md:gap-4 min-[1300px]:col-span-6">{head}</div>
      <div className="md:col-span-7 min-[1300px]:col-span-6">{aside}</div>
    </section>
  );
}
