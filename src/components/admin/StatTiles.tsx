export type Tile = { label: string; value: string; note?: string };

/**
 * The figures over the cabinet: a rule above each, the label in mono caps and
 * the number large - the way the site sets a fact.
 */
export function StatTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-10">
      {tiles.map((tile) => (
        <div key={tile.label} className="border-t border-ink pt-3">
          <dt className="type-label text-text-2">{tile.label}</dt>
          <dd className="type-h2 mt-2">{tile.value}</dd>
          {tile.note && <dd className="type-caption mt-1 text-text-2">{tile.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
