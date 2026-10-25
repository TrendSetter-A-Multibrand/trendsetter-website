/**
 * The file's Search field: 44 tall, white, a 1px Sage rule that turns a 2px Red
 * one on focus, the placeholder in Text-2 at Body size and the magnifier, 24, at
 * the right end inside the rule. 280 wide on a desktop page, the full row on a
 * phone.
 */
export function SearchField({
  placeholder,
  value,
  onChange,
  name,
  defaultValue,
  fluid = false,
}: {
  placeholder: string;
  /** For a field inside a plain form: it is sent under this name. */
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Fill whatever width the parent gives, instead of the 280 of a desktop page. */
  fluid?: boolean;
}) {
  return (
    <label className={`flex h-11 w-full items-center gap-3 border border-ink bg-white pl-4 pr-3 focus-within:border-2 focus-within:border-brand focus-within:pl-[15px] focus-within:pr-[11px] ${fluid ? "" : "lg:w-[280px]"}`}>
      <input
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        className="type-body min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-text-2 [&::-webkit-search-cancel-button]:appearance-none"
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
      className="size-6 shrink-0"
    >
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
