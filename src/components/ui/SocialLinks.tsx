import { SOCIAL_LINKS, type SocialLink } from "@/lib/navigation";

/**
 * The file's Social link: a 44 box with a 1px rule and the network's name in
 * Caption, 16 of air either side. Light - a Sage rule, for the menu; Dark - a
 * white rule on the Sage footer, filling white under the pointer. Light fills
 * Sage under the pointer.
 */
export function SocialLinks({
  links = SOCIAL_LINKS,
  className,
  surface = "light",
}: {
  /** What the editor wrote in the settings; the built-in three until then. */
  links?: SocialLink[];
  className?: string;
  surface?: "light" | "dark";
  /** Kept for the callers that still pass it; the new links are one size. */
  large?: boolean;
}) {
  const tone =
    surface === "dark"
      ? "border-white text-white hover:bg-white hover:text-ink"
      : "border-ink text-ink hover:bg-ink hover:text-white";
  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      {links.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className={`type-caption flex h-11 items-center justify-center border px-4 transition-colors duration-150 ${tone}`}
        >
          {social.label}
        </a>
      ))}
    </div>
  );
}
