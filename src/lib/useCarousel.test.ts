import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { useCarousel } from "@/lib/useCarousel";

/**
 * jsdom lays nothing out - scrollWidth and clientWidth are both 0 there, so a
 * row is never scrollable by accident - which means the geometry a browser
 * would measure has to be written onto the element by hand. That is the point
 * of these tests rather than a workaround: the row that «would not drag» on the
 * home page was sound in every line of this hook and simply had nothing to
 * scroll, because four news cards measure the row exactly. Numbers in, and what
 * the hook does with them out.
 */
type Row = {
  el: HTMLDivElement;
  /** jsdom scrolls nothing, so the two the hook calls are watched instead. */
  scrollTo: ReturnType<typeof vi.fn>;
  setPointerCapture: ReturnType<typeof vi.fn>;
};

/** A row as it stands at 1920: 1840 wide, cards 430 with 40 between them. */
function makeRow({
  cards,
  cardWidth = 430,
  gap = 40,
  width = 1840,
}: {
  cards: number;
  cardWidth?: number;
  gap?: number;
  width?: number;
}): Row {
  const el = document.createElement("div");
  el.style.columnGap = `${gap}px`;

  for (let i = 0; i < cards; i++) {
    const card = document.createElement("div");
    card.getBoundingClientRect = () => ({ width: cardWidth }) as DOMRect;
    el.appendChild(card);
  }

  const content = cards ? cards * cardWidth + (cards - 1) * gap : 0;
  Object.defineProperty(el, "scrollWidth", {
    configurable: true,
    get: () => content,
  });
  Object.defineProperty(el, "clientWidth", {
    configurable: true,
    get: () => width,
  });

  // The row keeps its own position, which jsdom would otherwise hold at 0
  let left = 0;
  Object.defineProperty(el, "scrollLeft", {
    configurable: true,
    get: () => left,
    set: (value: number) => {
      left = value;
    },
  });

  const scrollTo = vi.fn();
  const setPointerCapture = vi.fn();
  el.scrollTo = scrollTo as unknown as typeof el.scrollTo;
  el.setPointerCapture = setPointerCapture;

  document.body.appendChild(el);
  return { el, scrollTo, setPointerCapture };
}

/** Only the three fields the hook reads off a pointer event. */
function pointer(el: HTMLElement, type: string, clientX: number) {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, { clientX, button: 0, pointerId: 1 });
  el.dispatchEvent(event);
}

// A row walks on by itself only for a reader who has not asked for less motion,
// which is what vitest.setup.ts answers for every test here.
afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("useCarousel", () => {
  it("тянет ряд на пройденное расстояние", () => {
    const row = makeRow({ cards: 19 });
    renderHook(() => useCarousel({ current: row.el }));

    pointer(row.el, "pointerdown", 1500);
    pointer(row.el, "pointermove", 1200);

    expect(row.el.scrollLeft).toBe(300);
  });

  it("дрожание в пару пикселей оставляет клик кликом", () => {
    const row = makeRow({ cards: 19 });
    renderHook(() => useCarousel({ current: row.el }));

    pointer(row.el, "pointerdown", 1500);
    pointer(row.el, "pointermove", 1498);

    expect(row.el.scrollLeft).toBe(0);
    expect(row.setPointerCapture).not.toHaveBeenCalled();
  });

  it("после отпускания больше не тянет", () => {
    const row = makeRow({ cards: 19 });
    renderHook(() => useCarousel({ current: row.el }));

    pointer(row.el, "pointerdown", 1500);
    pointer(row.el, "pointermove", 1200);
    pointer(row.el, "pointerup", 1200);
    pointer(row.el, "pointermove", 900);

    expect(row.el.scrollLeft).toBe(300);
  });

  it("сам шагает на карточку с отступом, пока есть запас", () => {
    vi.useFakeTimers();
    const row = makeRow({ cards: 19 });
    renderHook(() =>
      useCarousel({ current: row.el }, { autoplay: true, interval: 1000 }),
    );

    vi.advanceTimersByTime(1000);

    expect(row.scrollTo).toHaveBeenCalledWith({
      left: 470,
      behavior: "smooth",
    });
  });

  it("ряд без запаса не двигает сам - четыре новости и есть тот случай", () => {
    vi.useFakeTimers();
    // 4x430 + 3x40 = 1840, ровно ширина ряда
    const row = makeRow({ cards: 4 });
    renderHook(() =>
      useCarousel({ current: row.el }, { autoplay: true, interval: 1000 }),
    );

    vi.advanceTimersByTime(5000);

    expect(row.scrollTo).not.toHaveBeenCalled();
    expect(row.el.scrollLeft).toBe(0);
  });

  it("дойдя до конца, возвращается в начало", () => {
    vi.useFakeTimers();
    const row = makeRow({ cards: 19 });
    row.el.scrollLeft = row.el.scrollWidth - row.el.clientWidth;
    renderHook(() =>
      useCarousel({ current: row.el }, { autoplay: true, interval: 1000 }),
    );

    vi.advanceTimersByTime(1000);

    expect(row.scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "smooth" });
  });
});
