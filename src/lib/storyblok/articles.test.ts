import { describe, expect, it } from "vitest";
import { articleBlock } from "@/lib/storyblok/articles";

const blok = (component: string, fields: Record<string, unknown> = {}) => ({
  _uid: "1",
  component,
  ...fields,
});

describe("articleBlock", () => {
  it("keeps what the editor chose for a photo and falls back to safe values for the rest", () => {
    expect(
      articleBlock(
        blok("article_photo", {
          image: { filename: "/a.jpg" },
          size: "small",
          align: "right",
          ratio: "nonsense",
        }),
      ),
    ).toMatchObject({ kind: "photo", size: "small", align: "right", ratio: "auto" });
  });

  it("reads the old text-and-photo block as photo on the right, half width", () => {
    expect(
      articleBlock(blok("article_text_image", { body: "Один\n\nДва", image: { filename: "/a.jpg" } })),
    ).toMatchObject({ kind: "text-image", side: "right", width: "half", ratio: "square", body: ["Один", "Два"] });
  });

  it("drops photo-row items that have no photo, and lists one item a line", () => {
    const row = articleBlock(
      blok("article_photo_row", {
        items: [blok("article_photo_item", { image: { filename: "/a.jpg" }, caption: "Раз" }), blok("article_photo_item", { image: {} })],
      }),
    );
    expect(row).toMatchObject({ kind: "photo-row", items: [{ image: "/a.jpg", caption: "Раз" }] });
    expect(articleBlock(blok("article_list", { ordered: true, items: "а\n\n б \nв" }))).toMatchObject({
      kind: "list",
      ordered: true,
      items: ["а", "б", "в"],
    });
  });

  it("ignores a block it does not know", () => {
    expect(articleBlock(blok("something_else"))).toBeNull();
  });
});
