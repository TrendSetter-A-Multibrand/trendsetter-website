import { buttonClass } from "@/components/ui/Button";

/**
 * The hover state the file draws on a card's photo: the picture dimmed to half
 * and the library's translucent button 24 in from the edges.
 *
 * Over a photo that never came the dimming would have nothing to dim, so the
 * file swaps it for flat #eeeeee and takes the darker of the two buttons.
 *
 * Expects a `group` ancestor with `position: relative`.
 */
export function ReadOverlay({
  label = "Читать",
  broken = false,
}: {
  label?: string;
  broken?: boolean;
}) {
  return (
    <>
      <span
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
          broken ? "bg-surface-active" : "bg-black/50"
        }`}
      />
      {/* Opacity lives on the wrapper: the button carries a colour transition of
          its own, and one element cannot animate two properties from two classes */}
      <span className="pointer-events-none absolute inset-x-6 bottom-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span
          className={`${buttonClass(
            broken ? "blackOpacity" : "whiteOpacity"
          )} backdrop-blur-[2px]`}
        >
          {label}
        </span>
      </span>
    </>
  );
}
