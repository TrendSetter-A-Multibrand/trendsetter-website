/**
 * Frosted plate that fades in over a card image on hover, matching the one on
 * the journal cards on the home page. The image is dimmed underneath it: the
 * plate is white at 40% and would disappear over a light photo otherwise.
 * Expects a `group` ancestor with `position: relative`.
 */
export function ReadOverlay({ label = "Читать" }: { label?: string }) {
  return (
    <>
      <span className="pointer-events-none absolute inset-0 bg-black/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-6 bottom-6 flex h-[49px] items-center justify-center bg-white/40 text-sm font-medium uppercase tracking-[0.15em] text-white opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </>
  );
}
