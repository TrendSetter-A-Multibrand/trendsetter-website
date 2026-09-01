/**
 * What the library lays over a card's photo, the same on the journal card and
 * the event one. At rest two gradients, each at half strength - black at the top
 * edge and at the foot, both gone by the middle. On hover they give way to one
 * flat black at 50%.
 *
 * Goes inside an element that is `relative` and `group`.
 */
export function CardScrim() {
  return (
    <>
      <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-t from-transparent to-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-black/50" />
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </>
  );
}
