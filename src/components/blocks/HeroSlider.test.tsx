import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSlider } from "@/components/blocks/HeroSlider";
import type { HeroSlide } from "@/lib/heroSlides";

vi.mock("next/image", () => ({ default: () => null }));

const slide = (n: number): HeroSlide => ({
  title: `Слайд ${n}`,
  lead: "Текст",
  primary: { label: "Читать", href: "/x" },
  image: "/a.jpg",
});
const make = (n: number) => Array.from({ length: n }, (_, i) => slide(i + 1));
const props = { tags: ["Одежда"], socials: [] };

describe("HeroSlider", () => {
  it("one slide: a counter of 1 / 1 and no arrows", () => {
    render(<HeroSlider slides={make(1)} {...props} />);
    expect(screen.getByText("1 / 1")).toBeTruthy();
    expect(screen.queryByLabelText("Следующий слайд")).toBeNull();
  });

  it("two slides still work, and eight count as eight", () => {
    const { unmount } = render(<HeroSlider slides={make(2)} {...props} />);
    expect(screen.getByText("1 / 2")).toBeTruthy();
    unmount();
    render(<HeroSlider slides={make(8)} {...props} />);
    expect(screen.getByText("1 / 8")).toBeTruthy();
    expect(screen.getByLabelText("Следующий слайд")).toBeTruthy();
  });
});
