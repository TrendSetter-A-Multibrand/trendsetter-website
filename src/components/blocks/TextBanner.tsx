/**
 * 201px red band: a bracketed title and a paragraph, both centred. The 40px
 * padding, the 47px leading on the title and the 29px on the copy are what add
 * up to that height in the mockup.
 */
export function TextBanner({ title, body }: { title: string; body: string }) {
  return (
    <section className="bg-brand px-6 py-10 text-center text-white lg:px-[60px]">
      <h2 className="font-mono text-xl uppercase tracking-[1px] lg:text-[36px]/[47px]">
        [{title}]
      </h2>
      <p className="mt-4 text-base lg:text-2xl/[29px]">{body}</p>
    </section>
  );
}
