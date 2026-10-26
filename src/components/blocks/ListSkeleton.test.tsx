import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ListSkeleton } from "@/components/blocks/ListSkeleton";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

afterEach(cleanup);

describe("скелетон списка", () => {
  it("оставляет шапку раздела и фильтры, а карточки заменяет плашками", () => {
    const { container } = render(<ListSkeleton section="journal" locale="ru_ru" />);

    expect(screen.getByRole("heading", { name: "Журнал" })).not.toBeNull();
    expect(screen.getByRole("link", { name: "Все" }).getAttribute("href")).toBe("/ru_ru/journal");
    // lead + three side items + three cards, all hidden from assistive tech
    expect(container.querySelectorAll('[aria-hidden="true"].animate-skeleton-in')).toHaveLength(7);
  });

  it("показывается не сразу: нулевая прозрачность и задержка в анимации", () => {
    const { container } = render(<SkeletonCard />);
    const plate = container.firstElementChild as HTMLElement;

    expect(plate.className).toContain("opacity-0");
    expect(plate.className).toContain("animate-skeleton-in");
  });
});
