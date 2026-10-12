type Group = { title: string; lines: string[] };

/**
 * The contacts page proper: bracketed mono headings with their lines under
 * them. On lg the four groups stand in one row across the 1840 measure, 40
 * apart, in the widths the file gives them (205, 410, 410, 695 - the last is
 * the requisites, the longest text); at 375 they stack, 40 apart.
 *
 * The file puts 8 between a heading and its first line, and between lines.
 */
const COLUMN = ["lg:flex-[205]", "lg:flex-[410]", "lg:flex-[410]", "lg:flex-[695]"];

export function ContactDetails({ groups }: { groups: Group[] }) {
  return (
    <section className="flex flex-col gap-10 px-6 py-10 lg:flex-row lg:px-10">
      {groups.map((group, i) => (
        <div
          key={group.title}
          className={`flex min-w-0 flex-col gap-6 lg:gap-2 ${COLUMN[i] ?? "lg:flex-1"}`}
        >
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
