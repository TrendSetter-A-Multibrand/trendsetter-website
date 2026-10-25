/**
 * The file's Progress bar: a 3 tall Paper track with a Red bar over it, Fill
 * wide. It is the reading progress at the top of an article; the bar's length is
 * the share read, 0 to 1.
 */
export function ProgressBar({ value }: { value: number }) {
  const share = Math.min(Math.max(value, 0), 1);
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(share * 100)}
      className="h-[3px] w-full bg-surface"
    >
      <div className="h-full bg-brand" style={{ width: `${share * 100}%` }} />
    </div>
  );
}
