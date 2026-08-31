/**
 * The library's Skelet: an image slot before its photo arrives - flat #f7f7f7
 * and nothing in it. The file animates nothing here, so neither do we.
 *
 * Sits inside a positioned parent, like the placeholder it stands in for.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-surface ${className}`}
    />
  );
}
