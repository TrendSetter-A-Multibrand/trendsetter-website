/* The Button set from the Figma file TRENDSETTER WEB 2.0, page "01 Атомы".
   Four kinds by job - primary (Red) is the one action on a screen, secondary
   (Sage) the second, outline (the file's Ghost) the third, inverse (White) sits
   on a Red or dark plane - in three heights, S 36, M 44 and L 56.

   The label is Geist Mono in caps, 14px tracked 4% (12px on S), with 12 between
   it and a 20px icon placed after it. S carries 16 of air either side, M 24, L 32.
   Hover swaps the plate: primary goes Sage, secondary Red, outline and inverse
   fill with Sage. On a Sage plane the inverse button goes Red instead, which is
   `inverseOnDark` (the cookie bar's "Понятно").

   Two kinds the new file does not draw - on a photo, in dark and light glass -
   are kept so the places that use them still work; they only take the new label.
   Pressed and disabled are not drawn either: pressed is one notch past hover,
   disabled the same grey plate as before.

   Exported as a class string rather than a component because the same button is
   a <button>, a <Link>, an <a> and a <span> across the site. A link has no
   `disabled`, so `aria-disabled` styles it the same way. */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "inverse"
  | "inverseOnDark"
  | "onImage"
  | "onImageLight";

export type ButtonSize = "L" | "M" | "S";

const BASE =
  "flex items-center justify-center gap-3 font-mono font-normal uppercase tracking-[0.04em] whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none aria-disabled:pointer-events-none";

const SIZES: Record<ButtonSize, string> = {
  L: "h-14 px-8 text-[14px] leading-[1.2]",
  M: "h-11 px-6 text-[14px] leading-[1.2]",
  S: "h-9 px-4 text-[12px] leading-[1.3]",
};

const SOLID_DISABLED =
  "disabled:bg-surface-active disabled:text-muted aria-disabled:bg-surface-active aria-disabled:text-muted";
const GLASS_DISABLED =
  "disabled:bg-white/40 disabled:text-white aria-disabled:bg-white/40 aria-disabled:text-white";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: `bg-brand text-white hover:bg-ink active:bg-ink-pressed ${SOLID_DISABLED}`,
  secondary: `bg-ink text-white hover:bg-brand active:bg-brand-pressed ${SOLID_DISABLED}`,
  outline:
    "border border-ink text-ink hover:bg-ink hover:text-white active:bg-ink-pressed active:text-white disabled:border-line disabled:text-muted aria-disabled:border-line aria-disabled:text-muted",
  inverse: `bg-white text-ink hover:bg-ink hover:text-white active:bg-ink-pressed active:text-white ${GLASS_DISABLED}`,
  /* The same white plate, but on Sage: it goes Red under the pointer */
  inverseOnDark: `bg-white text-ink hover:bg-brand hover:text-white active:bg-brand-pressed active:text-white ${GLASS_DISABLED}`,
  /* Dark glass: ink at 40% over a 12 blur, so a photo behind it shows through. */
  onImage: `bg-ink/40 text-white backdrop-blur-[12px] hover:bg-ink/70 active:bg-ink-pressed ${GLASS_DISABLED}`,
  /* Light glass: white at 40% over a 6 blur, 60% under the pointer. */
  onImageLight: `bg-white/40 text-white backdrop-blur-[6px] hover:bg-white/60 active:bg-white/70 ${GLASS_DISABLED}`,
};

export function buttonClass(variant: ButtonVariant, size: ButtonSize = "L") {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]}`;
}
