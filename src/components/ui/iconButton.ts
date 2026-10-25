/* The file's Icon button: a 44 square holding a 24 icon. Plain is bare, for the
   header's search and burger and a modal's close; outline carries a 1px Sage rule
   and fills Sage under the pointer, for the arrows of a carousel or a gallery.
   Disabled drops to 30% - the start and end of a strip. A class string like the
   Button's, since it is a <button> in one place and a <Link> in another. */
export function iconButtonClass(style: "plain" | "outline" = "plain") {
  return `inline-flex size-11 shrink-0 items-center justify-center text-ink transition-colors duration-150 disabled:pointer-events-none disabled:opacity-30 aria-disabled:pointer-events-none aria-disabled:opacity-30 ${
    style === "outline" ? "border border-ink hover:bg-ink hover:text-white" : ""
  }`;
}
