import Link from "next/link";

/**
 * The file's Chip: 44 tall, square, a 1px Sage rule, 16 of air either side and a
 * 12px mono caps label. Hover takes the Paper plate, selected fills Sage with a
 * white label. On a phone they sit in one swipeable row, on desktop they wrap -
 * that is the row's job, not the chip's.
 */
const CHIP =
  "flex h-11 shrink-0 items-center border border-ink px-4 font-mono text-[12px]/[1.3] uppercase tracking-[0.04em] whitespace-nowrap transition-colors duration-150";

const tone = (active: boolean) =>
  active ? "bg-ink text-white" : "bg-white text-ink hover:bg-surface";

export function FilterChip({
  label,
  active = false,
  onClick,
  href,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  /** A chip that changes the address rather than local state. */
  href?: string;
  /** Kept for the callers that still pass it; the new chip has one tracking. */
  tight?: boolean;
}) {
  const cls = `${CHIP} ${tone(active)}`;

  if (href) {
    return (
      <Link href={href} aria-current={active ? "page" : undefined} className={cls}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cls}
    >
      {label}
    </button>
  );
}
