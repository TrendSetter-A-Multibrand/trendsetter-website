/**
 * The TRENDSETTER logotype from Figma. Drawn as a CSS mask rather than an <img>
 * so its colour comes from the current text colour - the mockup uses the same
 * artwork in brand red over the hero photo and blended white in the footer.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="TRENDSETTER"
      className={`block aspect-[1840/135] w-full bg-current ${className ?? ""}`}
      style={{
        maskImage: "url(/images/logo.svg)",
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: "url(/images/logo.svg)",
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
