type PageCoverProps = {
  title: string;
  /** One line under the title, in Text-2. */
  subtitle?: string;
  /** The covers used to carry a photo; the new file's section header has none. Kept so callers need not change. */
  imageSrc?: string;
  flush?: boolean;
  short?: boolean;
};

/**
 * The file's Section header, "Band": no ground and no photo - the section's name
 * in H1 with a Body L line of Text-2 under it, set at the foot of a low band
 * that is the same height on every section (224 on a desktop, 40 left either
 * side; on a phone it takes what it needs, 16 either side). The subtitle is one
 * line. The page's crumbs sit above it.
 */
export function PageCover({ title, subtitle }: PageCoverProps) {
  return (
    <section className="flex flex-col justify-end gap-3 px-4 py-6 md:h-56 md:gap-4 md:px-10 md:py-8">
      <h1 className="type-h1 text-ink">{title}</h1>
      {subtitle && <p className="type-body-l text-text-2">{subtitle}</p>}
    </section>
  );
}
