import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SeasonWall } from "@/components/blocks/SeasonWall";

afterEach(cleanup);

describe("стена сезона", () => {
  it("четыре строки: на десктопе от 1100 две, на планшете три, на телефоне четыре", () => {
    const { container } = render(<SeasonWall title="Гид по осени" />);
    const rows = [...container.querySelectorAll(".type-season")].map((row) => row.parentElement!.className);

    expect(rows).toHaveLength(4);
    expect(rows.filter((c) => c.includes("min-[1100px]:hidden"))).toHaveLength(1);
    expect(rows.filter((c) => c.includes("md:hidden"))).toHaveLength(1);
  });

  it("строки едут навстречу: Sage вправо, Red влево, и стоят при reduced motion", () => {
    const { container } = render(<SeasonWall title="Гид по осени" />);
    const [first, second] = container.querySelectorAll(".type-season");

    expect(first.className).toContain("animate-season-right");
    expect(first.className).toContain("text-ink");
    expect(second.className).toContain("animate-season-left");
    expect(second.className).toContain("text-brand");
    expect(first.className).toContain("motion-reduce:animate-none");
  });

  it("карточка-гид: метка, заголовок, текст и ссылка", () => {
    render(
      <SeasonWall title="Гид по осени" text="Тренч и вязаное" href="/ru_ru/journal/guide" />,
    );

    expect(screen.getByText("[Сезон]")).not.toBeNull();
    expect(screen.getByText("Гид по осени")).not.toBeNull();
    expect(screen.getByText("Тренч и вязаное")).not.toBeNull();
    expect(screen.getByRole("link", { name: /Читать гид/ }).getAttribute("href")).toBe(
      "/journal/guide",
    );
  });
});
