import { describe, expect, it } from "vitest";
import { reachableAssets } from "@/lib/storyblok/assetHost";

describe("адрес файлов Storyblok", () => {
  it("файл с a.storyblok.com получает адрес того же бакета на Amazon", () => {
    expect(reachableAssets("https://a.storyblok.com/f/1/2x3/abc/photo.jpg")).toBe(
      "https://s3.amazonaws.com/a.storyblok.com/f/1/2x3/abc/photo.jpg",
    );
  });

  it("находит адреса в любой глубине ответа и не трогает остальное", () => {
    const answer = {
      story: {
        name: "О нас",
        content: {
          body: [{ image: { filename: "https://a.storyblok.com/f/1/a.jpg", alt: "" } }],
          link: "https://example.com/a.storyblok.com/",
          count: 3,
          none: null,
        },
      },
    };
    expect(reachableAssets(answer)).toEqual({
      story: {
        name: "О нас",
        content: {
          body: [{ image: { filename: "https://s3.amazonaws.com/a.storyblok.com/f/1/a.jpg", alt: "" } }],
          link: "https://example.com/a.storyblok.com/",
          count: 3,
          none: null,
        },
      },
    });
  });

  it("уже переписанный адрес второй раз не меняется", () => {
    const once = reachableAssets("https://a.storyblok.com/f/1/a.jpg");
    expect(reachableAssets(once)).toBe(once);
  });
});
