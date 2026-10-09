import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { ModalEventsRow } from "@/components/blocks/ModalEventsRow";
import type { Event } from "@/lib/events";

vi.mock("next/navigation", () => ({ useParams: () => ({ locale: "ru_ru" }) }));

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(HTMLElement.prototype, "scrollWidth");
  Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
});

const events: Event[] = [1, 2, 3].map((i) => ({
  uuid: `e${i}`,
  slug: `e${i}`,
  href: `/ru_ru/journal/e${i}`,
  date: "2026-09-08 18:00",
  signupEnabled: false,
  spaceSections: [],
  day: "8",
  month: "сентября",
  time: "18:00",
  title: `Событие ${i}`,
  location: "Ереван",
  ctaLabel: "Подробнее",
}));

describe("слайдер событий в окне", () => {
  it("липнет к карточкам и на lg, по левому краю", () => {
    const { container } = render(<ModalEventsRow events={events} />);
    const track = container.querySelector(".overflow-x-auto") as HTMLElement;
    expect(track.className).toContain("snap-x");
    expect(track.className).toContain("snap-mandatory");
    expect(track.className).not.toContain("snap-none");
    expect(track.firstElementChild?.className).toContain("lg:snap-start");
  });

  it("полоса тонкая: линия 1px и ползунок 52", () => {
    // jsdom measures 0: tell it the row overflows, or the bar is not drawn
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", { configurable: true, get: () => 2000 });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", { configurable: true, get: () => 1000 });
    const { container } = render(<ModalEventsRow events={events} />);
    const rule = container.querySelector(".bg-ink") as HTMLElement;
    const thumb = container.querySelector(".bg-brand") as HTMLElement;
    expect(rule.className).toContain("h-px");
    expect(thumb.style.width).toBe("52px");
  });

  it("пустой список ничего не рисует", () => {
    const { container } = render(<ModalEventsRow events={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
