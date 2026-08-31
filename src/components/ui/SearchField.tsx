/**
 * The search that sits on a page rather than in the header: 280 wide, 48 tall,
 * a 2px rule under the whole of it and the magnifier at the right end, inside
 * the rule. Sentence case and no tracking, unlike the chips beside it.
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
    <label className="flex h-12 w-[280px] items-center border-b-2 border-ink">
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        className="min-w-0 flex-1 bg-transparent text-sm tracking-[1px] text-ink outline-none placeholder:text-ink/40 [&::-webkit-search-cancel-button]:appearance-none"
      />
      <SearchIcon />
    </label>
  );
}

function SearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="10.8" cy="10.8" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="m17.5 17.5 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
