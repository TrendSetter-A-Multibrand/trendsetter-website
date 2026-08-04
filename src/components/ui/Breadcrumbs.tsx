import Link from "next/link";

type Crumb = { label: string; href?: string };

/**
 * Sits flush under the header in the mockups, with the whole gap left to the
 * block that follows - which is why there is no padding below the type.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="px-6 pt-px font-mono text-sm leading-none tracking-[1px] lg:px-10"
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
