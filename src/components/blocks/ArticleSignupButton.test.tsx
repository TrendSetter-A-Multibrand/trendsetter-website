import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ArticleSignupButton } from "@/components/blocks/ArticleSignupButton";
import type { Event } from "@/lib/events";

afterEach(cleanup);

const event = (extra: Partial<Event> = {}) =>
  ({
    uuid: "11111111-1111-1111-1111-111111111111",
    slug: "x",
    href: "/ru_ru/journal/x",
    date: "2999-12-01 18:00",
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

describe("ArticleSignupButton", () => {
  it("рисуется у будущего события с открытой записью", () => {
    render(<ArticleSignupButton event={event()} locale="ru_ru" />);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("не рисуется без события", () => {
    render(<ArticleSignupButton locale="ru_ru" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("не рисуется у прошедшего события", () => {
    render(<ArticleSignupButton event={event({ date: "2020-01-01 10:00" })} locale="ru_ru" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("не рисуется при выключенной записи", () => {
    render(<ArticleSignupButton event={event({ signupEnabled: false })} locale="ru_ru" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
