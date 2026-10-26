import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Informer } from "@/components/blocks/Informer";
import { TextRows } from "@/components/blocks/TextRows";

afterEach(cleanup);

describe("плашка с кнопкой", () => {
  it("рисует заголовок, текст и кнопку-ссылку", () => {
    render(<Informer title="Остались вопросы?" text="Ответы — в частых вопросах." label="Частые вопросы" href="/ru_ru/faq" />);

    expect(screen.getByRole("heading", { name: "Остались вопросы?" })).not.toBeNull();
    expect(screen.getByRole("link", { name: "Частые вопросы" }).getAttribute("href")).toBe("/ru_ru/faq");
  });

  it("без ссылки кнопки нет, а значок рисуется только по просьбе", () => {
    const { container, rerender } = render(<Informer title="Вопрос" label="Написать" />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(container.querySelector("svg")).toBeNull();

    rerender(<Informer title="Вопрос" icon />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("строки с текстом", () => {
  it("рисует заголовок и текст каждой строки, линия только между строками", () => {
    const { container } = render(
      <TextRows
        rows={[
          { title: "Как вступить", body: "На кассе." },
          { title: "Как копить", body: "За покупки." },
          { title: "Как тратить", body: "Часть покупки." },
        ]}
      />,
    );

    expect(screen.getAllByRole("heading")).toHaveLength(3);
    expect(screen.getByText("За покупки.")).not.toBeNull();
    expect(container.querySelectorAll(".border-t")).toHaveLength(2);
  });
});
