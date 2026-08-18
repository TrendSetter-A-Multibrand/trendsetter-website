import type { TeamMember } from "@/lib/company";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * Six 251 portraits to a row, 62 apart, each with a name and a role under it.
 * The 24/29/16/18/40 stack below the circle is what puts the mockup's rows on a
 * 378px pitch.
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <section className="px-6 pt-10 lg:px-10">
      <h2 className="font-mono text-xl uppercase tracking-[5px] lg:text-[30px]/[39px]">
        [Команда]
      </h2>

      {/* Capped rather than stretched to the column: the mockup's portraits are
          251 with 62 between them, which leaves air on the right rather than
          growing the circles */}
      <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-[62px] lg:max-w-[1818px]">
        {members.map((member, i) => (
          <div key={i} className="text-center">
            <div className="relative aspect-square w-full">
              <ImagePlaceholder className="overflow-hidden rounded-full" />
            </div>
            <p className="mt-4 text-base font-medium lg:mt-6 lg:text-2xl/[29px]">
              {member.name}
            </p>
            {/* One line, as in the mockup: the role is 1px wider than the
                portrait it sits under and would otherwise break in two */}
            <p className="mt-2 font-mono text-xs font-medium uppercase text-brand lg:mt-4 lg:whitespace-nowrap lg:text-sm/[18px]">
              [{member.role}]
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
