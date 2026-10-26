/**
 * The file's Text rows: one column up to 898, a row for each topic - its title
 * in H3 over a Body L paragraph of up to 640, 8 apart - with 24 of air either
 * side of a Line rule between rows. What Система лояльности and Подарочные
 * карты are made of. 48 over it on a desktop (24 at 375) and none under, for
 * the informer that follows.
 */
export function TextRows({ rows }: { rows: { title: string; body: string }[] }) {
  return (
    <section className="px-4 pt-6 md:px-10 md:pt-12">
      <div className="max-w-[898px]">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex flex-col gap-2 border-line ${
              i === 0 ? "pb-6" : "border-t py-6"
            }`}
          >
            <h2 className="type-h3 text-ink">{row.title}</h2>
            <p className="type-body-l max-w-[640px] whitespace-pre-line text-ink">{row.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
