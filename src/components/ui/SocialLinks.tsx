import { SOCIAL_LINKS } from "@/lib/navigation";

/**
 * Brand-red squares with the glyphs exported from Figma. The glyphs are drawn
 * as CSS masks so their colour follows the text colour of the tile.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex gap-3 ${className ?? ""}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className="flex h-10 w-10 items-center justify-center bg-brand text-white"
        >
          <span
            className="block h-4 w-4 bg-current"
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
