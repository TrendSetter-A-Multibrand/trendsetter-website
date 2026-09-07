import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EventsCarousel } from "@/components/blocks/EventsCarousel";
import type { Event as SiteEvent } from "@/lib/events";

vi.mock("next/navigation", () => ({ useParams: () => ({ locale: "ru_ru" }) }));

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(HTMLElement.prototype, "scrollWidth");
  Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
});

/**
 * The width a browser would measure. jsdom gives every element 0, so a row is
 * never scrollable here unless it is told what it looks like.
 */
function withGeometry({ content, width }: { content: number; width: number }) {
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get: () => content,
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => width,
  });
}

const events = (count: number): SiteEvent[] =>
  Array.from({ length: count }, (_, i) => ({
    slug: `event-${i + 1}`,
    day: "8",
    month: "сентября",
    time: "18:00",
    title: `Событие ${i + 1}`,
    location: "Хлебозавод №9",
    ctaLabel: "Подробнее",
  }));

/** The row itself is the section's last child; the title is the first. */
const trackOf = (container: HTMLElement) =>
  container.querySelector("section")!.lastElementChild as HTMLElement;

/**
 * The arrows and the news row's red bar are two faces of the same control, so
 * what is checked here holds for both: a control that cannot move must not be
 * drawn. Three event cards measure the row exactly - as four news cards do -
 * and the arrows used to sit there doing nothing on every click.
 *
 * The arrows are checked rather than the bar because they have an accessible
 * name to ask for; the bar is a block of colour with nothing to call it by.
 */
describe("ряд «Ближайшие события»", () => {
  it("прячет стрелки, когда ряд помещается целиком", () => {
    withGeometry({ content: 1840, width: 1840 });
    render(<EventsCarousel items={events(3)} />);

    expect(screen.queryByRole("button", { name: "Вперёд" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Назад" })).toBeNull();
    expect(screen.getByText(/Ближайшие события/)).not.toBeNull();
  });

  it("показывает стрелки, когда есть запас", () => {
    withGeometry({ content: 11866, width: 1840 });
    render(<EventsCarousel items={events(19)} />);

    expect(screen.getByRole("button", { name: "Вперёд" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Назад" })).not.toBeNull();
  });

  it("стрелка листает на карточку с отступом", () => {
    withGeometry({ content: 11866, width: 1840 });
    const { container } = render(<EventsCarousel items={events(19)} />);

    // 587 - карточка события при 1920, 40 - отступ между ними
    const track = trackOf(container);
    track.style.columnGap = "40px";
    (track.firstElementChild as HTMLElement).getBoundingClientRect = () =>
      ({ width: 587 }) as DOMRect;
    const scrollBy = vi.fn();
    track.scrollBy = scrollBy;

    fireEvent.click(screen.getByRole("button", { name: "Вперёд" }));

    expect(scrollBy).toHaveBeenCalledWith({ left: 627, behavior: "smooth" });
  });

  it("при пустом списке не рисует ряд", () => {
    const { container } = render(<EventsCarousel items={[]} />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByText(/Ближайшие события/)).toBeNull();
  });
});
