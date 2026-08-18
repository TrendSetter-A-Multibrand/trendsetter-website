type Group = { title: string; lines: string[] };

/**
 * The contacts page proper: bracketed mono headings with their lines under
 * them, 40 apart, over the whole 1840 measure.
 *
 * The file gives the first group 16 between heading and line where every other
 * one has 24; taken as a slip and set to 24 throughout.
 */
export function ContactDetails({ groups }: { groups: Group[] }) {
  return (
    <section className="flex flex-col gap-10 px-6 py-10 lg:px-10">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-6">
          <h2 className="font-mono text-xl uppercase tracking-[0.24px] lg:text-2xl/[31.2px]">
            [{group.title}]
          </h2>
          {group.lines.map((line) => (
            <p key={line} className="text-base tracking-[0.2px] lg:text-xl/[24.2px]">
              {line}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
