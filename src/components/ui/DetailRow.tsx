/**
 * Label and value on one line, 8 apart. The library greys the label down and
 * bolds it everywhere the row appears - on a shop card, in the panel beside the
 * list, and in the sheet the card opens.
 *
 * Written as a <div> pair rather than <dt>/<dd> so the caller decides: all three
 * places wrap these in a <dl>, and a <div> inside one is allowed.
 */
export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="font-bold text-muted">{label}:</dt>
      <dd className="whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
