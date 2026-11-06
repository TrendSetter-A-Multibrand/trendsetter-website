import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { UnsubscribeModal } from "./UnsubscribeModal";
import { isSubscribed, remember } from "@/lib/subscribers";

function openWith(search: string) {
  window.history.replaceState(null, "", `/ru_ru${search}`);
  return render(<UnsubscribeModal locale="ru_ru" />);
}

describe("отписка от рассылки", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => {
    cleanup();
    window.history.replaceState(null, "", "/");
  });

  it("без параметра в ссылке не показывается", () => {
    openWith("");
    expect(screen.queryByText("Отписаться от рассылки")).toBeNull();
  });

  it("почта из ссылки стоит в поле; верный адрес — «Вы отписаны» и адрес забыт", async () => {
    remember("anna@example.ru");
    openWith("?unsubscribe=anna@example.ru");
    const field = (await screen.findByLabelText("E-mail")) as HTMLInputElement;
    expect(field.value).toBe("anna@example.ru");

    fireEvent.click(screen.getByRole("button", { name: "Отписаться" }));
    expect(await screen.findByText("Вы отписаны")).toBeTruthy();
    expect(screen.getByText("Подписаться снова")).toBeTruthy();
    expect(isSubscribed("anna@example.ru")).toBe(false);
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
