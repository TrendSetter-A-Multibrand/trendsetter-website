import Image from "next/image";

/**
 * The file's Brand tile, for the onboarding "Наши бренды": the logo on Paper with
 * air round it - about 60% of the area - and a Sage plate with the name along the
 * foot, the two inside one Sage rule. Not a link, so no arrow and no hover. 160
 * wide, five across on a desktop and a strip that swipes on a phone. Only the
 * brand's official files go in as the logo.
 */
export function BrandTile({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="flex w-[160px] shrink-0 flex-col border border-ink bg-white">
      <div className="relative flex h-[158px] items-center justify-center bg-surface p-8">
        {logo ? (
          <Image src={logo} alt="" fill sizes="160px" className="object-contain p-8" />
        ) : (
          <span className="type-caption text-text-2">Логотип</span>
        )}
      </div>
      <p className="type-label bg-ink px-4 py-3 text-white">{name}</p>
    </div>
  );
}
