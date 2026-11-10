import { describe, expect, it } from "vitest";
import { publicPath } from "@/lib/i18n/locales";

describe("publicPath", () => {
  it("leaves the default market's prefix off", () => {
    expect(publicPath("/ru_ru/brands")).toBe("/brands");
    expect(publicPath("/ru_ru/events/master-class")).toBe("/events/master-class");
  });

  it("turns the bare prefix into the root and keeps a query or a hash", () => {
    expect(publicPath("/ru_ru")).toBe("/");
    expect(publicPath("/ru_ru/")).toBe("/");
    expect(publicPath("/ru_ru?x=1")).toBe("/?x=1");
    expect(publicPath("/ru_ru/search?q=a%20b")).toBe("/search?q=a%20b");
    expect(publicPath("/ru_ru/faq#a")).toBe("/faq#a");
  });

  it("keeps the other market's prefix and addresses that are not ours", () => {
    expect(publicPath("/ru_am/brands")).toBe("/ru_am/brands");
    expect(publicPath("https://t.me/x")).toBe("https://t.me/x");
    expect(publicPath("/brands")).toBe("/brands");
  });

  it("does not take a longer name for the prefix", () => {
    expect(publicPath("/ru_rustic")).toBe("/ru_rustic");
  });
});
