/** 40 tall pill, 2px outline, 14 of padding, 14px mono label in the brand red. */
export function FilterChip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={`flex h-10 items-center rounded-full border-2 px-[14px] font-mono text-sm uppercase transition-colors ${
        active ? "border-brand bg-brand text-white" : "border-black text-brand"
      }`}
    >
      {label}
    </button>
  );
}
