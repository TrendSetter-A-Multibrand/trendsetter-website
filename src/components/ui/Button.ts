/* The button set from the Figma library - page "Buttons", node 2762:13891
   (rebuilt by the designer on 5 Oct 2026; the old set 2394:8622 is now under
   "Deprecated"). Five kinds by job - primary is the one action on a screen,
   secondary the dark companion, outline for equal choices, inverse on red or
   dark bands, on-image over a photo - each in two heights, L 48 and M 40, and
   four states: default, hover, pressed, disabled.

   The label is Inter Tight 400, 14/16, tracked 3, in caps, with 8 between it and
   an icon. L carries 24 of air either side, M carries 16. Disabled is the same
   grey plate (#eee, #888 label) on the solid kinds, a grey border on outline,
   and 40% white on the two that sit on dark or photo.

   Exported as a class string rather than a component because the same button is
   a <button>, a <Link>, an <a> and a <span> across the site. A link has no
   `disabled`, so `aria-disabled` styles it the same way. */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "inverse"
  | "onImage"
  | "onImageLight";

export type ButtonSize = "L" | "M";

const BASE =
  "flex items-center justify-center gap-2 font-sans text-sm font-normal uppercase tracking-[3px] transition-colors disabled:pointer-events-none aria-disabled:pointer-events-none";

const SIZES: Record<ButtonSize, string> = {
  L: "h-12 px-6",
  M: "h-10 px-4",
};

const SOLID_DISABLED =
  "disabled:bg-surface-active disabled:text-muted aria-disabled:bg-surface-active aria-disabled:text-muted";
const GLASS_DISABLED =
  "disabled:bg-white/40 disabled:text-white aria-disabled:bg-white/40 aria-disabled:text-white";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: `bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed ${SOLID_DISABLED}`,
  secondary: `bg-ink text-white hover:bg-ink-hover active:bg-ink-pressed ${SOLID_DISABLED}`,
  outline:
    "border-2 border-ink text-ink hover:bg-surface active:bg-surface-active disabled:border-surface-active disabled:text-muted aria-disabled:border-surface-active aria-disabled:text-muted",
  inverse: `bg-white text-ink hover:bg-surface active:bg-surface-active ${GLASS_DISABLED}`,
  /* Dark glass: ink at 40% over a 12 blur, so a photo behind it shows through. */
  onImage: `bg-ink/40 text-white backdrop-blur-[12px] hover:bg-ink/70 active:bg-ink-pressed ${GLASS_DISABLED}`,
  /* Light glass: white at 40% over a 6 blur, 60% under the pointer. */
  onImageLight: `bg-white/40 text-white backdrop-blur-[6px] hover:bg-white/60 active:bg-white/70 ${GLASS_DISABLED}`,
};

export function buttonClass(variant: ButtonVariant, size: ButtonSize = "L") {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]}`;
}
