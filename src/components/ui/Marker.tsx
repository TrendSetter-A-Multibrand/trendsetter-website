/**
 * The library's Marker: a 16px dot. It stands in front of a shop name in the
 * brand sheet - green where the brand is in stock, red where it is not. The file
 * also drew a yellow and a grey one for states nothing carries; the designer is
 * taking them out of the library, so they are not written here either.
 *
 * Green has no token of its own: the file's Colors page is still a row of
 * unnamed swatches, so it stays written out until it is named.
 */
export type MarkerTone = "green" | "red";

const TONES: Record<MarkerTone, string> = {
  green: "bg-[#71CC98]",
  red: "bg-brand",
};

export function Marker({ tone }: { tone: MarkerTone }) {
  return (
    <span
      aria-hidden="true"
      className={`size-4 shrink-0 rounded-full ${TONES[tone]}`}
    />
  );
}
