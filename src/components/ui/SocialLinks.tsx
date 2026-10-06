import { SOCIAL_LINKS, type SocialLink } from "@/lib/navigation";

/**
 * Brand-red squares with the glyphs exported from Figma. The glyphs are drawn
 * as CSS masks so their colour follows the text colour of the tile.
 */
export function SocialLinks({
  links = SOCIAL_LINKS,
  className,
  /** Tiles are 40 either way; the footer sets 24 between them and a 24 glyph,
      the side menu 12 and 16. */
  large,
}: {
  /** What the editor wrote in the settings; the built-in three until then. */
  links?: SocialLink[];
  className?: string;
  large?: boolean;
}) {
  return (
    <div className={`flex ${large ? "gap-6" : "gap-3"} ${className ?? ""}`}>
      {links.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className="flex h-10 w-10 items-center justify-center bg-brand text-white"
        >
          <span
            className={`block bg-current ${large ? "h-6 w-6" : "h-4 w-4"}`}
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
