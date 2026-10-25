/**
 * The file's Brand index item: the name in H4, the categories in Red Caption in
 * brackets, and the availability in Text-2 ("Есть в 2 магазинах" or "Нет в
 * наличии"), 16 above and below. Under the pointer the name turns Red; a brand
 * that is out of stock has a Text-2 name. A click opens the brand's sheet, so it
 * is a button. The rules between rows on a phone are the list's.
 */
export function BrandIndexItem({
  name,
  categories,
  stock,
  inStock = true,
  onOpen,
}: {
  name: string;
  categories: string[];
  /** The line under the categories; left out when empty. */
  stock?: string;
  inStock?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full flex-col items-start gap-1 py-4 text-left"
    >
      <span
        className={`type-h4 transition-colors duration-150 group-hover:text-brand ${
          inStock ? "text-ink" : "text-text-2"
        }`}
      >
        {name}
      </span>
      {categories.length > 0 && (
        <span className="type-caption text-brand">
          {categories.map((c) => `[${c}]`).join(" ")}
        </span>
      )}
      {stock && <span className="type-caption text-text-2">{stock}</span>}
    </button>
  );
}
