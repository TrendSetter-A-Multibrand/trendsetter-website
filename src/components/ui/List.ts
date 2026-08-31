/* List and Cell from the library - the panel the header menu hangs and the one
   a dropdown opens. The list itself only carries 8 of padding and a rule along
   its bottom edge; the ground is the caller's, red under the header and white
   inside a form.

   A cell is 24 tall, 16 of air either side, its label Inter Tight 14/16 tracked
   1. Hover fades the label to 40% rather than recolouring it - that is the one
   thing both the white and the black cell do. */

export const listClass = "flex flex-col border-b border-ink/15 py-2";

export function cellClass(tone: "white" | "black") {
  return `flex h-6 items-center gap-4 px-4 font-sans text-sm/4 font-normal normal-case tracking-[1px] transition-colors ${
    tone === "white"
      ? "text-white hover:text-white/40"
      : "text-ink hover:text-ink/40"
  }`;
}
