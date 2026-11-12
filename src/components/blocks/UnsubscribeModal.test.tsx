import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { UnsubscribeModal } from "./UnsubscribeModal";

function openWith(search: string) {
  window.history.replaceState(null, "", `/ru_ru${search}`);
  return render(<UnsubscribeModal locale="ru_ru" />);
}

describe("отписка от рассылки", () => {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true })));
  beforeEach(() => {
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    cleanup();
    window.history.replaceState(null, "", "/");
  });

  it("без параметра в ссылке не показывается", () => {
    openWith("");
    expect(screen.queryByText("Отписаться от рассылки")).toBeNull();
  });

  it("почта из ссылки стоит в поле; верный адрес — запрос на сервер и «Вы отписаны»", async () => {
    openWith("?unsubscribe=anna@example.ru");
    const field = (await screen.findByLabelText("E-mail")) as HTMLInputElement;
    expect(field.value).toBe("anna@example.ru");

    fireEvent.click(screen.getByRole("button", { name: "Отписаться" }));
    expect(await screen.findByText("Вы отписаны")).toBeTruthy();
    expect(screen.getByText("Подписаться снова")).toBeTruthy();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/newsletter/unsubscribe");
    expect(JSON.parse(String(init.body))).toEqual({ email: "anna@example.ru" });
  });

  it("неверный адрес — подсказка под полем и форма остаётся", async () => {
    openWith("?unsubscribe=anna@example");
    await screen.findByLabelText("E-mail");
    fireEvent.click(screen.getByRole("button", { name: "Отписаться" }));
    expect(await screen.findByText("Проверьте адрес почты")).toBeTruthy();
    expect(screen.queryByText("Вы отписаны")).toBeNull();
  });

  it("закрытие убирает параметр из адреса", async () => {
    openWith("?unsubscribe=anna@example.ru");
    await screen.findByLabelText("E-mail");
    fireEvent.click(screen.getAllByRole("button", { name: "Закрыть" })[0]);
    expect(window.location.search).toBe("");
  });
});
