/**
 * The library's Marker: a 16px dot in four colours. It stands in front of a shop
 * name in the brand sheet - green where the brand is in stock, red where it is
 * not, with yellow and grey drawn for states the data does not carry yet.
 *
 * Green and yellow have no token of their own: the file's Colors page is still a
 * row of unnamed swatches, so they stay written out here until it is named.
 */
export type MarkerTone = "green" | "yellow" | "red" | "grey";

const TONES: Record<MarkerTone, string> = {
  green: "bg-[#71CC98]",
  yellow: "bg-[#F3E73F]",
  red: "bg-brand",
  grey: "bg-muted",
};

export function Marker({ tone }: { tone: MarkerTone }) {
  return (
    <span
      aria-hidden="true"
      className={`size-4 shrink-0 rounded-full ${TONES[tone]}`}
    />
  );
}
