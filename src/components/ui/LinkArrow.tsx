import Link from "next/link";

/**
 * The file's Link arrow: a text link in mono caps (Label) with an arrow after it.
 * Underline - a lone link with a 1px rule 2 below. Plain - in a section header,
 * where the header's own rule already leads to it. Hover turns it Red and walks
 * the arrow 4 to the right.
 */
export function LinkArrow({
  href,
  children,
  context = "underline",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  context?: "underline" | "plain";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`type-label group inline-flex items-center gap-2 text-ink transition-colors duration-150 hover:text-brand ${
        context === "underline"
          ? "border-b border-ink pb-0.5 hover:border-brand"
          : ""
      } ${className}`}
    >
      {children}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-150 group-hover:translate-x-1"
      >
        <path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </Link>
  );
}
