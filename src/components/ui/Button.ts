/* The button set from the Figma library - page "Buttons", node 2394:8622.
   Every text variant is 48 tall with 16 of air either side and 8 between the
   label and its icon; the label is Inter Tight 400, 14/16, tracked 3, and it is
   typed in caps. Hover only ever repaints the ground - outline swaps its border
   instead, and nothing moves.

   Exported as a class string rather than a component because the same button is
   a <button>, a <Link>, an <a> and a <span> across the site. */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondaryGhost"
  | "secondaryBlack"
  | "whiteOpacity"
  | "blackOpacity"
  | "outline";

const BASE =
  "flex h-12 items-center justify-center gap-2 px-4 font-sans text-sm font-normal uppercase tracking-[3px] transition-colors";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-surface-active text-ink hover:bg-surface",
  /* White ground, muted label - this is the button the red bands carry, and the
     label really is grey there and not ink. */
  secondaryGhost: "bg-white text-muted",
  secondaryBlack: "bg-ink text-white hover:bg-ink-hover",
  whiteOpacity: "bg-white/40 text-white hover:bg-white/60",
  blackOpacity: "bg-ink/40 text-white hover:bg-ink/70",
  outline: "border-2 border-ink text-ink hover:border-ink-hover",
};

export function buttonClass(variant: ButtonVariant) {
  return `${BASE} ${VARIANTS[variant]}`;
}
