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
} as unknown as Article;

describe("карточка статьи", () => {
  it("в списках раздела держит фото высотой 430", () => {
    const { container } = render(<ArticleCard article={article} locale="ru_ru" tall />);

    expect(container.querySelector("a")!.className).toContain("lg:h-[430px]");
  });

  it("в каруселях и поиске остаётся квадратной", () => {
    const { container } = render(<ArticleCard article={article} locale="ru_ru" />);

    expect(container.querySelector("a")!.className).not.toContain("430px");
  });
});
