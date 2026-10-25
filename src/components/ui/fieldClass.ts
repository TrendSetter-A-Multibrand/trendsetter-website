/* The file's Input, Select, Search and Textarea. A field is 56 tall (44 for a
   select and a search), white, with a 1px Sage rule, 16 of air on the left and 12
   on the right and the placeholder in Text-2 at Body size. Focus makes the rule
   2px Red, an error 1px Red with the message under it in Caption.

   On the red bands of the newsletter and the contact form the field is the other
   way round - no plate, a white rule, white text, and a white 2px rule on focus,
   3px on error. The padding gives up a pixel as the border grows, so the text
   stays where it was. */

export type FieldSurface = "light" | "red";

const BASE =
  "type-body w-full pl-4 pr-3 outline-none transition-[border-color] duration-150";

const LIGHT =
  "border border-ink bg-white text-ink placeholder:text-text-2 focus:border-2 focus:border-brand focus:pl-[15px] focus:pr-[11px] aria-[invalid=true]:border-brand";
const RED =
  "border border-white bg-transparent text-white placeholder:text-white/75 focus:border-2 focus:pl-[15px] focus:pr-[11px] aria-[invalid=true]:border-[3px] aria-[invalid=true]:pl-[13px] aria-[invalid=true]:pr-[9px]";

export function fieldClass(
  kind: "input" | "select" | "textarea" = "input",
  surface: FieldSurface = "light"
) {
  const size =
    kind === "input"
      ? "h-14"
      : kind === "select"
        ? "h-11"
        : "min-h-[152px] resize-none py-4";
  return `${BASE} ${size} ${surface === "red" ? RED : LIGHT}`;
}

/** The message under a field in error: Caption, Red on a light ground, white on red. */
export function fieldErrorClass(surface: FieldSurface = "light") {
  return `type-caption ${surface === "red" ? "text-white" : "text-brand"}`;
}
