import Link from "next/link";

type Crumb = { label: string; href?: string };

/**
 * Sits directly under the header - the mockup puts the type flush against it
 * and leaves the whole gap below, before the first block at y=192.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="px-6 pb-11 pt-px font-mono text-sm leading-none tracking-[1px] lg:px-10"
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
