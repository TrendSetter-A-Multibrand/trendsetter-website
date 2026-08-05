import Image from "next/image";

type PageCoverProps = {
  title: string;
  imageSrc: string;
};

/**
 * 400px band with the section name over it: 120px mono, 10px tracking. The band
 * reaches up behind the header - the photo, rather than the page's own white, is
 * what shows while the bar slides in and out - and pads the title back down to
 * keep it centred in the 400 that are left below it.
 */
export function PageCover({ title, imageSrc }: PageCoverProps) {
  return (
    <section className="relative mt-[calc(-1*var(--header-h,0px))] flex h-[calc(400px+var(--header-h,0px))] items-center justify-center overflow-hidden bg-neutral-800 pt-[var(--header-h,0px)]">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <h1 className="relative font-mono text-5xl uppercase tracking-[5px] text-white lg:text-[120px] lg:tracking-[10px]">
        [{title}]
      </h1>
    </section>
  );
}
