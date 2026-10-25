/**
 * The file's Checkbox: a 20 square with a 1px rule and the label 12 away in Body S.
 * Light - a Sage box, filled Sage with a white tick when checked. Red - on the red
 * band the box is white, filled white with a Red tick when checked. The whole row
 * is the click target.
 *
 * The input itself is hidden rather than restyled - `peer` then paints the box
 * from its checked state.
 */
export function Checkbox({
  children,
  name,
  defaultChecked = true,
  surface = "red",
  required,
}: {
  children: React.ReactNode;
  name: string;
  defaultChecked?: boolean;
  /** Which ground it stands on; the red band is where it is used today. */
  surface?: "light" | "red";
  required?: boolean;
}) {
  const red = surface === "red";
  return (
    <label className="type-body-s flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        required={required}
        className="peer sr-only"
      />
      <span
        className={`flex size-5 shrink-0 items-center justify-center border peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-current peer-checked:[&>svg]:opacity-100 ${
          red
            ? "border-white peer-checked:bg-white peer-checked:text-brand"
            : "border-ink bg-white peer-checked:bg-ink peer-checked:text-white"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="none" className="size-5 opacity-0">
          <path
            d="m5 10.5 3.5 3.5L15 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}
