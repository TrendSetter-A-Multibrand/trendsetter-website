/**
 * The library's Divider: a hairline with 8 of air above and below, 17 tall in
 * all. It separates cells inside a List and never sits at either end of one.
 */
export function Divider() {
  return (
    <div className="py-2">
      <div className="h-px bg-ink/15" />
    </div>
  );
}
