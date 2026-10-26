import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { NewsGrid } from "@/components/blocks/NewsGrid";

/** The row reads the locale off the address, and there is no router here. */
vi.mock("next/navigation", () => ({ useParams: () => ({ locale: "ru_ru" }) }));

afterEach(cleanup);

/** Numbered titles, because what a card is on the page is its title. */
const items = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    tags: ["Мода"],
    title: `Материал ${i + 1}`,
    href: `/ru_ru/journal/material-${i + 1}`,
  }));

/**
 * How many records the row is given is the editors' business, not ours, and the
 * two ends of that are what break: a section emptied down to nothing used to
 * draw a heading over a blank strip, and nobody had ever looked at a hundred.
 */
describe("ряд «Новости»", () => {
  it("при пустом списке не рисует ряд", () => {
    const { container } = render(<NewsGrid items={[]} />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByText(/Последние новости/)).toBeNull();
  });

  it("рисует по карточке на запись", () => {
    render(<NewsGrid items={items(3)} />);

    expect(screen.getAllByText(/^Материал \d+$/)).toHaveLength(3);
    expect(screen.getByText(/Новости/)).not.toBeNull();
  });

  it("на сотне записей рисует все сто", () => {
    render(<NewsGrid items={items(100)} />);

    expect(screen.getAllByText(/^Материал \d+$/)).toHaveLength(100);
  });

  it("заголовок берёт от блока, а не из своего значения по умолчанию", () => {
    render(<NewsGrid heading="Свежее" items={items(2)} />);

    expect(screen.getByText(/Свежее/)).not.toBeNull();
    expect(screen.queryByText(/Последние новости/)).toBeNull();
  });

  it("под пустым состоянием 404 не держит отступ над заголовком", () => {
    const { container } = render(<NewsGrid items={items(2)} underHero />);

    const section = container.firstChild as HTMLElement;
    expect(section.className).toContain("pt-0");
    expect(section.className).not.toContain("lg:pt-[120px]");
  });
});
