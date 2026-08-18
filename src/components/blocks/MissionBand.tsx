import { Wordmark } from "@/components/ui/Wordmark";

/**
 * The red band on О нас that took the place of the running line: a heading in
 * brackets over one centred paragraph, 40 of padding all round, with the
 * wordmark laid across the whole width behind it.
 */
export function MissionBand({
  heading = "Наша миссия",
  body,
}: {
  heading?: string;
  body: string;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-brand px-6 py-10 text-white lg:px-10">
      {/* The file blends the wordmark onto the band under SCREEN. Over a flat
          red that resolves to a lighter red and nothing else, so paint the
          colour it arrives at rather than asking the browser to blend. */}
      <Wordmark className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-[#dd4145]" />

      <div className="relative flex flex-col items-center gap-4">
        <h2 className="font-mono text-xl uppercase tracking-[0.3px] lg:text-[30px]/[39px]">
          [{heading}]
        </h2>
        <p className="text-center text-base/5 font-medium lg:text-xl/[24.2px]">
          {body}
        </p>
      </div>
    </section>
  );
}
