import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import type { Article } from "@/lib/articles";

afterEach(cleanup);

const article = {
  title: "Материал",
  tags: ["Мода"],
  href: "/ru_ru/journal/material",
  section: "journal",
  readingMinutes: 5,
} as unknown as Article;

describe("карточка статьи", () => {
  it("фото 4:3, рубрика в скобках и время чтения", () => {
    const { container, getByText } = render(
      <ArticleCard article={article} locale="ru_ru" />,
    );

    expect(container.querySelector("a")!.className).toContain("aspect-[4/3]");
    expect(getByText("[Мода]")).toBeTruthy();
    expect(getByText("5 мин чтения")).toBeTruthy();
  });

  it("без минут строка времени не рисуется", () => {
    const { queryByText } = render(
      <ArticleCard
        article={{ ...article, readingMinutes: undefined }}
        locale="ru_ru"
      />,
    );

    expect(queryByText(/мин чтения/)).toBeNull();
  });

  it("в списке на телефоне это строка, от 768 — стопка", () => {
    const { container } = render(
      <ArticleCard article={article} locale="ru_ru" layout="list" />,
    );

    expect(container.firstElementChild!.className).toContain("md:flex-col");
  });
});
