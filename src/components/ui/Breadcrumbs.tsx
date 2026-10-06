import Link from "next/link";

type Crumb = { label: string; href?: string };

/**
 * Sits flush under the header in the mockups, with the whole gap left to the
 * block that follows - which is why there is no padding below the type. None of
 * the 375 frames draw it (only the article has its own trail), so it starts at lg.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="hidden px-6 pt-px font-mono text-sm leading-none tracking-[1px] lg:block lg:px-10"
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label}>
            {i > 0 && <span className="px-2">/</span>}
            {item.href && !last ? (
              <Link href={item.href} className="transition-colors hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span className={last ? "text-brand" : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
