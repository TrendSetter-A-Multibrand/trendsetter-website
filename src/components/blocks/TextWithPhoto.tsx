/**
 * Two 900 columns 40 apart: heading and copy on the left, a square photo with
 * its caption on the right. Both columns start on the same line, which is why
 * the heading carries the mockup's 44px leading rather than none.
 */
export function TextWithPhoto({
  title,
  body,
  caption,
}: {
  title: string;
  body: string;
  caption: string;
}) {
  return (
    <section className="grid gap-10 px-6 lg:grid-cols-2 lg:px-10">
      <div>
        <h2 className="text-2xl lg:text-[36px]/[44px]">{title}</h2>
        <p className="mt-6 text-base lg:mt-10 lg:text-[30px]/9">{body}</p>
      </div>

      <div>
        <div className="aspect-square w-full bg-surface-strong" />
        <p className="mt-4 text-sm lg:mt-6 lg:text-2xl/[29px]">{caption}</p>
      </div>
    </section>
  );
}
