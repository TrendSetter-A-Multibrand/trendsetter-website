import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SpaceCards } from "@/components/blocks/SpaceCards";

afterEach(cleanup);

describe("высокие карточки", () => {
  it("карточка со ссылкой ведёт на статью и не открывает окно", () => {
    render(<SpaceCards cards={[{ title: "Коллаб", href: "/ru_ru/journal/x" }]} />);

    const link = screen.getByRole("link", { name: "Коллаб" });
    expect(link.getAttribute("href")).toBe("/ru_ru/journal/x");
    fireEvent.click(link);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("карточка без ссылки открывает окно", () => {
    render(<SpaceCards cards={[{ title: "Кафе", body: "Текст" }]} />);

    fireEvent.click(screen.getByRole("button", { name: "Кафе" }));
    expect(screen.getByRole("dialog")).not.toBeNull();
  });

  it("на коллаборациях без ссылки карточка не кнопка и не открывает окно", () => {
    render(<SpaceCards linksOnly cards={[{ title: "Коллаб" }]} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    fireEvent.click(screen.getByText("Коллаб"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("на коллаборациях со ссылкой карточка остаётся ссылкой", () => {
    render(<SpaceCards linksOnly cards={[{ title: "Коллаб", href: "/ru_ru/journal/x" }]} />);

    expect(screen.getByRole("link", { name: "Коллаб" }).getAttribute("href")).toBe(
      "/ru_ru/journal/x",
    );
  });
});
