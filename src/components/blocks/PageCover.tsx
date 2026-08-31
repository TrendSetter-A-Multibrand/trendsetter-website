import Image from "next/image";

type PageCoverProps = {
  title: string;
  /** One line under the title, white, in the mockup's sans. */
  subtitle?: string;
  imageSrc: string;
  /** False where breadcrumbs sit between the header and the band. */
  flush?: boolean;
};

/**
 * 400px band opening a section: the name in brand red, 96px mono with 5px of
 * tracking, and a line of white under it. The photo is knocked back 50%, which
 * is what the designer wrote against every cover in the file.
 *
 * Where it opens a page it reaches up behind the header - the photo, rather than
 * the page's own white, is what shows while the bar slides in and out - and pads
 * the title back down to keep it centred in the 400 that are left below it.
 */
export function PageCover({
  title,
  subtitle,
  imageSrc,
  flush = true,
}: PageCoverProps) {
  return (
    <section
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-neutral-800 ${
        flush
          ? "mt-[calc(-1*var(--header-h,0px))] h-[calc(400px+var(--header-h,0px))] pt-[var(--header-h,0px)]"
          : "h-[400px]"
      }`}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Blended, not solid: the same LINEAR_DODGE the wordmark over the home
          photo uses, so the picture reads through the letters. Every section
          title in the file is drawn this way. */}
      <h1 className="relative font-mono text-5xl uppercase tracking-[5px] text-brand mix-blend-plus-lighter lg:text-[96px]/[125px]">
        [{title}]
      </h1>

      {subtitle && (
        // The two sit against each other in the file: the title's 125 line
        // leaves the air, and 154 of type centred in 400 is what it comes to
        <p className="relative text-lg font-medium tracking-[1px] text-white lg:text-2xl/[29px]">
          {subtitle}
        </p>
      )}
    </section>
  );
}
