import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CardImage } from "@/components/ui/CardImage";

afterEach(cleanup);

/**
 * The three states the library draws for an image slot. Worth a test because the
 * site once showed the third one under every photo that was still loading: the
 * grey smiley meant «no photo» and was standing in for «not here yet».
 */
describe("CardImage", () => {
  it("под загружающимся фото держит ровный фон, а не битую картинку", () => {
    const { container } = render(<CardImage src="/images/a.jpg" />);
    expect(container.querySelector("img")).not.toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });

  it("без фото сразу показывает заглушку", () => {
    const { container } = render(<CardImage />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("подпись на плашке показывает", () => {
    render(<CardImage src="/images/a.jpg" label="Читать" />);
    expect(screen.getByText("Читать")).not.toBeNull();
  });
});
