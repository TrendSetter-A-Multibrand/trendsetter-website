import Link from "next/link";

/**
 * 42 tall pill with a 2px outline and 14 of padding inside it - 16 from the edge
 * to the label, which is what the mockup measures - and a 14px mono label.
 */
const CHIP =
  "flex h-[42px] items-center rounded-full border-2 px-[14px] font-mono text-sm uppercase tracking-[1px] transition-colors";

const tone = (active: boolean) =>
  active ? "border-brand bg-brand text-white" : "border-black text-brand";

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
}) {
  if (href) {
    return (
      <Link href={href} aria-current={active ? "page" : undefined} className={`${CHIP} ${tone(active)}`}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={`${CHIP} ${tone(active)}`}
    >
      {label}
    </button>
  );
}
