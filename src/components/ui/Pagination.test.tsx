import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination, pageWindow } from "@/components/ui/Pagination";
import { byTags, inSection, pageSizeOf, type Article } from "@/lib/articles";

describe("pageWindow", () => {
  it("lists every page when there are few", () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3]);
  });

  it("keeps a thousand articles to a short row with gaps", () => {
    const pageCount = Math.ceil(1000 / pageSizeOf("journal"));
    const middle = pageWindow(Math.floor(pageCount / 2), pageCount);
    expect(middle.length).toBeLessThanOrEqual(10);
    expect(middle[0]).toBe(1);
    expect(middle.at(-1)).toBe(pageCount);
    expect(middle).toContain("gap");
  });

  it("never repeats a number or leaves the range", () => {
    for (const pageCount of [1, 2, 5, 84, 91, 1000]) {
      for (const page of [1, 2, Math.ceil(pageCount / 2), pageCount].map((n) => Math.min(n, pageCount))) {
        const nums = pageWindow(page, pageCount).filter((x): x is number => x !== "gap");
        expect(new Set(nums).size).toBe(nums.length);
        expect(nums.every((n) => n >= 1 && n <= pageCount)).toBe(true);
        expect(nums).toContain(page);
      }
    }
  });
});

describe("Pagination", () => {
  it("draws nothing for a single page", () => {
    const { container } = render(<Pagination page={1} pageCount={1} hrefFor={() => "#"} />);
    expect(container.innerHTML).toBe("");
  });

  it("marks the current page and disables the arrow at the end", () => {
    render(<Pagination page={91} pageCount={91} hrefFor={(n) => `/?page=${n}`} />);
    expect(screen.getByRole("link", { name: "91" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Следующая страница" }).getAttribute("aria-disabled")).toBe("true");
  });
});

describe("a section of a thousand", () => {
  const many: Article[] = Array.from({ length: 1000 }, (_, i) => ({
    title: `Статья ${i}`,
    tags: i % 2 ? ["Мода"] : ["Люди"],
    section: "journal",
    href: `/ru_ru/journal/a-${i}`,
  })) as Article[];

  it("splits into pages without losing one", () => {
    const size = pageSizeOf("journal");
    const articles = byTags(inSection(many, "journal"), []);
    const pages = Math.ceil(articles.length / size);
    const seen = new Set<string>();
    for (let p = 1; p <= pages; p++) articles.slice((p - 1) * size, p * size).forEach((a) => seen.add(a.title));
    expect(seen.size).toBe(1000);
  });
});
