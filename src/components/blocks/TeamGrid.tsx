import Image from "next/image";
import type { TeamMember } from "@/lib/company";
import { SectionTitle } from "@/components/ui/SectionTitle";

/**
 * "[Команда]" on the file's Section head, then the Person cards: a round photo
 * up to 200 - the one round thing the file allows - the name in H4 and the role
 * in Caption Red in brackets. The row fills as wide as it can from 206 a card,
 * 24 apart and 32 between rows; on a phone two across. 128 of air over it and
 * 128 under it, where the form comes.
 *
 * A person with no photo yet is a grey circle; the file's "[Фото]" in it is a
 * note to the designer, not copy.
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <section className="px-4 pb-32 pt-16 md:px-10 md:pt-32">
      <SectionTitle heading="Команда" />

      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-8 md:grid-cols-[repeat(auto-fill,minmax(206px,1fr))] md:gap-x-6">
        {members.map((member, i) => (
          <div key={i} className="flex flex-col items-center gap-2 text-center">
            <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-full bg-surface">
              {member.image && (
                <Image
                  src={member.image}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              )}
            </div>
            <p className="type-h4 text-ink">{member.name}</p>
            {member.role && <p className="type-caption uppercase text-brand">[{member.role}]</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
