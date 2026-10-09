import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { EventCard } from "@/components/blocks/EventCard";
import type { Event } from "@/lib/events";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const event = (extra: Partial<Event> = {}) =>
  ({
    uuid: "11111111-1111-1111-1111-111111111111",
    slug: "x",
    href: "",
    date: "2026-12-01 18:00",
    signupEnabled: true,
    spaceSections: [],
    day: "1",
    month: "дек",
    time: "18:00",
    title: "Мастер-класс",
    location: "Атриум",
    ctaLabel: "Подробнее",
    ...extra,
  }) as Event;

const card = (item: Event) => render(<EventCard item={item} href={item.href} sizes="100vw" />);

describe("карточка события", () => {
  it("с href кнопка — ссылка на статью", () => {
    card(event({ href: "/ru_ru/journal/x" }));
    const link = screen.getByRole("link", { name: "Подробнее" });
    expect(link.getAttribute("href")).toBe("/ru_ru/journal/x");
  });

  it("без href кнопка есть и открывает запись", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ status: 200, ok: true, json: async () => ({ open: true, left: null }) }),
    );
    card(event());
    expect(screen.queryByRole("link")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Подробнее" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("без href и без подписи кнопка — «Записаться»", () => {
    card(event({ ctaLabel: "" }));
    expect(screen.getByRole("button", { name: "Записаться" })).toBeTruthy();
  });
});
