import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { StorePlan } from "@/components/blocks/StorePlan";

afterEach(cleanup);

const zones = [
  { name: "Ателье", kind: "сервис", body: "Подгонка по фигуре" },
  { name: "Товары для дома", kind: "зал" },
];

describe("план магазина", () => {
  it("нумерует зоны и рисует карточку магазина", () => {
    render(<StorePlan label="Скоро открытие" title="ТРЦ" text="Адрес" zones={zones} />);

    expect(screen.getByText("[01]")).not.toBeNull();
    expect(screen.getByText("[02]")).not.toBeNull();
    expect(screen.getByText("[Скоро открытие]")).not.toBeNull();
    expect(screen.getByText("ТРЦ")).not.toBeNull();
  });

  it("зона с описанием открывает окно с номером зоны, зона без него — нет", () => {
    render(<StorePlan title="ТРЦ" zones={zones} />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: /Ателье/ }));
    expect(screen.getByRole("dialog")).not.toBeNull();
    expect(screen.getByText("[Зона 01]")).not.toBeNull();
    expect(screen.getByText("Подгонка по фигуре")).not.toBeNull();
  });
});
