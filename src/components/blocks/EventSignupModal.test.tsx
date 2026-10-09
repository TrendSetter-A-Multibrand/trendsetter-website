import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EventSignupModal } from "@/components/blocks/EventSignupModal";
import type { Event } from "@/lib/events";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const event = (extra: Partial<Event> = {}) =>
  ({
    uuid: "11111111-1111-1111-1111-111111111111",
    slug: "x",
    href: "/ru_ru/journal/x",
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

const answer = (body: unknown, status = 200) =>
  vi.fn().mockResolvedValue({ status, ok: status < 400, json: async () => body });

function open(ev: Event, fetchMock: ReturnType<typeof vi.fn>) {
  vi.stubGlobal("fetch", fetchMock);
  return render(<EventSignupModal event={ev} locale="ru_ru" onClose={() => {}} />);
}

describe("запись на событие", () => {
  it("когда мест нет: текст и отключённые поле и кнопка", async () => {
    open(event({ seats: 10 }), answer({ open: false, left: 0, reason: "full" }));

    await screen.findByText("Мест не осталось");
    expect((screen.getByLabelText("E-mail") as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Записаться" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("регистрация закрыта", async () => {
    open(event(), answer({ open: false, left: null, reason: "closed" }));
    await screen.findByText("Регистрация закрыта");
  });

  it("показывает остаток, если у события есть места", async () => {
    open(event({ seats: 10 }), answer({ open: true, left: 4 }));
    await screen.findByText("Осталось мест: 4");
  });

  it("без заданных мест строки счётчика нет", async () => {
    const fetchMock = answer({ open: true, left: null });
    open(event(), fetchMock);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(screen.queryByText(/Осталось мест/)).toBeNull();
  });

  it("без согласия форма не отправляется", async () => {
    const fetchMock = answer({ open: true, left: null });
    open(event(), fetchMock);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByRole("button", { name: "Записаться" }));

    await screen.findByRole("alert");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("с согласием отправляет запись и пишет об успехе", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ status: 200, json: async () => ({ open: true, left: null }) })
      .mockResolvedValueOnce({ status: 200, json: async () => ({ ok: true, left: null }) });
    open(event(), fetchMock);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Записаться" }));

    await screen.findByText(/Вы записаны/);
    expect(fetchMock.mock.calls[1][0]).toContain("/register");
  });
});
