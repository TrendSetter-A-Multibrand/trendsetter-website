type Group = { title: string; lines: string[] };

/**
 * The file's Info list: one column up to 898 wide, a row for each group - its
 * name in Label and brackets, its lines in Body L under it, 8 between, a Line
 * rule above every row but the first and 16 of air either side of it. 48 over
 * the list on a desktop (24 at 375) and the 128 of the section gap under it,
 * where the form comes.
 */
export function ContactDetails({ groups }: { groups: Group[] }) {
  return (
    <section className="px-4 pb-32 pt-6 md:px-10 md:pt-12">
      <div className="max-w-[898px]">
        {groups.map((group, i) => (
          <div
            key={group.title}
            className={`flex flex-col gap-2 border-line py-4 first:pt-0 ${i > 0 ? "border-t" : ""}`}
          >
            <h2 className="type-label uppercase text-ink">[{group.title}]</h2>
            {group.lines.map((line) => (
              <p key={line} className="type-body-l text-ink">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
