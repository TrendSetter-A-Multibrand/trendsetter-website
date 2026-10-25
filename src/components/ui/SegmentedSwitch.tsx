/**
 * The file's Segmented switch: two options in one 1px Sage frame, 42 tall, the
 * chosen one filled Sage with a white caption. "Список / Карта" on the shops page
 * on a phone; on a desktop both are shown side by side and the switch is hidden.
 */
export function SegmentedSwitch<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: [{ value: T; label: string }, { value: T; label: string }];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex w-full border border-ink">
      {options.map((option, i) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`type-caption flex h-[42px] flex-1 items-center justify-center transition-colors duration-150 ${
            i > 0 ? "border-l border-ink" : ""
          } ${value === option.value ? "bg-ink text-white" : "bg-white text-ink"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
