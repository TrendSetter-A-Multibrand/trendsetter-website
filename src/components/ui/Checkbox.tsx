/**
 * 24 square with a 1px rule, the tick 16 across inside it. Drawn white because
 * the only ground it stands on is the red band; the label sits 16 away.
 *
 * The input itself is hidden rather than restyled - `peer` then paints the box
 * from its checked state.
 */
export function Checkbox({
  children,
  name,
  defaultChecked = true,
}: {
  children: React.ReactNode;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-white peer-checked:[&>svg]:opacity-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 opacity-0">
          <path
            d="m5 13 4 4L19 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}
