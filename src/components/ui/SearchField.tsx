/**
 * 280px wide, underlined, 17px magnifier 24 away from the text. The rule runs
 * the full 280 while the icon starts 25 in, as in the mockups.
 */
export function SearchField({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="flex w-[280px] items-center gap-6 border-b-2 border-ink pb-2 pl-[25px]">
      <SearchIcon />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        className="w-full bg-transparent font-mono text-sm uppercase tracking-[3px] text-ink outline-none placeholder:text-ink/50"
      />
    </label>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
