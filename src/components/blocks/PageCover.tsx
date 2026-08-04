import Image from "next/image";

type PageCoverProps = {
  title: string;
  imageSrc: string;
};

/** 400px band with the section name over it: 120px mono, 10px tracking. */
export function PageCover({ title, imageSrc }: PageCoverProps) {
  return (
    <section className="relative flex h-[400px] items-center justify-center overflow-hidden bg-neutral-800">
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
