import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SpaceModal } from "@/components/blocks/SpaceModal";
import type { Event } from "@/lib/events";

afterEach(cleanup);

const ev = {
  uuid: "u1",
  slug: "s",
  href: "/ru_ru/journal/s",
  date: "2026-12-01 18:00",
  signupEnabled: true,
  spaceSections: [],
  day: "1",
  month: "дек",
  time: "18:00",
  title: "Показ",
  location: "Атриум",
  ctaLabel: "Подробнее",
} as Event;

describe("окно Пространства", () => {
  it("пустые секции не рисуются", () => {
    render(<SpaceModal card={{ title: "Кафе", body: "Текст" }} onClose={() => {}} />);

    expect(screen.getByText("Текст")).not.toBeNull();
    expect(screen.queryByText(/Наличие в магазинах/)).toBeNull();
    expect(screen.queryByText(/Мероприятия/)).toBeNull();
  });

  it("рисует магазины и мероприятия, когда они есть", () => {
    render(
      <SpaceModal
        card={{ title: "Кафе", stores: [{ name: "Дубровка", available: true }], events: [ev] }}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText(/Наличие в магазинах/)).not.toBeNull();
    expect(screen.getByText("Дубровка")).not.toBeNull();
    expect(screen.getAllByText(/Мероприятия/).length).toBeGreaterThan(0);
    expect(screen.getByText("Показ")).not.toBeNull();
  });
});

describe("ряд мероприятий в окне", () => {
  it("карточки идут одним горизонтальным рядом с полосой прокрутки", () => {
    render(
      <SpaceModal card={{ title: "Кафе", events: [ev, { ...ev, uuid: "u2" }] }} onClose={() => {}} />,
    );
    const track = document.querySelector(".overflow-x-auto");
    expect(track?.children).toHaveLength(2);
    expect(track?.className).toContain("snap-x");
  });
});
