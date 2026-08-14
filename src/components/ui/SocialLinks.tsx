import { SOCIAL_LINKS } from "@/lib/navigation";

/**
 * Brand-red squares with the glyphs exported from Figma. The glyphs are drawn
 * as CSS masks so their colour follows the text colour of the tile.
 */
export function SocialLinks({
  className,
  /** The footer draws them at 48 with 24 between; the side menu keeps 40/12. */
  large,
}: {
  className?: string;
  large?: boolean;
}) {
  return (
    <div className={`flex ${large ? "gap-6" : "gap-3"} ${className ?? ""}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className={`flex items-center justify-center bg-brand text-white ${
            large ? "h-12 w-12" : "h-10 w-10"
          }`}
        >
          <span
            className={`block bg-current ${large ? "h-[26px] w-[26px]" : "h-4 w-4"}`}
            style={{
              maskImage: `url(${social.icon})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: `url(${social.icon})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </a>
      ))}
    </div>
  );
}
